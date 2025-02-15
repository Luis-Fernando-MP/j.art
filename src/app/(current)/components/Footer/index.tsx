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
      <Link className='footer-logo' href='https://luisjp.vercel.app' target='_blank'>
        <p>Juls Dev</p>
      </Link>
      <ThemeController />
    </footer>
  )
}

export default Footer
