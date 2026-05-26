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

		afterDatasetsDraw(chart) {
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

			ctx.setLineDash([]);
			ctx.fillStyle = '#10b981';
			ctx.font = '500 11px sans-serif';
			ctx.textAlign = 'right';
			ctx.textBaseline = 'bottom';
			ctx.fillText('Цель 80%', xScale.right - 12, y - 8);

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