'use client'

import type { JSX } from 'react'

import AppDraw from './components/AppDraw'
import ColorsTools from './components/ColorsTools'
import LeftTools from './components/LeftTools'
import RightTools from './components/RightTools'
import './style.scss'

const Page = (): JSX.Element => {
  return (
    <div className='app'>
      <header className='app-header'>
        <h3>Juls dev ❤️</h3>
      </header>
      <LeftTools className='app-leftTools' />
      <AppDraw className='app-draw' />
      <ColorsTools className='app-colors' />
      <RightTools className='app-rightTools' />
    </div>
  )
}

export default Page
