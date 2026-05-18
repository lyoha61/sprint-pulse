export function getBadgeByMetricStatus(status) {
  const badgeMap = {
    normal: {
      type: 'success',
      text: 'В норме',
    },
    warning: {
      type: 'warning',
      text: 'Риск',
    },
    critical: {
      type: 'error',
      text: 'Проблема',
    },
  };

  return badgeMap[status] || badgeMap.normal;
}