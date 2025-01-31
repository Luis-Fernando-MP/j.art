import dynamic from 'next/dynamic'
import type { JSX } from 'react'

import DimensionsTools from '../DimensionsTools'
import UtilsToolsSkeleton from '../UtilsTools/UtilsToolsSkeleton'
import './style.scss'

interface IRightTools {
  className?: string
}

const UtilsTools = dynamic(() => import('../UtilsTools'), {
  ssr: false,
  loading() {
    return <UtilsToolsSkeleton />
  }
})

const RightTools = ({ className = '' }: IRightTools): JSX.Element => {
  return (
    <section className={`${className} rightTools`}>
      <section className='rightTools-navigation'>
        <h5>Navegación</h5>
        <div className='rightTools-navigation__temporal'></div>
      </section>
      <UtilsTools />
      <DimensionsTools />
      <section className='rightTools-gallery'>
        <h5>Galería</h5>
      </section>
    </section>
  )
}

export default RightTools
