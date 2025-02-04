import Juls from '@/shared/assets/Juls'
import Link from 'next/link'
import type { JSX } from 'react'

import ThemeController from '../ThemeController'
import FooterPosition from './FooterPosition'
import './style.scss'

interface IFooter {
  className?: string
}

const Footer = ({ className = '' }: IFooter): JSX.Element => {
  return (
    <footer className={`${className} footer`}>
      <Link className='footer-logo' href='https://luisjp.vercel.app'>
        <Juls className='footer-logo__icon' />
        <h3>Juls Dev</h3>
      </Link>
      <ThemeController />
      <FooterPosition className='footer-positions' />
    </footer>
  )
}

export default Footer
