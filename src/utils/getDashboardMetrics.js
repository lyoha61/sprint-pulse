import {
  metricDefinitions,
  getMetricValues,
  getMetricStatus,
  getTrend,
} from '../mocks/metrics';

const metricKeyById = {
  1: 'velocity',
  2: 'tasksOnTime',
  3: 'bugDensity',
  4: 'prReviewTime',
  5: 'cycleTime',
  6: 'deployments',
  7: 'sprintGoalAchievement',
};

const lowerIsBetterMetricKeys = ['bugDensity', 'prReviewTime', 'cycleTime'];

function getTrendPercent(currentValue, previousValue) {
  if (!previousValue) {
    return 0;
  }

  return Math.round(((currentValue - previousValue) / previousValue) * 100);
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

    const isLowerBetter = lowerIsBetterMetricKeys.includes(metricKey);

    const status = getMetricStatus(value, metric.id);
    const trend = getTrend(value, previousValue, isLowerBetter);
    const trendPercent = getTrendPercent(value, previousValue);

    return {
      id: metric.id,
      title: metric.title,
      description: metric.description,
      unit: metric.unit,
      icon: metric.icon,
      value,
      status,
      trend,
      trendPercent,
      aiInsight: 'Будущая аналитика от ИИ',
    };
  });
}