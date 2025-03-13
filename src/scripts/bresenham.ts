'use client'

export interface IShapeBresenham {
  ctx: CanvasRenderingContext2D
  startX: number
  startY: number
  endX: number
  endY: number
  pixelSize: number
  pixelColor: string
  perfectShape: boolean
  snapshot?: ImageData | null
}

interface IPointsBresenham {
  x0: number
  y0: number
  x1: number
  y1: number
  pixelSize: number
}

interface IDrawPoint {
  ctx: CanvasRenderingContext2D
  pixelSize: number
  points: number[][]
  pixelColor: string
  snapshot?: ImageData | null
}

export const alignCord = (coord: number, pixelSize: number) => {
  return Math.floor(coord / pixelSize) * pixelSize
}

export function drawCircleBresenham({ ctx, startX, startY, endX, endY, pixelSize, pixelColor, snapshot }: IShapeBresenham) {
  const radius = Math.max(Math.abs(endX - startX), Math.abs(endY - startY)) / (pixelSize * 2)
  const centerX = startX + radius
  const centerY = startY + radius

  let x = radius * 2
  let y = 0
  let decisionOver = 0

  ctx.clearRect(startX, startY, endX, endY)
  if (snapshot) ctx.putImageData(snapshot, 0, 0)

  ctx.imageSmoothingEnabled = false
  ctx.fillStyle = pixelColor
  ctx.beginPath()

  while (y <= x) {
    ctx.fillRect(centerX + x * pixelSize, centerY + y * pixelSize, pixelSize, pixelSize)
    ctx.fillRect(centerX + y * pixelSize, centerY + x * pixelSize, pixelSize, pixelSize)
    ctx.fillRect(centerX - y * pixelSize, centerY + x * pixelSize, pixelSize, pixelSize)
    ctx.fillRect(centerX - x * pixelSize, centerY + y * pixelSize, pixelSize, pixelSize)
    ctx.fillRect(centerX - x * pixelSize, centerY - y * pixelSize, pixelSize, pixelSize)
    ctx.fillRect(centerX - y * pixelSize, centerY - x * pixelSize, pixelSize, pixelSize)
    ctx.fillRect(centerX + y * pixelSize, centerY - x * pixelSize, pixelSize, pixelSize)
    ctx.fillRect(centerX + x * pixelSize, centerY - y * pixelSize, pixelSize, pixelSize)

    y++
    if (decisionOver <= 0) {
      decisionOver += 2 * y + 1
    } else {
      x--
      decisionOver += 2 * (y - x) + 1
    }
  }
  ctx.closePath()
}

export function drawTriangleBresenham({
  ctx,
  startX,
  startY,
  endX,
  endY,
  pixelSize,
  pixelColor,
  perfectShape = false,
  snapshot
}: IShapeBresenham) {
  ctx.clearRect(startX, startY, endX - startX, endY - startY)
  if (snapshot) ctx.putImageData(snapshot, 0, 0)

  const width = Math.abs(endX - startX)
  const height = Math.abs(endY - startY)
  const directionY = endY > startY ? 1 : -1
  const directionX = endX > startX ? 1 : -1

  const baseX1 = startX
  const baseY1 = startY
  let baseX2 = endX
  const baseY2 = startY
  let apexX = startX + (width / 2) * directionX
  let apexY = startY + height * directionY

  if (perfectShape) {
    const sideLength = Math.min(width, height * 2)
    baseX2 = startX + sideLength * directionX
    apexX = startX + (sideLength / 2) * directionX
    apexY = startY + ((sideLength * Math.sqrt(3)) / 2) * directionY
  }

  const line1 = bresenham({
    x0: alignCord(baseX1, pixelSize),
    y0: alignCord(baseY1, pixelSize),
    x1: alignCord(baseX2, pixelSize),
    y1: alignCord(baseY2, pixelSize),
    pixelSize
  })
  const line2 = bresenham({
    x0: alignCord(baseX1, pixelSize),
    y0: alignCord(baseY1, pixelSize),
    x1: alignCord(apexX, pixelSize),
    y1: alignCord(apexY, pixelSize),
    pixelSize
  })
  const line3 = bresenham({
    x0: alignCord(baseX2, pixelSize),
    y0: alignCord(baseY2, pixelSize),
    x1: alignCord(apexX, pixelSize),
    y1: alignCord(apexY, pixelSize),
    pixelSize
  })

  drawPoints({ ctx, pixelColor, pixelSize, points: line1 })
  drawPoints({ ctx, pixelColor, pixelSize, points: line2 })
  drawPoints({ ctx, pixelColor, pixelSize, points: line3 })
}

export function drawXBresenham({
  ctx,
  startX,
  startY,
  endX,
  endY,
  pixelSize,
  pixelColor,
  perfectShape = false,
  snapshot
}: IShapeBresenham) {
  ctx.clearRect(startX, startY, endX - startX, endY - startY)
  if (snapshot) ctx.putImageData(snapshot, 0, 0)

  let aStartX = startX
  let aStartY = startY
  let aEndX = endX
  let aEndY = endY
  let eStartX = startX
  let eStartY = endY
  let eEndX = endX
  let eEndY = startY

  if (perfectShape) {
    const centerX = (startX + endX) / 2
    const centerY = (startY + endY) / 2
    const halfWidth = Math.abs(endX - startX) / 2
    const halfHeight = Math.abs(endY - startY) / 2
    const minHalf = Math.min(halfWidth, halfHeight)

    aStartX = centerX - minHalf
    aStartY = centerY - minHalf
    aEndX = centerX + minHalf
    aEndY = centerY + minHalf
    eStartX = centerX - minHalf
    eStartY = centerY + minHalf
    eEndX = centerX + minHalf
    eEndY = centerY - minHalf
  }

  aStartX = alignCord(aStartX, pixelSize)
  aStartY = alignCord(aStartY, pixelSize)
  aEndX = alignCord(aEndX, pixelSize)
  aEndY = alignCord(aEndY, pixelSize)
  eStartX = alignCord(eStartX, pixelSize)
  eStartY = alignCord(eStartY, pixelSize)
  eEndX = alignCord(eEndX, pixelSize)
  eEndY = alignCord(eEndY, pixelSize)

  const a = bresenham({
    x0: aStartX,
    y0: aStartY,
    x1: aEndX,
    y1: aEndY,
    pixelSize
  })
  const e = bresenham({
    x0: eStartX,
    y0: eStartY,
    x1: eEndX,
    y1: eEndY,
    pixelSize
  })

  drawPoints({ ctx, pixelColor, pixelSize, points: a })
  drawPoints({ ctx, pixelColor, pixelSize, points: e })
}

export function drawPentagonBresenham({ ctx, startX, startY, endX, endY, pixelSize, pixelColor, snapshot }: IShapeBresenham) {
  ctx.clearRect(startX, startY, endX - startX, endY - startY)
  if (snapshot) ctx.putImageData(snapshot, 0, 0)
  const sideLength = Math.min(Math.abs(endX - startX), Math.abs(endY - startY))

  const centerX = (endX + startX) / 2
  const centerY = (endY + startY) / 2
  const radius = sideLength / (2 * Math.sin(Math.PI / 5))

  const vertices = []
  for (let i = 0; i < 5; i++) {
    const angle = ((Math.PI * 2) / 5) * i - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    vertices.push({ x: alignCord(x, pixelSize), y: alignCord(y, pixelSize) })
  }

  const lines = []
  for (let i = 0; i < vertices.length; i++) {
    const start = vertices[i]
    const end = vertices[(i + 1) % vertices.length]
    lines.push(
      bresenham({
        x0: start.x,
        y0: start.y,
        x1: end.x,
        y1: end.y,
        pixelSize
      })
    )
  }
  for (const line of lines) {
    drawPoints({ ctx, pixelColor, pixelSize, points: line })
  }
}

export function drawSquareBresenham({
  ctx,
  startX,
  startY,
  endX,
  endY,
  pixelSize,
  pixelColor,
  perfectShape = false,
  snapshot
}: IShapeBresenham) {
  const width = Math.abs(endX - startX)
  const height = Math.abs(endY - startY)

  ctx.clearRect(startX, startY, endX - startX, endY - startY)
  if (snapshot) ctx.putImageData(snapshot, 0, 0)

  let x0 = Math.min(startX, endX)
  let y0 = Math.min(startY, endY)
  let x1 = x0 + width
  let y1 = y0 + height

  if (perfectShape) {
    const sideLength = Math.min(width, height)
    x1 = x0 + sideLength
    y1 = y0 + sideLength
  }

  x0 = alignCord(x0, pixelSize)
  y0 = alignCord(y0, pixelSize)
  x1 = alignCord(x1, pixelSize)
  y1 = alignCord(y1, pixelSize)

  const top = bresenham({ x0: x0, y0: y0, x1: x1, y1: y0, pixelSize })
  const bottom = bresenham({ x0: x1, y0: y1, x1: x0, y1: y1, pixelSize })
  const right = bresenham({ x0: x1, y0: y0, x1: x1, y1: y1, pixelSize })
  const left = bresenham({ x0: x0, y0: y1, x1: x0, y1: y0, pixelSize })

  drawPoints({ points: top, ctx, pixelColor, pixelSize })
  drawPoints({ points: bottom, ctx, pixelColor, pixelSize })
  drawPoints({ points: right, ctx, pixelColor, pixelSize })
  drawPoints({ points: left, ctx, pixelColor, pixelSize })
}

export function drawLineBresenham({
  ctx,
  startX,
  startY,
  endX,
  endY,
  pixelSize,
  pixelColor,
  perfectShape,
  snapshot
}: IShapeBresenham) {
  const width = endX - startX
  const height = endY - startY
  ctx.clearRect(startX, startY, Math.abs(width), Math.abs(height))
  if (snapshot) ctx.putImageData(snapshot, 0, 0)
  if (perfectShape) {
    const sideLength = Math.min(Math.abs(width), Math.abs(height))
    if (width > 0) endX = startX + sideLength
    else endX = startX - sideLength

    if (height > 0) endY = startY + sideLength
    else endY = startY - sideLength
  }

  endX = alignCord(endX, pixelSize)
  endY = alignCord(endY, pixelSize)

  const points = bresenham({
    x0: startX,
    y0: startY,
    x1: endX,
    y1: endY,
    pixelSize
  })

  drawPoints({ ctx, pixelColor, pixelSize, points })
}

export function drawHexagonBresenham({ ctx, startX, startY, endX, endY, pixelSize, pixelColor, snapshot }: IShapeBresenham) {
  ctx.clearRect(startX, startY, endX - startX, endY - startY)
  if (snapshot) ctx.putImageData(snapshot, 0, 0)
  const sideLength = Math.min(Math.abs(endX - startX), Math.abs(endY - startY))

  const centerX = (startX + endX) / 2
  const centerY = (startY + endY) / 2
  const radius = sideLength / (2 * Math.sin(Math.PI / 6))

  const vertices = []
  for (let i = 0; i < 6; i++) {
    const angle = ((Math.PI * 2) / 6) * i - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    vertices.push({ x: alignCord(x, pixelSize), y: alignCord(y, pixelSize) })
  }

  const lines = []
  for (let i = 0; i < vertices.length; i++) {
    const start = vertices[i]
    const end = vertices[(i + 1) % vertices.length]
    lines.push(
      bresenham({
        x0: start.x,
        y0: start.y,
        x1: end.x,
        y1: end.y,
        pixelSize
      })
    )
  }
  for (const line of lines) {
    drawPoints({ ctx, pixelColor, pixelSize, points: line })
  }
}

export function drawRightTriangleBresenham({
  ctx,
  startX,
  startY,
  endX,
  endY,
  pixelSize,
  pixelColor,
  perfectShape = false,
  snapshot
}: IShapeBresenham) {
  ctx.clearRect(startX, startY, endX - startX, endY - startY)
  if (snapshot) ctx.putImageData(snapshot, 0, 0)

  const baseX1 = startX
  const baseY1 = startY
  let baseX2 = endX
  const baseY2 = startY
  const apexX = startX
  let apexY = endY

  if (perfectShape) {
    const width = Math.abs(endX - startX)
    const height = Math.abs(endY - startY)
    const sideLength = Math.min(width, height)
    baseX2 = baseX1 + sideLength
    apexY = baseY1 + sideLength
  }

  const line1 = bresenham({
    x0: alignCord(baseX1, pixelSize),
    y0: alignCord(baseY1, pixelSize),
    x1: alignCord(baseX2, pixelSize),
    y1: alignCord(baseY2, pixelSize),
    pixelSize
  })
  const line2 = bresenham({
    x0: alignCord(baseX1, pixelSize),
    y0: alignCord(baseY1, pixelSize),
    x1: alignCord(apexX, pixelSize),
    y1: alignCord(apexY, pixelSize),
    pixelSize
  })
  const line3 = bresenham({
    x0: alignCord(baseX2, pixelSize),
    y0: alignCord(baseY2, pixelSize),
    x1: alignCord(apexX, pixelSize),
    y1: alignCord(apexY, pixelSize),
    pixelSize
  })

  drawPoints({ ctx, pixelColor, pixelSize, points: line1 })
  drawPoints({ ctx, pixelColor, pixelSize, points: line2 })
  drawPoints({ ctx, pixelColor, pixelSize, points: line3 })
}

export function drawStarBresenham({ ctx, startX, startY, endX, endY, pixelSize, pixelColor, snapshot }: IShapeBresenham) {
  ctx.clearRect(startX, startY, endX - startX, endY - startY)
  if (snapshot) ctx.putImageData(snapshot, 0, 0)

  const centerX = (startX + endX) / 2
  const centerY = (startY + endY) / 2
  const outerRadius = Math.min(Math.abs(endX - startX), Math.abs(endY - startY)) / 2
  const innerRadius = outerRadius / 2.5

  const points = []
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 4 // 5 picos
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    points.push({ x: alignCord(x, pixelSize), y: alignCord(y, pixelSize) })
  }

  for (let i = 0; i < points.length; i++) {
    const start = points[i]
    const end = points[(i + 1) % points.length]
    const line = bresenham({
      x0: start.x,
      y0: start.y,
      x1: end.x,
      y1: end.y,
      pixelSize
    })
    drawPoints({ ctx, pixelColor, pixelSize, points: line })
  }
}

export function drawHeartBresenham({
  ctx,
  startX,
  startY,
  endX,
  endY,
  pixelSize,
  pixelColor,
  perfectShape = false,
  snapshot
}: IShapeBresenham) {
  console.log('drawHeartBresenham', perfectShape)
  ctx.clearRect(startX, startY, endX - startX, endY - startY)
  if (snapshot) ctx.putImageData(snapshot, 0, 0)

  const centerX = (startX + endX) / 2
  const centerY = (startY + endY) / 2
  const width = Math.abs(endX - startX)
  const height = Math.abs(endY - startY)
  const scaleX = width / 4
  const scaleY = height / 4

  const points = []
  for (let angle = 0; angle < 360; angle++) {
    const rad = (angle * Math.PI) / 180
    const x = centerX + scaleX * (16 * Math.sin(rad) ** 3)
    const y = centerY - scaleY * (13 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
    points.push([alignCord(x, pixelSize), alignCord(y, pixelSize)]) // Almacena como [x, y]
  }

  drawPoints({ ctx, pixelColor, points, pixelSize }) // Llama a drawPoints con el arreglo de puntos
}

export function drawTorusBresenham({
  ctx,
  startX,
  startY,
  endX,
  endY,
  pixelSize,
  pixelColor,
  perfectShape = false,
  snapshot
}: IShapeBresenham) {
  ctx.clearRect(startX, startY, endX - startX, endY - startY)
  if (snapshot) ctx.putImageData(snapshot, 0, 0)

  const centerX = (startX + endX) / 2
  const centerY = (startY + endY) / 2
  const outerRadius = perfectShape ? Math.min(Math.abs(endX - startX), Math.abs(endY - startY)) / 4 : Math.abs(endX - startX) / 4
  const innerRadius = outerRadius / 2

  const points = []

  // Dibuja el toro como dos círculos concéntricos
  for (let angle = 0; angle < 360; angle++) {
    const rad = (angle * Math.PI) / 180

    // Círculo exterior
    const xOuter = centerX + outerRadius * Math.cos(rad)
    const yOuter = centerY + outerRadius * Math.sin(rad)
    points.push([alignCord(xOuter, pixelSize), alignCord(yOuter, pixelSize)])

    // Círculo interior
    const xInner = centerX + innerRadius * Math.cos(rad)
    const yInner = centerY + innerRadius * Math.sin(rad)
    points.push([alignCord(xInner, pixelSize), alignCord(yInner, pixelSize)])
  }

  drawPoints({ ctx, pixelColor, pixelSize, points })
}

export function drawHouseBresenham({ ctx, startX, startY, endX, endY, pixelSize, pixelColor, snapshot }: IShapeBresenham) {
  ctx.clearRect(startX, startY, endX - startX, endY - startY)
  if (snapshot) ctx.putImageData(snapshot, 0, 0)

  const width = Math.abs(endX - startX)
  const height = Math.abs(endY - startY)

  const houseWidth = width / 2
  const houseHeight = height / 2

  const x0 = startX
  const y0 = startY + houseHeight
  const x1 = startX + houseWidth
  const y1 = startY

  const bodyPoints = [
    [alignCord(x0, pixelSize), alignCord(y0, pixelSize)],
    [alignCord(x1, pixelSize), alignCord(y0, pixelSize)],
    [alignCord(x1, pixelSize), alignCord(y1, pixelSize)],
    [alignCord(x0, pixelSize), alignCord(y1, pixelSize)]
  ]

  const roofHeight = houseHeight / 2
  const apexX = startX + houseWidth / 2
  const apexY = startY - roofHeight

  for (let i = 0; i < bodyPoints.length; i++) {
    const start = bodyPoints[i]
    const end = bodyPoints[(i + 1) % bodyPoints.length]
    const line = bresenham({
      x0: start[0],
      y0: start[1],
      x1: end[0],
      y1: end[1],
      pixelSize
    })
    drawPoints({ ctx, pixelColor, pixelSize, points: line })
  }

  const roofPoints = [
    [alignCord(x0, pixelSize), alignCord(y1, pixelSize)],
    [alignCord(apexX, pixelSize), alignCord(apexY, pixelSize)],
    [alignCord(x1, pixelSize), alignCord(y1, pixelSize)]
  ]

  for (let i = 0; i < roofPoints.length; i++) {
    const start = roofPoints[i]
    const end = roofPoints[(i + 1) % roofPoints.length]
    const line = bresenham({
      x0: start[0],
      y0: start[1],
      x1: end[0],
      y1: end[1],
      pixelSize
    })
    drawPoints({ ctx, pixelColor, pixelSize, points: line })
  }
}

export function drawPoints({ ctx, pixelColor, points, pixelSize }: IDrawPoint) {
  ctx.imageSmoothingEnabled = false
  ctx.fillStyle = pixelColor
  ctx.lineWidth = pixelSize
  ctx.beginPath()
  for (const point of points) {
    const [x, y] = point
    ctx.fillRect(Math.floor(x), Math.floor(y), pixelSize, pixelSize)
  }
  ctx.closePath()
}

export function bresenham(props: IPointsBresenham) {
  const { x1, y1, pixelSize } = { ...props }
  let x0 = props.x0
  let y0 = props.y0
  const dx = Math.abs(x1 - x0)
  const dy = Math.abs(y1 - y0)
  const sx = x1 > x0 ? pixelSize : -pixelSize
  const sy = y1 > y0 ? pixelSize : -pixelSize
  let err = dx - dy
  const points = []

  while (true) {
    points.push([x0, y0])
    if (x0 === x1 && y0 === y1) break
    const e2 = err * 2
    if (e2 > -dy) {
      err -= dy
      x0 += sx
    }
    if (e2 < dx) {
      err += dx
      y0 += sy
    }
  }

  return points
}
