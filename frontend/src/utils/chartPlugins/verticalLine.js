export const verticalLinePlugin = {
  id: 'verticalLine',
  beforeDatasetsDraw(chart) {
    const { ctx, tooltip, chartArea } = chart

    if (!tooltip || !tooltip._active || tooltip._active.length === 0) {
      return
    }

    const activePoint = tooltip._active[0]
    const x = activePoint.element.x

    ctx.save()

    ctx.beginPath()
    ctx.moveTo(x, chartArea.top)
    ctx.lineTo(x, chartArea.bottom)

    ctx.lineWidth = 1
    ctx.strokeStyle = '#C9C8CB'

    ctx.stroke()
    ctx.restore()
  }
}