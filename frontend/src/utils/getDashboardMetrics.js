import {
	metricDefinitions,
	getMetricValues,
	getMetricStatus,
	getTrend,
} from '../mocks/metrics';

import { sprints } from '../mocks/sprints';

import {
	getMetricAiRiskLevel,
	getMetricAiScore,
} from './metricAiScore';

import {
	buildMetricAiPayload,
	getFallbackMetricAiInsight,
} from './metricAiAnalytics';

const metricKeyById = {
	1: 'cycle-time',
	2: 'review-ping-pong',
	3: 'wip-load',
	4: 'escaped-defects',
	5: 'sprint-burndown',
};

const lowerIsBetterMetricKeys = [
	'review-ping-pong',
	'wip-load',
	'escaped-defects',
];

function getTrendPercent(currentValue, previousValue) {
	if (
		previousValue === undefined ||
		previousValue === null ||
		previousValue === 0
	) {
		return 0;
	}

	return Math.round(((currentValue - previousValue) / previousValue) * 100);
}

// Собирает историю метрики за последние N спринтов (включая текущий).
// Возвращает массив от старого к новому с датами спринтов.
export function getMetricHistory(metricId, currentSprintId, teamId = 1, depth = 3) {
	const metricKey = metricKeyById[metricId];
	if (!metricKey) return [];

	const history = [];

	for (let i = depth - 1; i >= 0; i--) {
		const sprintId = currentSprintId - i;
		if (sprintId < 1) continue;

		const values = getMetricValues(sprintId, teamId);
		if (!values) continue;

		const value = values.metrics[metricKey];
		if (value === undefined || value === null) continue;

		const sprint = sprints.find((s) => s.id === sprintId);
		const dateRange = sprint
			? `${sprint.startDate} — ${sprint.endDate}`
			: null;

		history.push({
			sprintId,
			sprintLabel: `Спринт ${sprintId}`,
			dateRange,
			value,
			status: getMetricStatus(value, metricId),
		});
	}

	return history;
}

export function getDashboardMetrics(sprintId, teamId = 1) {
	const currentMetricValues = getMetricValues(sprintId, teamId);
	const previousMetricValues = getMetricValues(sprintId - 1, teamId);

	if (!currentMetricValues) {
		return [];
	}

	return metricDefinitions.map((metric) => {
		const metricKey = metricKeyById[metric.id];
		const value = currentMetricValues.metrics[metricKey];
		const previousValue = previousMetricValues?.metrics?.[metricKey];

		const previousSprintId = sprintId > 1 ? sprintId - 1 : null;

		const isLowerBetter = lowerIsBetterMetricKeys.includes(metricKey);
		const status = getMetricStatus(value, metric.id);
		const trend = getTrend(value, previousValue, isLowerBetter);
		const trendPercent = getTrendPercent(value, previousValue);

		const aiScore = getMetricAiScore(metric.id, value);
		const aiRiskLevel = getMetricAiRiskLevel(aiScore);

		// История за 3 спринта для AI-контекста
		const history = getMetricHistory(metric.id, sprintId, teamId, 3);

		const preparedMetric = {
			id: metric.id,
			title: metric.title,
			description: metric.description,
			unit: metric.unit,
			icon: metric.icon,
			value,
			status,
			trend,
			trendPercent,
			aiScore,
			aiRiskLevel,
			history,
		};

		return {
			...preparedMetric,
			aiPayload: buildMetricAiPayload(preparedMetric),
			aiInsight: getFallbackMetricAiInsight(preparedMetric),
			previousValue: previousValue ?? null,
			previousSprintId,
			previousSprintLabel: previousSprintId ? `Спринт ${previousSprintId}` : null,
		};
	});
}
