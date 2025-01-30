'use client'

import type { JSX } from 'react'

import Canvas from './components/Canvas'
import Tools from './components/Tools'
import './style.scss'

const Page = (): JSX.Element => {
  return (
    <main className='app'>
      <div className='app-gradient' id='gradient' />
      <Tools className='app-tools' />
      <section className='app-canvas' id='canvasContainer'>
        <Canvas className='app-canvas__wrapper' />
      </section>
      <section className='app-layers'></section>
    </main>
  )
}

export default Page
