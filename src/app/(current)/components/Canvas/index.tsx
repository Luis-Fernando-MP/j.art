import Board from '@/shared/components/Board'
import dynamic from 'next/dynamic'
import type { JSX } from 'react'

import './style.scss'

const CanvasComponent = dynamic(() => import('./CanvasComponent'), { ssr: false })

interface ICanvas {
  className?: string
}

const Canvas = ({ className = '' }: ICanvas): JSX.Element => {
  return (
    <section className={`${className} canvas`}>
      <Board>
        {(offset, scale) => {
          return <CanvasComponent offset={offset} scale={scale} />
        }}
      </Board>
    </section>
  )
}

export default Canvas
