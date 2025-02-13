import type { JSX } from 'react'

import './style.scss'

const defaultSizes = ['16x16', '32x32', '64x64', '100x100', '128x128', '500x500']
const CanvasFile = (): JSX.Element => {
  return (
    <article className='rightTools-section' id='file'>
      <h5>Archivo</h5>
      <aside className='rightTools-wrapper canvasFile'>
        <form className='canvasFile-new'>
          <div className='canvasFile-new__wrapper'>
            <div className='canvasFile-new__field'>
              <p>Ancho</p>
              <input type='number' name='width' defaultValue='16' max={1000} min={1} />
            </div>
            <div className='canvasFile-new__field'>
              <p>Alto</p>
              <input type='number' name='height' defaultValue='16' max={1000} min={1} />
            </div>

            <div className='canvasFile-new__field'>
              <p>Titulo</p>
              <input type='text' name='title' defaultValue='j-art' />
            </div>
          </div>
          <div className='canvasFile-new__sizes'>
            {defaultSizes.map(size => {
              return (
                <button type='button' key={size}>
                  {size}
                </button>
              )
            })}
          </div>
          <button type='submit' className='canvasFile-new__submit'>
            NUEVO DIBUJO
          </button>
        </form>
      </aside>
    </article>
  )
}

export default CanvasFile
