import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:0.5b';

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

function getContextLine(metric) {
	const title = getMetricTitleRu(metric);
	const previous =
		metric.previousValue !== null && metric.previousValue !== undefined
			? metric.previousValue
			: 'нет данных';

	return `${title}: сейчас ${formatValue(metric)}, было ${previous} ${metric.unit || ''}, изменение ${metric.trendPercent}%, статус ${metric.status}`;
}

app.use(express.json());

function buildFallbackInsight(metric, context = []) {
	const targetId = metric.metricId;

	const averageCompletion = getMetricFromContext(context, 1);
	const reviewReturns = getMetricFromContext(context, 2);
	const teamLoad = getMetricFromContext(context, 3);
	const escapedBugs = getMetricFromContext(context, 4);
	const sprintCompletion = getMetricFromContext(context, 5);

	if (
		targetId === 2 &&
		escapedBugs &&
		escapedBugs.status !== 'normal'
	) {
		return 'Рост багов может усиливать возвраты на ревью.';
	}

	if (
		targetId === 1 &&
		sprintCompletion &&
		sprintCompletion.status !== 'normal'
	) {
		return 'Просадка выполнения связана с риском по завершению спринта.';
	}

	if (
		targetId === 5 &&
		averageCompletion &&
		averageCompletion.status !== 'normal'
	) {
		return 'Завершение спринта страдает из-за низкого выполнения задач.';
	}

	if (
		targetId === 4 &&
		reviewReturns &&
		reviewReturns.status !== 'normal'
	) {
		return 'Баги могут быть связаны с частыми возвратами на ревью.';
	}

	if (
		targetId === 3 &&
		teamLoad &&
		teamLoad.trend === 'down'
	) {
		return 'Загрузка снизилась, но показатель всё ещё требует контроля.';
	}

	if (metric.aiRiskLevel === 'critical') {
		return 'Показатель в проблемной зоне, нужен разбор причины.';
	}

	if (metric.aiRiskLevel === 'warning') {
		return 'Есть риск отклонения, проверьте связь с другими метриками.';
	}

	return 'Динамика стабильная, сильных отклонений нет.';
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
		.replace(/\s+/g, ' ')
		.trim();
}

function hasTooMuchEnglish(text) {
	const latinMatches = text.match(/[a-zA-Z]/g) || [];

	return latinMatches.length >= 3;
}

function limitInsightLength(text, maxLength = 105) {
	if (!text) {
		return '';
	}

	const firstSentence = text.split(/[.!?]/)[0].trim();

	if (firstSentence.length <= maxLength) {
		return `${firstSentence}.`;
	}

	const shortened = firstSentence.slice(0, maxLength);
	const lastSpaceIndex = shortened.lastIndexOf(' ');

	if (lastSpaceIndex === -1) {
		return `${shortened}.`;
	}

	return `${shortened.slice(0, lastSpaceIndex)}.`;
}

function buildMetricPrompt(metric, context = []) {
	const targetTitle = getMetricTitleRu(metric);
	const contextText = context.map(getContextLine).join('\n');

	return `
Ты аналитик метрик команды разработки.

Нужно написать ОДНО короткое предложение на русском языке.
Максимум 90 символов.
Без английских слов.
Без markdown.
Без кавычек.
Без вступлений.
Без слов: "рекомендация", "текст", "пример", "создайте план".
Не пересказывай только одно число.
Сделай вывод по связи метрик.

Главная карточка: ${targetTitle}
Текущее значение: ${metric.rawValue ?? metric.value} ${metric.unit || ''}
Прошлое значение: ${metric.previousValue ?? 'нет данных'} ${metric.unit || ''}
Статус: ${metric.status}
AI-score: ${metric.aiScore}/100

Контекст всех метрик спринта:
${contextText}

Примеры смысла, но не копируй их:
Рост багов может ухудшать возвраты на ревью.
Низкое выполнение задач влияет на завершение спринта.
Загрузка стабильна, но соседние метрики требуют контроля.

Ответ только одной русской фразой:
`.trim();
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
		const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: OLLAMA_MODEL,
				prompt: buildMetricPrompt(metric, context),
				stream: false,
				options: {
					temperature: 0.25,
					top_p: 0.8,
					num_predict: 80,
				},
			}),
		});

		if (!response.ok) {
			throw new Error(`Ollama request failed: ${response.status}`);
		}

		const data = await response.json();
		const cleanedInsight = sanitizeInsight(data.response);
		const insight = hasTooMuchEnglish(cleanedInsight)
			? ''
			: limitInsightLength(cleanedInsight, 105);

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