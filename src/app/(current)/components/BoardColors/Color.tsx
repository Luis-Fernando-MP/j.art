import { acl } from '@/shared/acl'
import { JSX, MouseEvent, memo } from 'react'

import PixelStore from '../../store/pixel.store'

interface IColor {
  className?: string
  rgbColor: string
}

const Color = ({ className = '', rgbColor }: IColor): JSX.Element => {
  const { pixelColor, setPixelColor } = PixelStore()
  const isSelectedColor = pixelColor.replaceAll(' ', '').includes(rgbColor)

  const handleClick = (e: MouseEvent): void => {
    if (e.ctrlKey || isSelectedColor) return
    setPixelColor(rgbColor)
  }

  return (
    <button className={`${className} ${acl(isSelectedColor, 'selected')}`} onClick={handleClick}>
      <div style={{ backgroundColor: rgbColor }} />
    </button>
  )
}

export default memo(Color)
