'use client'

export function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number, opacity = 1) {
  ctx.globalAlpha = opacity
  ctx.fillStyle = color
  ctx.fillRect(Math.floor(x) * size, Math.floor(y) * size, size, size)
  ctx.globalAlpha = 1
}

export function applyMirror(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  size: number,
  opacity: number,
  mirror: 'vertical' | 'horizontal'
) {
  const width = ctx.canvas.width / size
  const height = ctx.canvas.height / size

  if (mirror === 'horizontal') {
    const mirrorX = width - 1 - x
    return drawPixel(ctx, mirrorX, y, color, size, opacity)
  }
  if (mirror === 'vertical') {
    const mirrorY = height - 1 - y
    return drawPixel(ctx, x, mirrorY, color, size, opacity)
  }
  const mirrorX = width - 1 - x
  const mirrorY = height - 1 - y
  drawPixel(ctx, mirrorX, mirrorY, color, size, opacity)
}
