'use client'

import Popup from '@/shared/components/Popup'
import { type JSX, useState } from 'react'

import { dimensions } from './dimensions'
import './style.scss'

const DimensionsTools = (): JSX.Element => {
  const [modal, setModal] = useState(false)
  return (
    <section className='dimensionsTools'>
      <h5>Dimensiones</h5>
      dimensions
      <div className='dimensionsTools-list'>
        {Object.entries(dimensions).map(dim => {
          const [name, xy] = dim
          return (
            <button
              className='dimensionsTools-action'
              key={name}
              onClick={() => {
                console.log(xy)
              }}
            >
              {name}
            </button>
          )
        })}
        <button
          className='dimensionsTools-action'
          onClick={() => {
            setModal(true)
          }}
        >
          Nuevo
        </button>
      </div>
      <Popup isOpen={modal} onClose={() => setModal(false)} title='Nueva dimension'>
        <h5>Width:</h5>
        <input type='text' placeholder='16' />
        <h5>height:</h5>
        <input type='text' placeholder='16' />
        <button>Aplicar</button>
      </Popup>
    </section>
  )
}

export default DimensionsTools
