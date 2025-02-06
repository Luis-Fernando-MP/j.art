'use client'

import type { JSX } from 'react'

import ZoomBoardController from '../ZoomBoardController'
import './style.scss'

interface IRightTools {
  className?: string
}

const RightTools = ({ className = '' }: IRightTools): JSX.Element => {
  return (
    <section className={`${className} rightTools`}>
      <ZoomBoardController />
      <div id='layers'>layers</div>
    </section>
  )
}

export default RightTools
