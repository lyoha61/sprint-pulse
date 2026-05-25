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
import { tooltipCorner } from '@src/utils/chartPlugins/tooltipCorner'

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
      label: 'Багов',
      data: [4, 8, 5, 6], 
      fill: true,
      backgroundColor: function(context) {
        const chart = context.chart;
        const { chartArea } = chart;
        
        if (!chartArea) {
          return 'rgba(244, 63, 94, 0.2)';
        }
        
        return createVerticalGradient(
          chartArea, 
          chart, 
          'rgba(244, 63, 94, 0.2)', 
          'rgba(244, 63, 94, 0)'    
        );
      },
      borderColor: '#f43f5e',
      borderWidth: 2,

      pointBackgroundColor: 'rgba(244, 63, 94, 0.6)',
      pointBorderColor: '#f43f5e',
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
      outerColor: '#f43f5e',
      innerColor: '#f43f5e'
    },
    tooltip: {
      ...chartTooltipDefaults,
      callbacks: {
        label: function(context) {
          return `Багов: ${context.raw}`
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
      grace: "15%",
      ticks: {
        stepSize: 2,
        callback: function(value) {
          return value + ' шт.'
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
  createNormLinePlugin(3, '#fbbf24', 'Норма ≤ 3'),
  verticalLinePlugin,
  hoverPointPlugin,
  tooltipCorner,
]
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
    <div class="mb-4">
      <h3 class="text-slate-800">Пропущенные баги</h3>
      <p class="text-xs text-slate-400">Баги, найденные в продакшне после релиза</p>
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

