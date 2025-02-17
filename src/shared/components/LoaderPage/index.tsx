'use client'

import Logo from '@/shared/assets/Logo'
import React, { useLayoutEffect, useRef, useState } from 'react'

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

  return (
    <section ref={$loaderRef} className='loaderApp' style={{ opacity: loading ? 1 : 0 }}>
      <h2>J-ART</h2>
      <Logo className='loaderApp-logo' />
      <p>By: Juls dev ❤️</p>
    </section>
  )
}

export default LoaderPage
