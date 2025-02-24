```js
import type { Position, ToolState, Layer } from "../types/types"



export function getPixelColor(imageData: ImageData, x: number, y: number): string {
  const index = (Math.floor(y) * imageData.width + Math.floor(x)) * 4
  return `rgb(${imageData.data[index]},${imageData.data[index + 1]},${imageData.data[index + 2]})`
}

export function getColorAtPixel(ctx: CanvasRenderingContext2D, x: number, y: number): string {
  const imageData = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1)
  const [r, g, b, a] = imageData.data
  return `rgba(${r},${g},${b},${a / 255})`
}



export function applyShade(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shade: number) {
  const imageData = ctx.getImageData(x * size, y * size, size, size)
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = Math.max(0, imageData.data[i] - shade)
    imageData.data[i + 1] = Math.max(0, imageData.data[i + 1] - shade)
    imageData.data[i + 2] = Math.max(0, imageData.data[i + 2] - shade)
  }
  ctx.putImageData(imageData, x * size, y * size)
}

export function applyTint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, tint: number) {
  const imageData = ctx.getImageData(x * size, y * size, size, size)
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = Math.min(255, imageData.data[i] + tint)
    imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] + tint)
    imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] + tint)
  }
  ctx.putImageData(imageData, x * size, y * size)
}

export function applyPixelate(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, pixelSize: number) {
  const imageData = ctx.getImageData(x * size, y * size, size, size)
  for (let py = 0; py < size; py += pixelSize) {
    for (let px = 0; px < size; px += pixelSize) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        count = 0
      for (let i = 0; i < pixelSize && py + i < size; i++) {
        for (let j = 0; j < pixelSize && px + j < size; j++) {
          const index = ((py + i) * size + px + j) * 4
          r += imageData.data[index]
          g += imageData.data[index + 1]
          b += imageData.data[index + 2]
          a += imageData.data[index + 3]
          count++
        }
      }
      r = Math.round(r / count)
      g = Math.round(g / count)
      b = Math.round(b / count)
      a = Math.round(a / count)
      for (let i = 0; i < pixelSize && py + i < size; i++) {
        for (let j = 0; j < pixelSize && px + j < size; j++) {
          const index = ((py + i) * size + px + j) * 4
          imageData.data[index] = r
          imageData.data[index + 1] = g
          imageData.data[index + 2] = b
          imageData.data[index + 3] = a
        }
      }
    }
  }
  ctx.putImageData(imageData, x * size, y * size)
}

export function applyNoise(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, amount: number) {
  const imageData = ctx.getImageData(x * size, y * size, size, size)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * amount
    imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + noise))
    imageData.data[i + 1] = Math.min(255, Math.max(0, imageData.data[i + 1] + noise))
    imageData.data[i + 2] = Math.min(255, Math.max(0, imageData.data[i + 2] + noise))
  }
  ctx.putImageData(imageData, x * size, y * size)
}

export function applyGradient(
  ctx: CanvasRenderingContext2D,
  start: Position,
  end: Position,
  startColor: string,
  endColor: string,
  size: number,
) {
  const gradient = ctx.createLinearGradient(start.x * size, start.y * size, end.x * size, end.y * size)
  gradient.addColorStop(0, startColor)
  gradient.addColorStop(1, endColor)
  ctx.fillStyle = gradient
  ctx.fillRect(
    Math.min(start.x, end.x) * size,
    Math.min(start.y, end.y) * size,
    Math.abs(end.x - start.x) * size,
    Math.abs(end.y - start.y) * size,
  )
}

export function applySymmetry(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  size: number,
  opacity: number,
) {
  const { width, height } = ctx.canvas
  const centerX = width / (2 * size)
  const centerY = height / (2 * size)

  drawPixel(ctx, x, y, color, size, opacity)
  drawPixel(ctx, 2 * centerX - x, y, color, size, opacity)
  drawPixel(ctx, x, 2 * centerY - y, color, size, opacity)
  drawPixel(ctx, 2 * centerX - x, 2 * centerY - y, color, size, opacity)
}



export function applyDither(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const imageData = ctx.getImageData(x * size, y * size, size, size)
  const factor = 1 / 16
  const matrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ]

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const index = (py * size + px) * 4
      const oldR = imageData.data[index]
      const oldG = imageData.data[index + 1]
      const oldB = imageData.data[index + 2]

      const newR = oldR < 128 ? 0 : 255
      const newG = oldG < 128 ? 0 : 255
      const newB = oldB < 128 ? 0 : 255

      imageData.data[index] = newR
      imageData.data[index + 1] = newG
      imageData.data[index + 2] = newB

      const errR = oldR - newR
      const errG = oldG - newG
      const errB = oldB - newB

      const matrixValue = matrix[py % 4][px % 4]
      const diffusion = factor * matrixValue

      if (px < size - 1) {
        imageData.data[index + 4] += errR * diffusion
        imageData.data[index + 5] += errG * diffusion
        imageData.data[index + 6] += errB * diffusion
      }
      if (py < size - 1) {
        imageData.data[index + size * 4] += errR * diffusion
        imageData.data[index + size * 4 + 1] += errG * diffusion
        imageData.data[index + size * 4 + 2] += errB * diffusion
      }
    }
  }

  ctx.putImageData(imageData, x * size, y * size)
}

export function applyPattern(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, patternType: string) {
  const imageData = ctx.getImageData(x * size, y * size, size, size)

  const patterns: { [key: string]: (x: number, y: number) => boolean } = {
    checkerboard: (x, y) => (x + y) % 2 === 0,
    stripes: (x, _y) => x % 2 === 0,
    dots: (x, y) => x % 2 === 0 && y % 2 === 0,
  }

  const pattern = patterns[patternType] || patterns.checkerboard

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const index = (py * size + px) * 4
      if (pattern(px, py)) {
        imageData.data[index] = 0
        imageData.data[index + 1] = 0
        imageData.data[index + 2] = 0
      } else {
        imageData.data[index] = 255
        imageData.data[index + 1] = 255
        imageData.data[index + 2] = 255
      }
    }
  }

  ctx.putImageData(imageData, x * size, y * size)
}

export function applyOutline(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  const imageData = ctx.getImageData(x * size, y * size, size, size)
  const outlineData = new Uint8ClampedArray(imageData.data.length)

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const index = (py * size + px) * 4
      if (imageData.data[index + 3] > 0) {
        // If pixel is not transparent
        // Check neighboring pixels
        const neighbors = [
          [-1, -1],
          [0, -1],
          [1, -1],
          [-1, 0],
          [1, 0],
          [-1, 1],
          [0, 1],
          [1, 1],
        ]

        for (const [dx, dy] of neighbors) {
          const nx = px + dx
          const ny = py + dy
          if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
            const neighborIndex = (ny * size + nx) * 4
            if (imageData.data[neighborIndex + 3] === 0) {
              // If neighbor is transparent
              outlineData[index] = Number.parseInt(color.slice(1, 3), 16)
              outlineData[index + 1] = Number.parseInt(color.slice(3, 5), 16)
              outlineData[index + 2] = Number.parseInt(color.slice(5, 7), 16)
              outlineData[index + 3] = 255
              break
            }
          }
        }
      }
    }
  }

  const outlineImageData = new ImageData(outlineData, size, size)
  ctx.putImageData(outlineImageData, x * size, y * size)
}

export function applyColorReplace(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  oldColor: string,
  newColor: string,
) {
  const imageData = ctx.getImageData(x * size, y * size, size, size)
  const oldRGB = hexToRgb(oldColor)
  const newRGB = hexToRgb(newColor)

  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i] === oldRGB.r && imageData.data[i + 1] === oldRGB.g && imageData.data[i + 2] === oldRGB.b) {
      imageData.data[i] = newRGB.r
      imageData.data[i + 1] = newRGB.g
      imageData.data[i + 2] = newRGB.b
    }
  }

  ctx.putImageData(imageData, x * size, y * size)
}

export function applyPixelPerfect(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  const imageData = ctx.getImageData(x * size, y * size, size, size)
  const rgb = hexToRgb(color)

  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i + 3] > 0) {
      // If pixel is not fully transparent
      imageData.data[i] = rgb.r
      imageData.data[i + 1] = rgb.g
      imageData.data[i + 2] = rgb.b
      imageData.data[i + 3] = 255 // Full opacity
    }
  }

  ctx.putImageData(imageData, x * size, y * size)
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

```

```js
switch (tool.type) {
      case "transparency":
        const currentColor = getColorAtPixel(layerCtx, x * PIXEL_SIZE, y * PIXEL_SIZE)
        const [r, g, b, a] = currentColor.match(/\d+/g)!.map(Number)
        const newOpacity = Math.max(0, a / 255 - 0.1)
        const newColor = `rgba(${r},${g},${b},${newOpacity})`
        drawPixel(layerCtx, x, y, newColor, PIXEL_SIZE)
        applyMirror(layerCtx, x, y, newColor, PIXEL_SIZE, newOpacity, tool.mirror)
        break

      case "shade": SOMBRA
        applyShade(layerCtx, x, y, PIXEL_SIZE, 20)
        break
      case "pixelate":
        applyPixelate(layerCtx, x, y, PIXEL_SIZE, 2)
        break
      case "noise":
        applyNoise(layerCtx, x, y, PIXEL_SIZE, 50)
        break
      case "dither":
        applyDither(layerCtx, x, y, PIXEL_SIZE)
        break
      case "pattern":
        applyPattern(layerCtx, x, y, PIXEL_SIZE, patternType)
        break
      case "outline":
        applyOutline(layerCtx, x, y, PIXEL_SIZE, tool.color)
        break
      case "colorReplace":
        applyColorReplace(layerCtx, x, y, PIXEL_SIZE, oldColor, tool.color)
        break
      case "pixelPerfect":
        applyPixelPerfect(layerCtx, x, y, PIXEL_SIZE, tool.color)
        break
    }
```
