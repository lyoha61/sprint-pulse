const AI_RISK_LEVELS = {
	good: 'good',
	warning: 'warning',
	critical: 'critical',
};

function clampScore(score) {
	return Math.max(1, Math.min(100, Math.round(score)));
}

function normalizeHigherIsBetter(value, normalValue, criticalValue) {
	if (value >= normalValue) {
		return 100;
	}

	if (value <= criticalValue) {
		return 20;
	}

	const range = normalValue - criticalValue;
	const progress = (value - criticalValue) / range;

	return clampScore(20 + progress * 60);
}

function normalizeLowerIsBetter(value, normalValue, criticalValue) {
	if (value <= normalValue) {
		return 100;
	}

	if (value >= criticalValue) {
		return 20;
	}

	const range = criticalValue - normalValue;
	const progress = (criticalValue - value) / range;

	return clampScore(20 + progress * 60);
}

export function getMetricAiScore(metricId, value) {
	const aiScoreByMetric = {
		// Среднее выполнение задач
		1: () => normalizeHigherIsBetter(value, 80, 50),

		// Review Ping-Pong
		2: () => normalizeLowerIsBetter(value, 1.5, 3),

		// Загруженность разработчиков
		// 4.2% должно быть 100/100, потому что риск только выше 90%
		3: () => normalizeLowerIsBetter(value, 90, 100),

		// Пропущенные баги
		// 4 бага — уже внимание, но не проблема
		4: () => normalizeLowerIsBetter(value, 3, 5),

		// Sprint Burndown
		// 88% = 100/100, 65% ≈ 50/100
		5: () => normalizeHigherIsBetter(value, 80, 50),
	};

	const scoreGetter = aiScoreByMetric[metricId];

	if (!scoreGetter) {
		return 50;
	}

	return clampScore(scoreGetter());
}

export function getMetricAiRiskLevel(aiScore) {
	if (aiScore >= 80) {
		return AI_RISK_LEVELS.good;
	}

	if (aiScore >= 50) {
		return AI_RISK_LEVELS.warning;
	}

	return AI_RISK_LEVELS.critical;
}