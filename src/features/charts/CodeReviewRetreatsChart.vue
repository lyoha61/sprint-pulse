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
import { createVerticalGradient, createNormLinePlugin } from '@src/utils/chartUtils'

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
      data: [1, 2, 1, 2], // Данные по возвратам
      fill: false, // Без заливки
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderColor: '#8b5cf6',
      pointBackgroundColor: '#8b5cf6',
      pointBorderColor: '#8b5cf6',
      pointRadius: 5,
      tension: 0.4,
      borderDash: [6, 0], // Сплошная линия, но точки могут быть пунктирными
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      titleColor: '#fff',
      bodyColor: '#fff',
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
        display: false
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
      grid: {
        color: '#f1f5f9',
        drawTicks: false
      }
    }
  }
}

const chartPlugins = [
  createNormLinePlugin(1.5, '#10b981', 'Норма 1.5')
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
