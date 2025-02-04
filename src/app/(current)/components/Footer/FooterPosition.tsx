'use client'

import type { JSX } from 'react'

interface IFooterPosition {
  className?: string
}

const FooterPosition = ({ className = '' }: IFooterPosition): JSX.Element => {
  return <p className={`${className}`}>(x: 10; y: 10) | (w: 100; H: 100)</p>
}

export default FooterPosition
