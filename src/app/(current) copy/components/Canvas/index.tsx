import Juls from '@/shared/assets/Juls'
import dynamic from 'next/dynamic'
import { type JSX } from 'react'

import './style.scss'

const CanvasDraw = dynamic(() => import('./CanvasDraw'), {
  ssr: false,
  loading() {
    return <div className='canvas-background loader' />
  }
})

interface ICanvas {
  className?: string
}

const Canvas = ({ className = '' }: ICanvas): JSX.Element => {
  return (
    <section className={`${className} canvas`}>
      <CanvasDraw />
    </section>
  )
}

export default Canvas
