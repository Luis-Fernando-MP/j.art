'use client'

import HorizontalSlider from '@/shared/components/HorizontalSlider'
import { BabyIcon, FlameIcon, LeafyGreenIcon, PaletteIcon } from 'lucide-react'
import type { JSX } from 'react'

import Color from './Color'
import { basicColorsRGBA } from './colors.'
import './style.scss'

interface IBoardColors {
  className?: string
}

const BoardColors = ({ className = '' }: IBoardColors): JSX.Element => {
  return (
    <section className={`${className} colorsTools`}>
      <div className='colorsTools-section'>
        <button className='colorsTools-action'>
          <PaletteIcon />
        </button>
      </div>
      <HorizontalSlider className='colorsTools-colors'>
        {basicColorsRGBA.map(color => {
          const key = `${color}-basic-color`
          return <Color key={key} rgbColor={color} className='colorsTools-color' />
        })}
      </HorizontalSlider>
      <div className='colorsTools-section'>
        <button className='colorsTools-action'>
          <BabyIcon />
        </button>
        <button className='colorsTools-action'>
          <LeafyGreenIcon />
        </button>
        <button className='colorsTools-action'>
          <FlameIcon />
        </button>
      </div>
      <div className='colorsTools-styles'></div>
    </section>
  )
}

export default BoardColors
