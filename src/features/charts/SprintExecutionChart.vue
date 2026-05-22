<script setup>
import { ref } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
)

const chartData = {
  labels: ['Спринт 1', 'Спринт 2', 'Спринт 3', 'Спринт 4'],
  datasets: [
    {
      label: 'План',
      data: [20, 25, 22, 20],
      backgroundColor: '#e2e8f0',
      borderColor: '#e2e8f0',
      borderWidth: 0,
      borderRadius: 4,
      barPercentage: 0.7
    },
    {
      label: 'Выполнено',
      data: [16, 20, 14, 12],
      backgroundColor: '#06b6d4',
      borderColor: '#06b6d4',
      borderWidth: 0,
      borderRadius: 4,
      barPercentage: 0.7
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#64748b',
        font: {
          size: 11
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      titleColor: '#fff',
      bodyColor: '#fff',
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${context.raw}%`
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
        color: '#94a3b8',
        font: {
          size: 11
        }
      }
    },
    y: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 25,
        callback: function(value) {
          return value + '%'
        },
        color: '#94a3b8',
        font: {
          size: 11
        }
      },
      grid: {
        color: '#f1f5f9',
        drawTicks: false
      }
    }
  }
}

const chartPlugins = [
  {
    id: 'goalLine',
    beforeDraw: (chart) => {
      const ctx = chart.ctx
      const yAxis = chart.scales.y
      const xScale = chart.scales.x
      const yPos = yAxis.getPixelForValue(80)
      
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(xScale.left, yPos)
      ctx.lineTo(xScale.right, yPos)
      ctx.lineWidth = 1
      ctx.strokeStyle = '#10b981'
      ctx.setLineDash([4, 4])
      ctx.stroke()
      ctx.restore()
      
      ctx.fillStyle = '#10b981'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Цель 80%', (xScale.left + xScale.right) / 2, yPos - 10)
    }
  }
]
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
    <div class="mb-4">
      <h3 class="text-slate-800">Выполнение спринта</h3>
      <p class="text-xs text-slate-400">% закрытых story points от запланированных</p>
    </div>
    <div class="h-56">
      <Bar 
        :data="chartData" 
        :options="chartOptions"
				:plugins="chartPlugins" 
      />
    </div>
  </div>
</template>