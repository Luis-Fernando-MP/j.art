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
    }, 300)
  }, [])

  if (!loading) return null

  return (
    <section ref={$loaderRef} className='loaderApp' style={{ opacity: loading ? 1 : 0 }}>
      <Logo className='loaderApp-logo' />
    </section>
  )
}

export default LoaderPage
