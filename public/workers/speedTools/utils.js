export function getPixelColor(imageData, alignedX, alignedY, width) {
  const index = (alignedY * width + alignedX) * 4
  const pixelData = imageData.data
  return [
    pixelData[index], // Red
    pixelData[index + 1], // Green
    pixelData[index + 2], // Blue
    pixelData[index + 3] // Alpha
  ]
}
export function handlePipetteColor(ctx, x, y) {
  const { width, height } = ctx.canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const [r, g, b, a] = getPixelColor(imageData, Math.floor(x), Math.floor(y), width)
  let alpha = a
  if (alpha <= 0) alpha = 255
  const color = `rgba(${r}, ${g}, ${b}, ${alpha})`
  return { rgba: color, iterable: [r, g, b, a], imageData }
}
const toIterableColor = color => {
  const newString = color.replace('rgba(', '').replace(')', '')
  return newString.split(',').map(Number)
}
export function handlePaintBucket(ctx, startX, startY, fillColor) {
  const { width, height } = ctx.canvas
  const { iterable, imageData } = handlePipetteColor(ctx, startX, startY)
  const pixelData = imageData.data
  const bgaColor = toIterableColor(fillColor)
  // Si el color inicial es igual al color de relleno
  if (iterable.every((v, i) => v === bgaColor[i])) return
  const getIndex = (x, y) => (y * width + x) * 4
  const isInsideCanvas = (x, y) => x >= 0 && x < width && y >= 0 && y < height
  const isSameColor = i =>
    pixelData[i] === iterable[0] &&
    pixelData[i + 1] === iterable[1] &&
    pixelData[i + 2] === iterable[2] &&
    pixelData[i + 3] === iterable[3]
  const stack = [[Math.floor(startX), Math.floor(startY)]]
  while (stack.length > 0) {
    const [currentX, currentY] = stack.pop()
    if (!isInsideCanvas(currentX, currentY)) continue
    const current = getIndex(currentX, currentY)
    if (!isSameColor(current)) continue
    // Pintar el píxel actual
    pixelData[current] = bgaColor[0]
    pixelData[current + 1] = bgaColor[1]
    pixelData[current + 2] = bgaColor[2]
    pixelData[current + 3] = bgaColor[3]
    // Añadir píxeles vecinos a la pila
    stack.push([currentX - 1, currentY]) // Izquierda
    stack.push([currentX + 1, currentY]) // Derecha
    stack.push([currentX, currentY - 1]) // Arriba
    stack.push([currentX, currentY + 1]) // Abajo
  }
  ctx.putImageData(imageData, 0, 0)
}
//# sourceMappingURL=utils.js.map
