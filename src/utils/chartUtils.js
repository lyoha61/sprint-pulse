
/**
 * Создает вертикальный градиент для заливки графика
 * @param {Object} chartArea - Область графика с координатами
 * @param {Object} chart - Объект графика Chart.js
 * @param {string} startColor - Начальный цвет градиента (верх)
 * @param {string} endColor - Конечный цвет градиента (низ)
 * @returns {CanvasGradient} Объект градиента
 */
export const createVerticalGradient = (chartArea, chart, startColor, endColor) => {
  const { ctx, chartArea: { top, bottom } } = chart;
  const gradient = ctx.createLinearGradient(0, top, 0, bottom);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  return gradient;
};

/**
 * Создает горизонтальную линию нормы для графика
 * @param {number} value - Значение в процентах (например, 80)
 * @param {string} color - Цвет линии
 * @param {string} label - Подпись к линии
 * @returns {Object} Плагин Chart.js
 */
export const createNormLinePlugin = (value, color = '#10b981', label = `Норма ${value}%`) => {
  return {
    id: 'normLine',
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const yAxis = chart.scales.y;
      const xScale = chart.scales.x;
      const yPos = yAxis.getPixelForValue(value);
      
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(xScale.left, yPos);
      ctx.lineTo(xScale.right, yPos);
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.restore();
      
      ctx.fillStyle = color;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, (xScale.left + xScale.right) / 2, yPos - 10);
    }
  };
};