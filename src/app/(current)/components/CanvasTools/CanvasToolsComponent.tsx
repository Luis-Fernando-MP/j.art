import Range from '@/shared/components/Range'
import { CircleDotDashedIcon, RulerIcon } from 'lucide-react'
import { type JSX, memo } from 'react'

import BackgroundStyleTools from '../BackgroundStyleTools'
import UtilityTools from './UtilityTools'

const CanvasToolsComponent = (): JSX.Element => {
  return (
    <>
      <BackgroundStyleTools />

      <section className='canvasTools-wrapper'>
        <UtilityTools />

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
