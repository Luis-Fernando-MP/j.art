'use client'

import type { JSX } from 'react'

import LeftTools from './components/LeftTools'
import './style.scss'

const Page = (): JSX.Element => {
  return (
    <div className='app'>
      <header className='app-header'>
        <h5>Juls dev ❤️</h5>
      </header>
      <LeftTools className='app-leftTools' />
      <main className='app-draw'>draw</main>
      <section className='app-colors'>color</section>
      <section className='app-rightTools'>right</section>
    </div>
  )
}

export default Page
