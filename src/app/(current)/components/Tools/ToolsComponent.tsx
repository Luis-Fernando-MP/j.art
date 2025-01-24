'use client'

import { acl } from '@/shared/acl'
import CanvasStore from '@home/store/canvas.store'
import ToolsStore from '@home/store/tools.store'
import {
  AlignCenterVerticalIcon,
  FlipHorizontal,
  FlipHorizontalIcon,
  FlipVertical,
  FlipVerticalIcon,
  Rotate3DIcon
} from 'lucide-react'
import type { JSX } from 'react'

import {
  changeBrushSize,
  flipHorizontal,
  getContext,
  rotateCanvas
} from '../../helpers/canvas.utils'

const ToolsComponent = (): JSX.Element => {
  const {
    fileName,
    horizontalFlip,
    verticalFlip,
    horizontalMirror,
    verticalMirror,
    selectedTool,
    setHorizontalFlip,
    setFileName,
    setHorizontalMirror,
    setSelectedTool,
    setVerticalFlip,
    setVerticalMirror
  } = ToolsStore()

  const { pixelColor, pixelOpacity, pixelSize, setPixelSize } = CanvasStore()

  return (
    <>
      <section className='tools-section'>
        <h3>Transformaciones</h3>
        <div className='tools-section__wrapper center'>
          {[1, 2, 3, 4, 3, 2, 1].map(size => {
            const key = `${size}-${Math.random()}-brush`
            const boxSize = 15 * size
            return (
              <button
                key={key}
                className={`tools-section__size ${acl(boxSize === pixelSize)}`}
                onClick={() => {
                  changeBrushSize(boxSize)
                  setPixelSize(boxSize)
                }}
                style={{
                  width: `${boxSize * 0.5}px`,
                  height: `${boxSize * 0.5}px`,
                  borderRadius: `${size}px`
                }}
              />
            )
          })}
        </div>

        <div className='tools-section__wrapper'>
          <p>Flips</p>
          <div className='tools-section__options'>
            <button
              className={acl(horizontalFlip)}
              onClick={() => {
                const { ctx } = getContext()
                flipHorizontal(ctx)
                setHorizontalFlip(!horizontalFlip)
              }}
            >
              <FlipHorizontalIcon />
            </button>
            <button className={acl(verticalFlip)} onClick={() => setVerticalFlip(!verticalFlip)}>
              <FlipVerticalIcon />
            </button>
          </div>
        </div>

        <div className='tools-section__wrapper'>
          <p>Rotación</p>
          <div className='tools-section__options'>
            <button
              onClick={() => {
                const { ctx } = getContext()
                rotateCanvas(ctx, 90)
              }}
            >
              <Rotate3DIcon />
            </button>
            <button>
              <AlignCenterVerticalIcon />
            </button>
          </div>
        </div>
      </section>
      <section className='tools-section'>
        <h3>Herramientas</h3>
      </section>
    </>
  )
}

export default ToolsComponent
