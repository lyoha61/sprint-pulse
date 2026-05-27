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
		previousValue: metric.previousValue ?? null,
		previousSprintId: metric.previousSprintId ?? null,
		previousSprintLabel: metric.previousSprintLabel ?? null,
		aiScore: metric.aiScore,
		aiRiskLevel: metric.aiRiskLevel,
		// История значений за последние спринты для анализа тренда
		history: metric.history ?? [],
	};
}

export function getFallbackMetricAiInsight(metric) {
	const value = `${metric.value} ${metric.unit || ''}`.trim();

	// Для нормальных метрик инсайт не показывается (shouldShowAiInsight = false)
	// Этот fallback срабатывает только пока LLM ещё не ответила
	if (metric.aiRiskLevel === 'critical') {
		return `Показатель ${value} — критическое отклонение, нужен разбор.`;
	}

	if (metric.aiRiskLevel === 'warning') {
		return `Показатель ${value} — есть отклонение, стоит проверить динамику.`;
	}

	return `Показатель ${value} — динамика стабильная.`;
}