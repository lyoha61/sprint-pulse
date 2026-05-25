export const formatDateRangeForSprint = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const months = [
    'янв', 'февр', 'марта', 'апр', 'мая', 'июня',
    'июля', 'авг', 'сент', 'окт', 'нояб', 'дек'
  ];
  
  const startDay = start.getDate();
  const startMonth = months[start.getMonth()];
  const endDay = end.getDate();
  const endMonth = months[end.getMonth()];
  
  if (start.getMonth() === end.getMonth()) {
    return `${startDay}–${endDay} ${startMonth}`;
  } else {
    return `${startDay} ${startMonth}. – ${endDay} ${endMonth}`;
  }
}