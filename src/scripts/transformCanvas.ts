'use client'

import toast from 'react-hot-toast'

const tempOffscreenCanvas = new OffscreenCanvas(0, 0)
const tempOffscreenCtx = tempOffscreenCanvas.getContext('2d')!

export const getContext = (id: string = 'canvas') => {
  const canvas = document.getElementById(id) as HTMLCanvasElement
  const ctx = canvas?.getContext('2d')
  if (!(canvas instanceof HTMLCanvasElement) || !ctx) {
    toast.error('no hemos encontrado el lienzo actual')
    return null
  }
  return { canvas, ctx }
}

function prepareTempCanvas(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  tempOffscreenCanvas.width = width
  tempOffscreenCanvas.height = height
  tempOffscreenCtx.drawImage(ctx.canvas, 0, 0)
  ctx.clearRect(0, 0, width, height)
}

export function changeGridSize(size: number) {
  const $body = document.body
  if (!($body instanceof HTMLElement)) return null
  $body.style.setProperty('--s-grid', `${size}px`)
}

export function rotateCanvas(ctx: CanvasRenderingContext2D, deg: number) {
  prepareTempCanvas(ctx)
  const { width, height } = ctx.canvas
  const rad = (deg * Math.PI) / 180
  ctx.translate(width / 2, height / 2)
  ctx.rotate(rad)
  ctx.drawImage(tempOffscreenCanvas, -width / 2, -height / 2, width, height)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}

export function flipHorizontal(ctx: CanvasRenderingContext2D) {
  prepareTempCanvas(ctx)
  ctx.scale(-1, 1)
  ctx.drawImage(tempOffscreenCanvas, -ctx.canvas.width, 0)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  tempOffscreenCtx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export function flipVertical(ctx: CanvasRenderingContext2D) {
  prepareTempCanvas(ctx)
  ctx.scale(1, -1)
  ctx.drawImage(tempOffscreenCanvas, 0, -ctx.canvas.height)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  tempOffscreenCtx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}
