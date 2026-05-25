export const hoverPointPlugin = {
  id: 'hoverPoint',

  afterDatasetsDraw(chart) {
    const { ctx, tooltip } = chart

    if (!tooltip || !tooltip._active?.length) return

    const point = tooltip._active[0].element
    const x = point.x
    const y = point.y

    const options = chart.options.plugins?.hoverPoint || {}
    const outerColor = options.outerColor || '#6366f1'
    const innerColor = options.innerColor || '#6366f1'
    const radius = options.radius || 6

		const r = radius
    const outerR = r
    const whiteR = r * 0.75
    const coreR = r * 0.45

    ctx.save()

    // outer colored ring
    ctx.beginPath()
    ctx.arc(x, y, outerR, 0, Math.PI * 2)
    ctx.fillStyle = outerColor
    ctx.fill()

    // white ring
    ctx.beginPath()
    ctx.arc(x, y, whiteR, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    // inner colored core
    ctx.beginPath()
    ctx.arc(x, y, coreR, 0, Math.PI * 2)
    ctx.fillStyle = innerColor
    ctx.fill()

    ctx.restore()
  }
}