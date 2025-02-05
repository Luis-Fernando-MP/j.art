'use client'

import dynamic from 'next/dynamic'
import { type JSX } from 'react'

import BoardColors from '../BoardColors'
import BoardFrames from '../BoardFrames'
import './style.scss'

interface IAppDraw {
  className?: string
}

const BoardCanvas = dynamic(() => import('../BoardCanvas'), {
  ssr: false
})

const AppDraw = ({ className = '' }: IAppDraw): JSX.Element => {
  return (
    <main className={`${className} appDraw`}>
      <BoardColors />
      <BoardCanvas />
      <BoardFrames />
    </main>
  )
}

export default AppDraw
