import { acl } from '@/shared/acl'
import { JSX, MouseEvent, memo } from 'react'

import PixelStore from '../../store/pixel.store'

interface IColor {
  className?: string
  rgbColor: string
}

const Color = ({ className = '', rgbColor }: IColor): JSX.Element => {
  const { pixelColor, setPixelColor } = PixelStore()
  const isActive = pixelColor === rgbColor
  const handleClick = (e: MouseEvent): void => {
    if (e.ctrlKey || isActive) return
    setPixelColor(rgbColor)
  }
  return (
    <button
      className={`${className} ${acl(pixelColor === rgbColor)}`}
      onClick={handleClick}
      style={{ backgroundColor: rgbColor }}
    />
  )
}

export default memo(Color)
