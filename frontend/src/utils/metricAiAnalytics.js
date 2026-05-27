const METRIC_RECOMMENDATIONS = {
	1: {
		warning: 'Проверьте задачи, которые не доходят до завершения в рамках спринта.',
		critical: 'Проведите разбор планирования и найдите задачи, которые системно зависают.',
	},
	2: {
		warning: 'Проверьте причины повторных итераций ревью и критерии готовности PR.',
		critical: 'Синхронизируйте требования к качеству кода и усилите проверку перед ревью.',
	},
	3: {
		warning: 'Проверьте распределение задач и признаки перегрузки участников команды.',
		critical: 'Срочно пересмотрите загрузку команды и уменьшите параллельную работу.',
	},
	4: {
		warning: 'Проверьте качество тестирования и причины попадания дефектов в продакшн.',
		critical: 'Проведите разбор дефектов и усилите критерии релиза.',
	},
	5: {
		warning: 'Проверьте динамику и возможные причины отклонения.',
		critical: 'Проведите разбор планирования и причин невыполнения целей спринта.',
	},
};

function formatMetricValue(value, unit) {
	if (!unit) {
		return `${value}`;
	}

	return `${value} ${unit}`;
}

export function buildMetricAiPayload(metric) {
	return {
		metricId: metric.id,
		title: metric.title,
		rawValue: metric.value,
		unit: metric.unit,
		status: metric.status,
		trend: metric.trend,
		trendPercent: metric.trendPercent,
		aiScore: metric.aiScore,
		aiRiskLevel: metric.aiRiskLevel,
		aiScale: {
			min: 1,
			max: 100,
			description: 'Чем выше значение, тем лучше состояние метрики.',
		},
	};
}

export function getFallbackMetricAiInsight(metric) {
	const valueText = formatMetricValue(metric.value, metric.unit);

	if (metric.aiRiskLevel === 'good') {
		return `${metric.title}: показатель в норме. AI-score ${metric.aiScore}/100.`;
	}

	const recommendation =
		METRIC_RECOMMENDATIONS[metric.id]?.[metric.aiRiskLevel] ||
		'Проверьте динамику и возможные причины отклонения.';

	if (metric.aiRiskLevel === 'warning') {
		return `${metric.title}: показатель требует внимания. Текущее значение ${valueText}, AI-score ${metric.aiScore}/100. ${recommendation}`;
	}

	return `${metric.title}: показатель находится в проблемной зоне. Текущее значение ${valueText}, AI-score ${metric.aiScore}/100. ${recommendation}`;
}