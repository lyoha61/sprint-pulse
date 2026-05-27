<script setup>
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Tooltip,
	Legend,
} from 'chart.js';

import { Bar } from 'vue-chartjs';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Tooltip,
	Legend
);

const chartData = {
	labels: ['Сп. 1', 'Сп. 2', 'Сп. 3', 'Сп. 4'],
	datasets: [
		{
			label: 'Выполнено',
			data: [85, 58, 81, 73],
			backgroundColor: '#1da7dd',
			borderColor: '#1da7dd',
			borderWidth: 0,
			borderRadius: 4,
			barPercentage: 0.38,
			categoryPercentage: 0.8,
			hoverBackgroundColor: '#1da7dd',
		},
	],
};


const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,

	interaction: {
		mode: 'index',
		intersect: false,
	},

	hover: {
		mode: 'index',
		intersect: false,
	},

	animation: {
		duration: 700,
		easing: 'easeOutQuart',
	},

	transitions: {
		active: {
			animation: {
				duration: 0,
			},
		},
	},

	plugins: {
		legend: {
			display: false,
		},

		tooltip: {
      enabled: true,
      backgroundColor: '#ffffff',
      titleColor: '#64748b',
      bodyColor: '#0f172a',
      borderColor: '#dbe3ef',
      borderWidth: 1,
      padding: 12,
      caretSize: 6,
      caretPadding: 8,
      displayColors: true,
      usePointStyle: true,
      boxWidth: 8,
      boxHeight: 8,
      boxPadding: 6,

      titleFont: {
        size: 13,
        weight: '500',
      },

      bodyFont: {
        size: 13,
        weight: '600',
      },

      callbacks: {
        title(items) {
          return items[0]?.label || '';
        },

        label(context) {
          return `Выполнено: ${context.raw}%`;
        },

        labelPointStyle() {
          return {
            pointStyle: 'circle',
            rotation: 0,
          };
        },
      },
    },
	},

	scales: {
		x: {
			grid: {
				display: true,
				color: '#f1f5f9',
				drawTicks: false,
			},

			border: {
				display: false,
			},

			ticks: {
				color: '#8ea0bd',
				font: {
					size: 11,
				},
			},
		},

		y: {
			min: 0,
			max: 100,

			ticks: {
				stepSize: 25,

				callback(value) {
					return `${value}%`;
				},

				color: '#8ea0bd',
				font: {
					size: 11,
				},
			},

			border: {
				display: false,
			},

			grid: {
				color: '#f1f5f9',
				drawTicks: false,
			},
		},
	},
};

const chartPlugins = [
	{
		id: 'hoverColumnBackground',

		beforeDatasetsDraw(chart) {
			const activeElements = chart.getActiveElements();

			if (!activeElements || activeElements.length === 0) {
				return;
			}

			const activeElement = activeElements[0];
			const { ctx, chartArea, scales } = chart;
			const xScale = scales.x;

			const currentX = xScale.getPixelForTick(activeElement.index);
			const previousX =
				activeElement.index > 0
					? xScale.getPixelForTick(activeElement.index - 1)
					: null;
			const nextX =
				activeElement.index < chart.data.labels.length - 1
					? xScale.getPixelForTick(activeElement.index + 1)
					: null;

			const stepWidth = nextX
				? nextX - currentX
				: previousX
					? currentX - previousX
					: 80;

			const highlightWidth = stepWidth * 0.55;
			const x = currentX - highlightWidth / 2;

			ctx.save();
			ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
			ctx.fillRect(
				x,
				chartArea.top,
				highlightWidth,
				chartArea.bottom - chartArea.top
			);
			ctx.restore();
		},
	},

	{
		id: 'goalLine',

		beforeDatasetsDraw(chart) {
			const { ctx, chartArea, scales } = chart;
			const yScale = scales.y;
			const xScale = scales.x;
			const y = yScale.getPixelForValue(80);

			if (y < chartArea.top || y > chartArea.bottom) {
				return;
			}

			ctx.save();

			ctx.beginPath();
			ctx.moveTo(xScale.left, y);
			ctx.lineTo(xScale.right, y);
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#10b981';
			ctx.setLineDash([5, 5]);
			ctx.stroke();

			ctx.restore();
		},

		afterDatasetsDraw(chart) {
			const { ctx, chartArea, scales } = chart;
			const yScale = scales.y;
			const xScale = scales.x;
			const y = yScale.getPixelForValue(80);

			if (y < chartArea.top || y > chartArea.bottom) {
				return;
			}

			const label = 'Цель 80%';
			const color = '#10b981';

			const dotSize = 8;
			const dotRadius = dotSize / 2;
			const paddingX = 8;
			const gap = 6;

			ctx.save();

			ctx.font = '500 11px sans-serif';
			ctx.textBaseline = 'middle';

			const textWidth = ctx.measureText(label).width;
			const badgeWidth = dotSize + gap + textWidth + paddingX * 2;
			const badgeHeight = 22;

			const badgeX = xScale.right - badgeWidth - 12;
			const badgeY = y - badgeHeight / 2;

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
				y,
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
				y
			);

			ctx.restore();
		},
	},


];
</script>

<template>
	<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
		<div class="mb-4">
			<h3 class="text-lg font-semibold text-slate-900">
				Завершение спринта
			</h3>

			<p class="text-xs text-slate-400">
				% закрытых story points от запланированных
			</p>
		</div>

		<div class="h-[210px] min-w-0">
			<Bar
				:data="chartData"
				:options="chartOptions"
				:plugins="chartPlugins"
			/>
		</div>
	</div>
</template>