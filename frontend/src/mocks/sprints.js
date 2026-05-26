export const sprints = [
  {
    id: 1,
    name: "Sprint 1",
    startDate: "2024-01-01",
    endDate: "2024-01-14",
    status: "completed",
    goal: "Initial project setup and authentication",
    completedPoints: 20,
    plannedPoints: 20,
    isCurrent: false,
    teamId: 1,
    metricId: 101
  },
  {
    id: 2,
    name: "Sprint 2",
    startDate: "2024-01-15",
    endDate: "2024-01-28",
    status: "completed",
    goal: "Dashboard implementation and core features",
    completedPoints: 25,
    plannedPoints: 25,
    isCurrent: false,
    teamId: 1,
    metricId: 102
  },
  {
    id: 3,
    name: "Sprint 3",
    startDate: "2024-02-01",
    endDate: "2024-02-14",
    status: "completed",
    goal: "Advanced reporting and analytics",
    completedPoints: 30,
    plannedPoints: 30,
    isCurrent: true,
    teamId: 1,
    metricId: 103
  },
  {
    id: 4,
    name: "Sprint 4",
    startDate: "2024-02-15",
    endDate: "2024-02-28",
    status: "completed",
    goal: "Performance optimization",
    completedPoints: 22,
    plannedPoints: 25,
    isCurrent: false,
    teamId: 1,
    metricId: 104
  },
  {
    id: 5,
    name: "Sprint 5",
    startDate: "2024-03-01",
    endDate: "2024-03-14",
    status: "active",
    goal: "Mobile responsiveness and bug fixes",
    completedPoints: 18,
    plannedPoints: 35,
    isCurrent: false,
    teamId: 1,
    metricId: 105
  },
  {
    id: 6,
    name: "Sprint 6",
    startDate: "2024-03-15",
    endDate: "2024-03-28",
    status: "planned",
    goal: "Feature enhancements and technical debt",
    completedPoints: 0,
    plannedPoints: 28,
    isCurrent: false,
    teamId: 1,
    metricId: 106
  }
];

export const currentSprint = sprints.find(sprint => sprint.isCurrent) || sprints[sprints.length - 1];

export const getSprintById = (id) => sprints.find(sprint => sprint.id === id);

export const getDashboardMetrics = (sprintId) => {
  const sprint = getSprintById(sprintId);
  if (!sprint) return [];
  
  const metricValues = getMetricValues(sprintId, sprint.teamId);
  if (!metricValues) return [];
  
  return Object.entries(metricValues.metrics).map(([key, value], index) => {
    const metricDef = metricDefinitions.find(m => m.title.includes(key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')));
    if (!metricDef) return null;
    
    const isLowerBetter = ['bugDensity', 'prReviewTime', 'cycleTime'].includes(key);
    const previousSprint = sprints.find(s => s.id === sprintId - 1);
    const previousValues = previousSprint ? getMetricValues(previousSprint.id, sprint.teamId) : null;
    const previousValue = previousValues ? previousValues.metrics[key] : null;
    const trend = getTrend(value, previousValue, isLowerBetter);
    
    return {
      id: metricDef.id,
      title: metricDef.title,
      value: value,
      unit: metricDef.unit,
      status: getMetricStatus(value, metricDef.id),
      trend: trend,
      description: metricDef.description,
      icon: metricDef.icon
    };
  }).filter(Boolean);
};