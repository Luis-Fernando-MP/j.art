'use client'

import { JSX } from 'react'
import { AestheticFluidBg } from 'react-color4bg'

// const Gradient = dynamic(() => import('./components/Gradient'), {
//   ssr: false
// })

const Gradient = (): JSX.Element => {
  return (
    <div className='app-gradient' id='gradient'>
      <AestheticFluidBg
        style={{ width: '100%', height: '100%' }}
        colors={['#000', '#230638', '#050915', '#000']}
        // seed={0}
        // noise={0}
        loop
      />
    </div>
  )
}

export default Gradient
