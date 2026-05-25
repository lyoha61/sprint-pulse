<script setup>
import { ref } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { 
  createVerticalGradient, 
  createNormLinePlugin, 
  chartTooltipDefaults 
} from '@src/utils/chartUtils'
import { verticalLinePlugin } from '@src/utils/chartPlugins/verticalLine';
import { hoverPointPlugin } from '@src/utils/chartPlugins/hoverPoint';
import { tooltipCorner } from '@src/utils/chartPlugins/tooltipCorner'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

// #NOTE потом заменить данные на мок
const chartData = {
  labels: ['Спринт 1', 'Спринт 2', 'Спринт 3', 'Спринт 4'],
  datasets: [
    {
      label: 'Выполнение',
      data: [75, 100, 65, 70],
      fill: true,
      backgroundColor: function(context) {
        const chart = context.chart;
        const { chartArea } = chart;
        
        if (!chartArea) {
          return 'rgba(99, 102, 241, 0.2)';
        }
        
         return createVerticalGradient(
          chartArea, 
          chart, 
          'rgba(99, 102, 241, 0.2)', 
          'rgba(99, 102, 241, 0)'    
        );
      },
      borderColor: '#6366f1',
      borderWidth: 2,

      pointBackgroundColor: 'rgba(99, 102, 241, 0.6)',
      pointBorderColor: '#6366f1',
      pointRadius: 5,
      pointBorderWidth: 2,
      pointHoverBorderWidth: 0,

      tension: 0.4
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  interaction: {
    mode: 'index',
    intersect: false
  },

  plugins: {
    legend: {
      display: false
    },
    hoverPoint: {
      outerColor: '#6366f1',
      innerColor: '#6366f1'
    },
    tooltip: {
      ...chartTooltipDefaults
    }
  },
  scales: {
    x: {
      grid: {
        display: true,
        color: '#f1f5f9',
      },
      border: {
        display: false,
        dash: [3, 3]
      },
      ticks: {
        color: '#94a3b8'
      }
    },
    y: {
      min: 0,
      grace:"5%",
      ticks: {
        stepSize: 25,
        callback: function(value) {
          return value + '%'
        },
        color: '#94a3b8',

        padding: 10
      },
      border: {
        display: false,
        dash: [3, 3]
      },
      grid: {
        color: '#f1f5f9',
        drawTicks: false
      }
    }
  }
}

const chartPlugins = [
  createNormLinePlugin(80, '#10b981', 'Норма 80%'),
  verticalLinePlugin,
  hoverPointPlugin,
  tooltipCorner,
]
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
    <div class="mb-4">
      <h3 class="text-slate-800">Среднее выполнение задач</h3>
      <p class="text-xs text-slate-400">% выполненных задач на разработчика за спринт</p>
    </div>
    <div class="h-56">
      <Line 
        :data="chartData" 
        :options="chartOptions" 
        :plugins="chartPlugins"
      />
    </div>
  </div>
</template>