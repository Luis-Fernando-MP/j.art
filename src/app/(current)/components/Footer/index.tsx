import Link from 'next/link'
import type { JSX } from 'react'

import ThemeController from '../ThemeController'
import './style.scss'

interface IFooter {
  className?: string
}

const Footer = ({ className = '' }: IFooter): JSX.Element => {
  return (
    <footer className={`${className} footer`}>
      <ThemeController />
      <Link href='https://luisjp.vercel.app' target='_blank'>
        <h2 className='footer-title'>J-ART</h2>
      </Link>
      <h5 className='footer-text'>Mas información</h5>
    </footer>
  )
}

export default Footer
