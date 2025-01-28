import { acl } from '@/shared/acl'
import {
  AlignCenterVerticalIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
  Rotate3DIcon
} from 'lucide-react'
import type { JSX } from 'react'

import {
  centerCanvasContent,
  changeBrushSize,
  flipHorizontal,
  flipVertical,
  getContext,
  rotateCanvas
} from '../../helpers/transformCanvas'
import CanvasStore from '../../store/canvas.store'
import ToolsStore from '../../store/tools.store'

const TransformTools = (): JSX.Element => {
  const { horizontalFlip, verticalFlip, setHorizontalFlip, setVerticalFlip } = ToolsStore()
  const { pixelSize, setPixelSize } = CanvasStore()

  return (
    <section className='tools-section'>
      <h3>Transformaciones</h3>

      <div className='tools-section__wrapper center'>
        {[0.5, 1, 2, 3, 4, 3, 2, 1, 0.5].map(size => {
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
          <button
            className={acl(verticalFlip)}
            onClick={() => {
              const { ctx } = getContext()
              flipVertical(ctx)
              setVerticalFlip(!verticalFlip)
            }}
          >
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
          <button
            onClick={() => {
              const { ctx } = getContext()
              console.log('---', pixelSize)

              centerCanvasContent(ctx, pixelSize)
            }}
          >
            <AlignCenterVerticalIcon />
          </button>
        </div>
      </div>
    </section>
  )
}

export default TransformTools
