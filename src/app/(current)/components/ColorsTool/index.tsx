'use client'

import { acl } from '@/shared/acl'
import CanvasStore from '@home-store/canvas.store'
import { PaletteIcon } from 'lucide-react'
import type { JSX } from 'react'

import './style.scss'

const defaultColors = [
  'rgba(0, 0, 0, 255)',
  'rgba(128, 128, 128, 255)',
  'rgba(139, 0, 0, 255)',
  'rgba(255, 0, 0, 255)',
  'rgba(255, 165, 0, 255)',
  'rgba(255, 255, 0, 255)',
  'rgba(0, 128, 0, 255)',
  'rgba(0, 0, 255, 255)',
  'rgba(135, 206, 250, 255)',
  'rgba(128, 0, 128, 255)',
  'rgba(255, 255, 255, 255)',
  'rgba(165, 42, 42, 255)',
  'rgba(255, 192, 203, 255)',
  'rgba(255, 239, 204, 255)',
  'rgba(144, 238, 144, 255)',
  'rgba(230, 230, 250, 255)'
]

const ColorsTool = (): JSX.Element => {
  const { pixelColor, setPixelColor } = CanvasStore()
  return (
    <div className='tools-group col hColors'>
      <p className='tools-group__title'>Colores</p>
      <button className='hColors-more'>
        <PaletteIcon /> Escoger
      </button>
      <div className='tools-group__options'>
        {defaultColors.map(color => {
          const key = `${color}-color-${Math.random()}`
          return (
            <button
              key={key}
              className={`${acl(pixelColor === color)} hColors-color`}
              onClick={() => setPixelColor(color)}
              style={{ backgroundColor: color }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ColorsTool
