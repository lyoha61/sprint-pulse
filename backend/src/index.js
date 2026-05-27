import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';

const METRIC_TITLES_RU = {
	1: 'выполнение задач',
	2: 'возвраты на ревью',
	3: 'загрузка команды',
	4: 'пропущенные баги',
	5: 'завершение спринта',
};

function getMetricTitleRu(metric) {
	return METRIC_TITLES_RU[metric.metricId] || metric.title || 'метрика';
}

function getMetricFromContext(context, metricId) {
	return context.find((metric) => metric.metricId === metricId);
}

function formatValue(metric) {
	if (!metric) {
		return 'нет данных';
	}

	const value = metric.rawValue ?? metric.value;
	const unit = metric.unit || '';

	return `${value}${unit ? ` ${unit}` : ''}`;
}

const STATUS_RU = {
	normal: 'норма',
	warning: 'внимание',
	critical: 'проблема',
};

function getContextLine(metric) {
	const title = getMetricTitleRu(metric);
	const current = formatValue(metric);
	const previous =
		metric.previousValue !== null && metric.previousValue !== undefined
			? `${metric.previousValue} ${metric.unit || ''}`.trim()
			: 'нет данных';
	const statusRu = STATUS_RU[metric.status] || metric.status;
	const trendSign = metric.trendPercent > 0 ? '+' : '';

	return `- ${title}: ${current} (было ${previous}, изменение ${trendSign}${metric.trendPercent}%) — статус: ${statusRu}`;
}

// Разделяем контекст на проблемные и нормальные метрики,
// чтобы модель сразу видела, что важно, а что — фоновая информация.
function buildContextSections(context) {
	const problems = context.filter((m) => m.status !== 'normal');
	const normal = context.filter((m) => m.status === 'normal');

	const problemsText =
		problems.length > 0
			? `Проблемные метрики:\n${problems.map(getContextLine).join('\n')}`
			: 'Проблемных метрик нет.';

	const normalText =
		normal.length > 0
			? `Метрики в норме (фон):\n${normal.map(getContextLine).join('\n')}`
			: '';

	return [problemsText, normalText].filter(Boolean).join('\n\n');
}

// Форматирует историю метрики за несколько спринтов в читаемую строку с датами.
// Пример: «Спринт 2 (15.01–28.01): 1.8, Спринт 3 (01.02–14.02): 2.2 — растёт 2 спринта подряд»
function formatHistory(history, unit = '') {
	if (!history || history.length === 0) return null;

	const points = history.map((h) => {
		const date = h.dateRange ? ` (${h.dateRange})` : '';
		return `${h.sprintLabel}${date}: ${h.value}${unit ? ' ' + unit : ''}`;
	}).join(', ');

	if (history.length >= 2) {
		const allGrowing = history.every((h, i) => i === 0 || h.value >= history[i - 1].value);
		const allFalling = history.every((h, i) => i === 0 || h.value <= history[i - 1].value);
		const first = history[0].value;
		const last = history[history.length - 1].value;

		if (allGrowing && last > first) return `${points} — растёт ${history.length} спринта подряд`;
		if (allFalling && last < first) return `${points} — падает ${history.length} спринта подряд`;
	}

	return points;
}

app.use(express.json());

function buildFallbackInsight(metric, context = []) {
	const targetId = metric.metricId;
	const currentValue = formatValue(metric);

	const averageCompletion = getMetricFromContext(context, 1);
	const reviewReturns = getMetricFromContext(context, 2);
	const teamLoad = getMetricFromContext(context, 3);
	const escapedBugs = getMetricFromContext(context, 4);
	const sprintCompletion = getMetricFromContext(context, 5);

	// Возвраты на ревью: если растут баги — объясняем связь с числами
	if (targetId === 2 && escapedBugs && escapedBugs.status !== 'normal') {
		const bugsValue = formatValue(escapedBugs);
		return `Возвраты (${currentValue}) растут вместе с багами в продакшне (${bugsValue}).`;
	}

	// Выполнение задач: тянет за собой завершение спринта
	if (targetId === 1 && sprintCompletion && sprintCompletion.status !== 'normal') {
		const burndownValue = formatValue(sprintCompletion);
		return `Выполнение задач (${currentValue}) снижает завершение спринта (${burndownValue}).`;
	}

	// Завершение спринта: виноваты задачи
	if (targetId === 5 && averageCompletion && averageCompletion.status !== 'normal') {
		const completionValue = formatValue(averageCompletion);
		return `Спринт (${currentValue}) не закрыт — выполнение задач просело до ${completionValue}.`;
	}

	// Пропущенные баги: связь с частыми ревью-возвратами
	if (targetId === 4 && reviewReturns && reviewReturns.status !== 'normal') {
		const reviewValue = formatValue(reviewReturns);
		return `${currentValue} багов в продакшне при частых возвратах на ревью (${reviewValue}).`;
	}

	// Загрузка команды: смотрим тренд
	if (targetId === 3) {
		if (teamLoad && teamLoad.trend === 'up') {
			return `Загрузка выросла до ${currentValue} — риск выгорания при росте параллельных задач.`;
		}
		return `Загрузка ${currentValue} — контролируйте распределение задач между участниками.`;
	}

	// Универсальные фоллбэки с реальным значением
	if (metric.aiRiskLevel === 'critical') {
		return `Показатель ${currentValue} — критическое отклонение, нужен разбор причин.`;
	}

	if (metric.aiRiskLevel === 'warning') {
		return `Показатель ${currentValue} — есть отклонение, проверьте связь с другими метриками.`;
	}

	return `Показатель ${currentValue} — динамика стабильная, сильных отклонений нет.`;
}

function sanitizeInsight(text) {
	return String(text || '')
		.replace(/["'`]/g, '')
		.replace(/\*\*/g, '')
		.replace(/^ответ:\s*/i, '')
		.replace(/^рекомендация:\s*/i, '')
		.replace(/^вот\s+/i, '')
		.replace(/^примерный текст[^:]*:\s*/i, '')
		.replace(/^короткая рекомендация[^:]*:\s*/i, '')
		.replace(/^для карточки[^:]*:\s*/i, '')
		.replace(/^для команды разработки[^:]*:\s*/i, '')
		.replace(/^текст:\s*/i, '')
		.replace(/[\u3000-\u9fff\uff00-\uffef]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

// Шаг 3: разрешаем технические аббревиатуры (PR, API, WIP и т.д.),
// проверяем только наличие длинных английских слов (4+ букв подряд) —
// именно они сигнализируют, что модель ответила на английском.
const ALLOWED_TECH_TERMS = /\b(PR|API|WIP|QA|CI|CD|UX|UI|SLA|KPI|OKR)\b/gi;

function hasTooMuchEnglish(text) {
	const stripped = text.replace(ALLOWED_TECH_TERMS, '');
	const longLatinWords = stripped.match(/[a-zA-Z]{4,}/g) || [];

	return longLatinWords.length >= 2;
}

function limitInsightLength(text, maxLength = 120) {
	if (!text) return '';

	// Если текст влезает — возвращаем как есть, только добавляем точку
	if (text.length <= maxLength) {
		return text.endsWith('.') ? text : text + '.';
	}

	// Пробуем обрезать по последней точке внутри лимита
	const upToLimit = text.slice(0, maxLength);
	const lastDot = upToLimit.lastIndexOf('.');

	if (lastDot > maxLength * 0.5) {
		return text.slice(0, lastDot + 1);
	}

	// Если точки нет — обрезаем по последнему пробелу
	const lastSpace = upToLimit.lastIndexOf(' ');
	if (lastSpace === -1) return upToLimit + '.';

	return upToLimit.slice(0, lastSpace) + '.';
}

function buildMetricPrompt(metric, context = []) {
	const targetTitle = getMetricTitleRu(metric);
	const statusRu = STATUS_RU[metric.status] || metric.status;
	const currentValue = `${metric.rawValue ?? metric.value} ${metric.unit || ''}`.trim();
	const trendSign = metric.trendPercent > 0 ? '+' : '';

	// История только целевой метрики — коротко
	const historyLine = formatHistory(metric.history, metric.unit);

	// Контекст: только проблемные метрики, одной строкой, без истории
	const problemMetrics = context
		.filter((m) => m.status !== 'normal' && m.metricId !== metric.metricId)
		.map((m) => `${getMetricTitleRu(m)} (${STATUS_RU[m.status] || m.status})`)
		.join(', ');

	const lines = [
		`Метрика: ${targetTitle}`,
		`Значение: ${currentValue}, изменение ${trendSign}${metric.trendPercent}%, статус: ${statusRu}`,
		historyLine ? `Тренд: ${historyLine}` : null,
		problemMetrics ? `Также проблемны: ${problemMetrics}` : null,
	].filter(Boolean).join('\n');

	return lines;
}

function buildSystemPrompt() {
	return `Ты аналитик метрик команды разработки. Пишешь одну короткую фразу для карточки дашборда.
Правила: только по существу, максимум 110 символов, на русском, заканчивай точкой, без вступлений.`;
}

app.get('/api/health', (req, res) => {
	res.json({
		status: 'ok',
	});
});

app.post('/api/ai/metric-insight', async (req, res) => {
	const metric = req.body?.metric;
	const context = Array.isArray(req.body?.context) ? req.body.context : [];

	if (!metric) {
		return res.status(400).json({
			message: 'Metric payload is required',
		});
	}

	try {
		const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: OLLAMA_MODEL,
				messages: [
					{ role: 'system', content: buildSystemPrompt() },
					{ role: 'user', content: buildMetricPrompt(metric, context) },
				],
				stream: false,
				options: {
					temperature: 0.2,
					top_p: 0.8,
					num_predict: 100,
				},
			}),
		});

		if (!response.ok) {
			throw new Error(`Ollama request failed: ${response.status}`);
		}

		const data = await response.json();
		// /api/chat возвращает message.content, /api/generate возвращает response
		const rawResponse = data.message?.content || data.response || '';
		const cleanedInsight = sanitizeInsight(rawResponse);
		const tooMuchEnglish = hasTooMuchEnglish(cleanedInsight);
		const insight = tooMuchEnglish ? '' : limitInsightLength(cleanedInsight, 160);

		// Детальный лог — помогает понять почему сработал fallback
		const metricLabel = `[${metric.metricId}] ${getMetricTitleRu(metric)}`;
		if (!insight) {
			console.warn(`[AI fallback] ${metricLabel}`);
			console.warn(`  raw:     ${rawResponse.slice(0, 120)}`);
			console.warn(`  cleaned: ${cleanedInsight.slice(0, 120)}`);
			console.warn(`  reason:  ${tooMuchEnglish ? 'too much english' : 'empty after sanitize'}`);
		} else {
			console.log(`[AI ok] ${metricLabel} → ${insight}`);
		}

		return res.json({
			insight: insight || buildFallbackInsight(metric, context),
			source: insight ? 'llm' : 'fallback',
		});
	} catch (error) {
		console.error('[AI insight error]', error);

		return res.json({
			insight: buildFallbackInsight(metric, context),
			source: 'fallback',
		});
	}
});

app.listen(PORT, () => {
	console.log(`app listening on port ${PORT}`);
});