'use client'

import type { JSX } from 'react'

import AppDraw from './components/AppDraw'
import ColorsTools from './components/ColorsTools'
import Footer from './components/Footer'
import LeftTools from './components/LeftTools'
import RightTools from './components/RightTools'
import './style.scss'

const Page = (): JSX.Element => {
  return (
    <div className='app'>
      <LeftTools className='app-leftTools' />
      <AppDraw className='app-draw' />
      <ColorsTools className='app-colors' />
      <RightTools className='app-rightTools' />
      <Footer className='app-footer' />
    </div>
  )
}

export default Page
