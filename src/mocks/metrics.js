export const metricDefinitions = [
  {
    id: 1,
    title: "Velocity команды",
    unit: "SP",
    description: "Выполнено 47 из 52 story points. Показывает реальную производительность команды за спринт.",
    icon: "TrendingUp",
    normalRange: { min: 40, max: Infinity },
    warningRange: { min: 30, max: 40 }
  },
  {
    id: 2,
    title: "Задачи в срок",
    unit: "%",
    description: "Доля задач, закрытых до окончания спринта. Норма — выше 80%.",
    icon: "CheckSquare",
    normalRange: { min: 80, max: Infinity },
    warningRange: { min: 70, max: 80 }
  },
  {
    id: 3,
    title: "Плотность багов",
    unit: "баг/SP",
    description: "Число багов на story point. Позволяет оценить качество кода независимо от объёма работы.",
    icon: "Bug",
    normalRange: { min: 0, max: 0.15 },
    warningRange: { min: 0.15, max: 0.25 }
  },
  {
    id: 4,
    title: "Время ревью PR",
    unit: "ч",
    description: "Среднее время от открытия PR до мержа. Цель — до 8 часов. Долгое ревью тормозит поставку.",
    icon: "GitMerge",
    normalRange: { min: 0, max: 4 },
    warningRange: { min: 4, max: 8 }
  },
  {
    id: 5,
    title: "Cycle time",
    unit: "дн.",
    description: "Среднее время от начала разработки задачи до её релиза. Чем меньше — тем быстрее поставка.",
    icon: "Timer",
    normalRange: { min: 0, max: 2 },
    warningRange: { min: 2, max: 4 }
  },
  {
    id: 6,
    title: "Деплои за спринт",
    unit: "шт.",
    description: "Количество релизов в продакшн. Частые деплои снижают риски и ускоряют обратную связь.",
    icon: "Rocket",
    normalRange: { min: 4, max: Infinity },
    warningRange: { min: 2, max: 4 }
  },
  {
    id: 7,
    title: "Цель спринта",
    unit: "%",
    description: "Процент достижения спринтовой цели. Отражает, попадает ли команда в бизнес-ценность итерации.",
    icon: "Target",
    normalRange: { min: 85, max: Infinity },
    warningRange: { min: 70, max: 85 }
  }
];

export const metricValues = [
  {
    id: 101,
    sprintId: 1,
    teamId: 1,
    metrics: {
      velocity: 20,
      tasksOnTime: 75,
      bugDensity: 0.25,
      prReviewTime: 8.5,
      cycleTime: 4.2,
      deployments: 2,
      sprintGoalAchievement: 100
    }
  },
  {
    id: 102,
    sprintId: 2,
    teamId: 1,
    metrics: {
      velocity: 25,
      tasksOnTime: 80,
      bugDensity: 0.20,
      prReviewTime: 7.8,
      cycleTime: 3.8,
      deployments: 3,
      sprintGoalAchievement: 100
    }
  },
  {
    id: 103,
    sprintId: 3,
    teamId: 1,
    metrics: {
      velocity: 30,
      tasksOnTime: 85,
      bugDensity: 0.18,
      prReviewTime: 7.2,
      cycleTime: 3.5,
      deployments: 3,
      sprintGoalAchievement: 100
    }
  },
  {
    id: 104,
    sprintId: 4,
    teamId: 1,
    metrics: {
      velocity: 22,
      tasksOnTime: 82,
      bugDensity: 0.19,
      prReviewTime: 6.8,
      cycleTime: 3.3,
      deployments: 2,
      sprintGoalAchievement: 88
    }
  },
  {
    id: 105,
    sprintId: 5,
    teamId: 1,
    metrics: {
      velocity: 18,
      tasksOnTime: 83,
      bugDensity: 0.17,
      prReviewTime: 6.2,
      cycleTime: 3.1,
      deployments: 4,
      sprintGoalAchievement: 51
    }
  },
  {
    id: 106,
    sprintId: 6,
    teamId: 1,
    metrics: {
      velocity: 0,
      tasksOnTime: 0,
      bugDensity: 0,
      prReviewTime: 0,
      cycleTime: 0,
      deployments: 0,
      sprintGoalAchievement: 0
    }
  }
];

export const getMetricValues = (sprintId, teamId) => {
  return metricValues.find(mv => mv.sprintId === sprintId && mv.teamId === teamId);
};

export function getMetricStatus(value, metricId) {
  const metric = metricDefinitions.find(m => m.id === metricId);
  if (!metric) return "normal";
  
  const isLowerBetter = [3, 4, 5].includes(metricId); 
  
  if (isLowerBetter) {
    if (value <= metric.normalRange.max) return "normal";
    if (value <= metric.warningRange.max) return "warning";
    return "critical";
  } else {
    if (value >= metric.normalRange.min) return "normal";
    if (value >= metric.warningRange.min) return "warning";
    return "critical";
  }
}

export function getTrend(current, previous, isLowerBetter = false) {
  if (previous === undefined || previous === null) return "stable";
  if (current > previous) return isLowerBetter ? "down" : "up";
  if (current < previous) return isLowerBetter ? "up" : "down";
  return "stable";
}
