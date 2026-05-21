export const metricDefinitions = [
  {
    id: 1,
    title: 'Среднее выполнение задач',
    unit: '%',
    description: 'Средний процент выполненных задач на разработчика за спринт. Норма — выше 80%.',
    normal: 'меньше 24 часов',
    warning: 'больше 48 часов'
  },
  {
    id: 2,
    title: 'Review Ping-Pong',
    unit: 'раз/PR',
    description: 'Среднее число итераций до принятия PR. Норма — не более 1.5. Высокий показатель говорит о проблемах с качеством кода.',
    normal: 'меньше 2',
    warning: 'больше 3'
  },
  {
    id: 3,
    title: 'Загруженность разработчиков',
    unit: '%',
    description: 'Средняя загрузка команды от максимальной ёмкости спринта. Свыше 90% — риск выгорания.',
    normal: '1-3 задачи',
    warning: 'больше 4 задач'
  },
  {
    id: 4,
    title: 'Пропущенные баги',
    unit: 'шт.',
    description: 'Баги, найденные в продакшне после релиза. Норма — не более 3. Отражает качество тестирования.',
    normal: 'меньше 2',
    warning: 'больше 5'
  },
  {
    id: 5,
    title: 'Sprint Burndown',
    unit: '%',
    description: 'Доля story points, закрытых в рамках спринта. Цель — выше 80%. Показывает точность планирования.',
    normal: '90-100%',
    warning: 'меньше 70%'
  }
];

export const metricValues = [
  {
    id: 101,
    sprintId: 1,
    teamId: 1,
    metrics: {
      'cycle-time': 32,
      'review-ping-pong': 2.5,
      'wip-load': 3.2,
      'escaped-defects': 3,
      'sprint-burndown': 75
    }
  },
  {
    id: 102,
    sprintId: 2,
    teamId: 1,
    metrics: {
      'cycle-time': 28,
      'review-ping-pong': 2.2,
      'wip-load': 2.8,
      'escaped-defects': 2,
      'sprint-burndown': 82
    }
  },
  {
    id: 103,
    sprintId: 3,
    teamId: 1,
    metrics: {
      'cycle-time': 24,
      'review-ping-pong': 1.8,
      'wip-load': 2.5,
      'escaped-defects': 1,
      'sprint-burndown': 88
    }
  },
  {
    id: 104,
    sprintId: 4,
    teamId: 1,
    metrics: {
      'cycle-time': 36,
      'review-ping-pong': 3.1,
      'wip-load': 4.2,
      'escaped-defects': 4,
      'sprint-burndown': 65
    }
  },
  {
    id: 105,
    sprintId: 5,
    teamId: 1,
    metrics: {
      'cycle-time': 42,
      'review-ping-pong': 3.5,
      'wip-load': 5.1,
      'escaped-defects': 6,
      'sprint-burndown': 45
    }
  },
  {
    id: 106,
    sprintId: 6,
    teamId: 1,
    metrics: {
      'cycle-time': 0,
      'review-ping-pong': 0,
      'wip-load': 0,
      'escaped-defects': 0,
      'sprint-burndown': 0
    }
  }
];

export const getMetricValues = (sprintId, teamId) => {
  return metricValues.find(mv => mv.sprintId === sprintId && mv.teamId === teamId);
};

export function getMetricStatus(value, metricId) {
  const metric = metricDefinitions.find(m => m.id === metricId);
  if (!metric) return "normal";
  
  const isLowerBetter = ['cycle-time', 'review-ping-pong', 'wip-load', 'escaped-defects'].includes(metricId);
  
  const parseValue = (str) => {
    if (str.includes('-')) {
      return parseFloat(str.split('-')[1]); 
    }
    if (str.includes('меньше')) {
      return parseFloat(str.replace('меньше ', ''));
    }
    if (str.includes('больше')) {
      return parseFloat(str.replace('больше ', ''));
    }
    return parseFloat(str);
  };
  
  const normalValue = parseValue(metric.normal);
  const warningValue = parseValue(metric.warning);
  
  if (isLowerBetter) {
    if (value <= normalValue) return "normal";
    if (value <= warningValue) return "warning";
    return "critical";
  } else {
    if (value >= normalValue) return "normal";
    if (value >= warningValue) return "warning";
    return "critical";
  }
}


export function getMetricsSummary(sprintId, teamId) {
  const metricValuesData = getMetricValues(sprintId, teamId);

  if (!metricValuesData) {
    return {
      problems: 0,
      attentions: 0,
      risks: 0,
      total: 0,
    };
  }

  const metricIdByKey = {
    'cycle-time': 1,
    'review-ping-pong': 2,
    'wip-load': 3,
    'escaped-defects': 4,
    'sprint-burndown': 5,
  };

  let problems = 0;
  let attentions = 0;
  let total = 0;

  Object.entries(metricValuesData.metrics).forEach(([key, value]) => {
    const metricId = metricIdByKey[key];

    if (!metricId) {
      return;
    }

    total += 1;

    const status = getMetricStatus(value, metricId);

    if (status === 'critical') {
      problems += 1;
      return;
    }

    if (status === 'warning') {
      attentions += 1;
    }
  });

  return {
    problems,
    attentions,
    risks: attentions,
    total,
  };
}

export function getTrend(current, previous, metricId) {
  if (previous === undefined || previous === null) return "stable";
  
  const isLowerBetter = ['cycle-time', 'review-ping-pong', 'wip-load', 'escaped-defects'].includes(metricId);
  
  if (current > previous) return isLowerBetter ? "down" : "up";
  if (current < previous) return isLowerBetter ? "up" : "down";
  return "stable";
}