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
		id: `normLine-${value}-${color}-${label}`,

		beforeDraw: (chart) => {
			const ctx = chart.ctx;
			const yAxis = chart.scales.y;
			const xScale = chart.scales.x;
			const yPos = yAxis.getPixelForValue(value);

			if (yPos < chart.chartArea.top || yPos > chart.chartArea.bottom) {
				return;
			}

			ctx.save();

			ctx.beginPath();
			ctx.moveTo(xScale.left, yPos);
			ctx.lineTo(xScale.right, yPos);
			ctx.lineWidth = 1;
			ctx.strokeStyle = color;
			ctx.setLineDash([5, 5]);
			ctx.stroke();

			ctx.restore();
		},

		afterDatasetsDraw: (chart) => {
			const ctx = chart.ctx;
			const yAxis = chart.scales.y;
			const xScale = chart.scales.x;
			const yPos = yAxis.getPixelForValue(value);

			if (yPos < chart.chartArea.top || yPos > chart.chartArea.bottom) {
				return;
			}

			const dotSize = 8;
			const dotRadius = dotSize / 2;
			const paddingX = 8;
			const paddingY = 5;
			const gap = 6;

			ctx.save();

			ctx.font = '500 11px sans-serif';
			ctx.textBaseline = 'middle';

			const textWidth = ctx.measureText(label).width;
			const badgeWidth = dotSize + gap + textWidth + paddingX * 2;
			const badgeHeight = 22;

			let badgeX = xScale.right - badgeWidth - 12;
			const badgeY = yPos - badgeHeight / 2;

			if (badgeX < xScale.left + 8) {
				badgeX = xScale.left + 8;
			}

			ctx.fillStyle = '#ffffff';
			ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
			ctx.shadowBlur = 8;
			ctx.shadowOffsetY = 2;

			const radius = 8;
			const badgeRight = badgeX + badgeWidth;
			const badgeBottom = badgeY + badgeHeight;

			ctx.beginPath();
			ctx.moveTo(badgeX + radius, badgeY);
			ctx.lineTo(badgeRight - radius, badgeY);
			ctx.quadraticCurveTo(badgeRight, badgeY, badgeRight, badgeY + radius);
			ctx.lineTo(badgeRight, badgeBottom - radius);
			ctx.quadraticCurveTo(badgeRight, badgeBottom, badgeRight - radius, badgeBottom);
			ctx.lineTo(badgeX + radius, badgeBottom);
			ctx.quadraticCurveTo(badgeX, badgeBottom, badgeX, badgeBottom - radius);
			ctx.lineTo(badgeX, badgeY + radius);
			ctx.quadraticCurveTo(badgeX, badgeY, badgeX + radius, badgeY);
			ctx.closePath();
			ctx.fill();

			ctx.shadowColor = 'transparent';
			ctx.shadowBlur = 0;
			ctx.shadowOffsetY = 0;

			ctx.beginPath();
			ctx.arc(
				badgeX + paddingX + dotRadius,
				yPos,
				dotRadius,
				0,
				Math.PI * 2
			);
			ctx.fillStyle = color;
			ctx.fill();

			ctx.fillStyle = color;
			ctx.textAlign = 'left';
			ctx.fillText(
				label,
				badgeX + paddingX + dotSize + gap,
				yPos
			);

			ctx.restore();
		},
	};
};

/**
 * Декоративный объект с дефолтными стилями tooltip для всех графиков
 * Используется как базовый стиль tooltip в компонентах
 */
export const chartTooltipDefaults = {
  backgroundColor: '#ffffff',
  caretSize: 0,
  caretPadding: 10,

  position: 'followVerticalX',

  titleColor: '#64748b',
  titleFont: {
    family: 'sans-serif',
    size: 14,
    weight: 'normal'
  },
  titleMarginBottom: 8,

  bodyColor: '#1e293b',
  bodyFont: {
    family: 'sans-serif',
    size: 15,
    weight: 'bold'
  },

  padding: 12,
  cornerRadius: 12,

  boxWidth: 8,
  boxHeight: 8,
  boxPadding: 6,
  usePointStyle: true,

  borderColor: 'rgba(0, 0, 0, 0.04)',
  borderWidth: 1,

  shadowColor: 'rgba(0, 0, 0, 0.08)',
  shadowBlur: 10,
  shadowOffsetX: 0,
  shadowOffsetY: 4
};
