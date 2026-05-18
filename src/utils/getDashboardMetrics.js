import {
  metricDefinitions,
  getMetricValues,
  getMetricStatus,
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

export function getDashboardMetrics(sprintId, teamId) {
  const sprintMetricValues = getMetricValues(sprintId, teamId);

  if (!sprintMetricValues) {
    return [];
  }

  return metricDefinitions.map((metric) => {
    const metricKey = metricKeyById[metric.id];
    const value = sprintMetricValues.metrics[metricKey];
    const status = getMetricStatus(value, metric.id);

    return {
      id: metric.id,
      title: metric.title,
      description: metric.description,
      unit: metric.unit,
      icon: metric.icon,
      value,
      status,
    };
  });
}