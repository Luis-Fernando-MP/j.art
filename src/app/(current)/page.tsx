'use client'

import dynamic from 'next/dynamic'
import type { JSX } from 'react'

import AppDraw from './components/AppDraw'
import Footer from './components/Footer'
import LeftTools from './components/LeftTools'
import NavTools from './components/NavTools'
import RightTools from './components/RightTools'
import './style.scss'

const ClickSpark = dynamic(() => import('@/shared/components/ClickSpark'), {
  ssr: false
})

const Page = (): JSX.Element => {
  return (
    <div className='app'>
      <LeftTools className='app-leftTools' />
      <AppDraw className='app-draw' />
      <RightTools className='app-rightTools' />
      <NavTools className='app-navTools' />
      <Footer className='app-footer' />
      <ClickSpark sparkColor='rgb(var(--tn-primary))' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400} />
    </div>
  )
}

export default Page
