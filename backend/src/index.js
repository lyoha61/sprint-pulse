import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:0.5b';

app.use(express.json());

function buildFallbackInsight(metric) {
	if (metric.aiRiskLevel === 'critical') {
		return `${metric.title}: показатель в проблемной зоне. Нужен короткий разбор причины и синхронизация команды.`;
	}

	if (metric.aiRiskLevel === 'warning') {
		return `${metric.title}: показатель требует внимания. Проверьте динамику и возможные причины отклонения.`;
	}

	return `${metric.title}: показатель в норме. Дополнительных действий не требуется.`;
}

function sanitizeInsight(text) {
	return String(text || '')
		.replace(/["'`]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function limitWords(text, maxWords = 26) {
	const words = text.split(' ').filter(Boolean);

	if (words.length <= maxWords) {
		return text;
	}

	return `${words.slice(0, maxWords).join(' ')}.`;
}

function buildMetricPrompt(metric) {
	return `
Ты аналитик agile-метрик команды разработки.

Сгенерируй короткую рекомендацию на русском языке.
Формат: 1-2 предложения, максимум 20 слов.
Без markdown, без списков, без кавычек.
Не пиши "как ИИ".
Не повторяй все числа подряд.
Пиши конкретно и понятно для команды.

Данные метрики:
Название: ${metric.title}
Текущее значение: ${metric.rawValue ?? metric.value} ${metric.unit || ''}
Статус: ${metric.status}
AI-score: ${metric.aiScore}/100
Риск: ${metric.aiRiskLevel}
Тренд: ${metric.trend}
Изменение к прошлому спринту: ${metric.trendPercent}%

Ответ:
`.trim();
}

app.get('/api/health', (req, res) => {
	res.json({
		status: 'ok',
	});
});

app.post('/api/ai/metric-insight', async (req, res) => {
	const metric = req.body?.metric;

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
				prompt: buildMetricPrompt(metric),
				stream: false,
				options: {
					temperature: 0.2,
					num_predict: 60,
				},
			}),
		});

		if (!response.ok) {
			throw new Error(`Ollama request failed: ${response.status}`);
		}

		const data = await response.json();
		const insight = limitWords(sanitizeInsight(data.response));

		return res.json({
			insight: insight || buildFallbackInsight(metric),
			source: insight ? 'llm' : 'fallback',
		});
	} catch (error) {
		console.error('[AI insight error]', error);

		return res.json({
			insight: buildFallbackInsight(metric),
			source: 'fallback',
		});
	}
});

app.listen(PORT, () => {
	console.log(`app listening on port ${PORT}`);
});