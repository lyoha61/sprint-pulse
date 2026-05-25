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
import { verticalLinePlugin } from '@src/utils/chartPlugins/verticalLine'
import { hoverPointPlugin } from '@src/utils/chartPlugins/hoverPoint';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
)

const chartData = {
  labels: ['Спринт 1', 'Спринт 2', 'Спринт 3', 'Спринт 4'],
  datasets: [
    {
      label: 'Возвратов',
      data: [1, 2, 1, 2],
      fill: false, 
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderColor: '#8b5cf6',
      pointBackgroundColor: '#8b5cf6',
      pointBorderColor: '#8b5cf6',
      pointRadius: 6,
      tension: 0.4,
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
      outerColor: '#8b5cf6',
      innerColor: '#8b5cf6'
    },
    tooltip: {
      ...chartTooltipDefaults,
      callbacks: {
        label: function(context) {
          return `Возвратов: ${context.raw}`
        }
      }
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
      max: 4,
      ticks: {
        stepSize: 1,
        callback: function(value) {
          return value + ' раз'
        },
        color: '#94a3b8'
      },
      border: {
        display: false,
        dash: [3, 3]
      },
      grid: {
        color: '#f1f5f9',
      }
    }
  }
}

const chartPlugins = [
  createNormLinePlugin(1.5, '#10b981', 'Норма 1.5'),
  verticalLinePlugin,
  hoverPointPlugin
]
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
    <div class="mb-4">
      <h3 class="text-slate-800">Возвраты с код ревью</h3>
      <p class="text-xs text-slate-400">Среднее число итераций до принятия PR</p>
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
