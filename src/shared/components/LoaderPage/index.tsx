'use client'

import Logo from '@/shared/assets/Logo'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import './style.scss'

const LoaderPage = () => {
  const [loading, setLoading] = useState(true)
  const $loaderRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  if (!loading) return null

  const RenderLoader = (
    <section ref={$loaderRef} className='loaderApp'>
      <Logo />
    </section>
  )

  return createPortal(RenderLoader, document.body)
}

export default LoaderPage
