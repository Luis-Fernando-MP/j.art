import { centerCanvasContent, flipHorizontal, flipVertical, getContext, rotateCanvas } from '@/scripts/transformCanvas'
import Range from '@/shared/components/Range'
import {
  AlignCenterVerticalIcon,
  CircleDotDashedIcon,
  CropIcon,
  FlipHorizontal2Icon,
  FlipHorizontalIcon,
  FlipVertical2Icon,
  FlipVerticalIcon,
  Rotate3DIcon,
  RulerIcon
} from 'lucide-react'
import { type JSX, memo } from 'react'

import RepaintDrawingStore from '../../store/repaintDrawing.store'

interface ICanvasToolsComponent {
  currentLayerID: string
}

const CanvasToolsComponent = ({ currentLayerID }: ICanvasToolsComponent): JSX.Element => {
  const { setRepaint } = RepaintDrawingStore()

  const handleHorizontalFlip = (): void => {
    const { ctx } = getContext(currentLayerID)
    flipHorizontal(ctx)
    // setRepaint()
  }

  const handleVerticalFlip = (): void => {
    const { ctx } = getContext(currentLayerID)
    flipVertical(ctx)
    // setRepaint()
  }

  const handleRotate = (): void => {
    const { ctx } = getContext(currentLayerID)
    rotateCanvas(ctx, 90)
    // setRepaint()
  }

  const handleCenterDraw = (): void => {
    const { ctx } = getContext(currentLayerID)
    centerCanvasContent(ctx)
    // setRepaint()
  }

  return (
    <>
      <section className='canvasTools-rowTools'>
        <div className='canvasTools-rowTools__box'>
          <button>Background</button>
          <div className='canvasTools-rowTools__circle'></div>
        </div>
        <div className='canvasTools-rowTools__box active'>
          <button>Rejillas</button>
          <div className='canvasTools-rowTools__circle'></div>
        </div>
      </section>

      <section className='canvasTools-wrapper'>
        <section className='canvasTools-verticalOptions'>
          <div className='canvasTools-verticalOptions__container'>
            <p>Flips</p>
            <div className='canvasTools-verticalOptions__action'>
              <button onClick={handleHorizontalFlip}>
                <FlipHorizontalIcon />
              </button>
              <button onClick={handleVerticalFlip}>
                <FlipVerticalIcon />
              </button>
            </div>
          </div>

          <div className='canvasTools-verticalOptions__container'>
            <p>Rotar</p>
            <div className='canvasTools-verticalOptions__action'>
              <button onClick={handleRotate}>
                <Rotate3DIcon />
              </button>
              <button onClick={handleCenterDraw}>
                <AlignCenterVerticalIcon />
              </button>
            </div>
          </div>

          <div className='canvasTools-verticalOptions__container'>
            <p>Mirror</p>
            <div className='canvasTools-verticalOptions__action'>
              <button>
                <FlipHorizontal2Icon />
              </button>
              <button>
                <FlipVertical2Icon />
              </button>
            </div>
          </div>

          <div className='canvasTools-verticalOptions__container'>
            <p>Crop</p>
            <div className='canvasTools-verticalOptions__action'>
              <button>
                <CropIcon />
              </button>
            </div>
          </div>
        </section>
        <div className='canvasTools-range'>
          <div className='canvasTools-range__container'>
            <p className='canvasTools-range__paragraph'>
              <b>15px</b> pixeles
            </p>
            <Range className='canvasTools-range__controller' rangeValue={10} handleChange={() => {}} />
            <button>
              <RulerIcon />
            </button>
          </div>

          <div className='canvasTools-range__container'>
            <p className='canvasTools-range__paragraph'>
              <b>100%</b> Opacidad
            </p>
            <Range className='canvasTools-range__controller' rangeValue={50} handleChange={() => {}} />
            <button>
              <CircleDotDashedIcon />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default memo(CanvasToolsComponent)
