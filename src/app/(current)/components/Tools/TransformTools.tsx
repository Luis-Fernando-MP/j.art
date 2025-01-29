import { acl } from '@/shared/acl'
import CanvasStore from '@home-store/canvas.store'
import ToolsStore from '@home-store/tools.store'
import {
  centerCanvasContent,
  changeBrushSize,
  flipHorizontal,
  flipVertical,
  getContext,
  rotateCanvas
} from '@scripts/transformCanvas'
import { AlignCenterVerticalIcon, FlipHorizontalIcon, FlipVerticalIcon, Rotate3DIcon } from 'lucide-react'
import type { JSX } from 'react'

const TransformTools = (): JSX.Element => {
  const { horizontalFlip, verticalFlip, setHorizontalFlip, setVerticalFlip } = ToolsStore()
  const { pixelSize, setPixelSize } = CanvasStore()

  return (
    <section className='tools-section'>
      <h3 className='tools-title'>Transformaciones</h3>

      <div className='tools-brush'>
        {[8, 4, 2, 1, 0.5].map((size, i) => {
          const key = `${size}-${Math.random()}-brush`
          const boxSize = 15 * size
          return (
            <button
              key={key}
              className={`tools-brush__option ${acl(boxSize === pixelSize)}`}
              onClick={() => {
                changeBrushSize(boxSize)
                setPixelSize(boxSize)
              }}
              style={{
                width: `${boxSize * 0.3 * (i + 1)}px`,
                height: `${boxSize * 0.2 * (i + 1.5)}px`,
                borderRadius: `${size * (i + 0.5)}px`
              }}
            />
          )
        })}
      </div>

      <div className='tools-group'>
        <p className='tools-group__title'>Flips</p>
        <div className='tools-group__options'>
          <button
            className={`tools-options__normal ${acl(horizontalFlip)}`}
            onClick={() => {
              const { ctx } = getContext()
              flipHorizontal(ctx)
              setHorizontalFlip(!horizontalFlip)
            }}
          >
            <FlipHorizontalIcon />
          </button>
          <button
            className={`${acl(verticalFlip)} tools-options__normal`}
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

      <div className='tools-group'>
        <p className='tools-group__title'>Rotación</p>
        <div className='tools-group__options'>
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
