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
import type { JSX } from 'react'

import './style.scss'

const CanvasTools = (): JSX.Element => {
  return (
    <article className='rightTools-section' id='tools'>
      <h5>Herramientas</h5>
      <aside className='rightTools-wrapper canvasTools'>
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
                <button>
                  <FlipHorizontalIcon />
                </button>
                <button>
                  <FlipVerticalIcon />
                </button>
              </div>
            </div>

            <div className='canvasTools-verticalOptions__container'>
              <p>Rotar</p>
              <div className='canvasTools-verticalOptions__action'>
                <button>
                  <Rotate3DIcon />
                </button>
                <button>
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
      </aside>
    </article>
  )
}

export default CanvasTools
