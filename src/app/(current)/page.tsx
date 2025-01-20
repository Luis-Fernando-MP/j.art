'use client'

import type { JSX } from 'react'

import Tools from './components/Tools'
import './style.scss'

const Page = (): JSX.Element => {
  return (
    <main className='app'>
      <div className='app-gradient' id='gradient' />
      <section className='app-tools'>
        <Tools />
      </section>
      <section className='app-canvas'>
        <div className='app-canvas__wrapper'>
          <canvas />
        </div>
      </section>
    </main>
  )
}

export default Page
