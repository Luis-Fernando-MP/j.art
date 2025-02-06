'use client'

import { acl } from '@/shared/acl'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { JSX } from 'react'

import './style.scss'

interface INavTools {
  className?: string
}

const NavTools = ({ className = '' }: INavTools): JSX.Element => {
  const [activeHash, setActiveHash] = useState<string>('#layers')

  const links = [
    { href: '#layers', label: 'Capas' },
    { href: '#filters', label: 'Filtros' },
    { href: '#tools', label: 'Herramientas' },
    { href: '#file', label: 'Archivo' }
  ]

  useEffect(() => {
    if (!window) return
    let hash = window.location.hash
    if (hash.length < 1) hash = '#layers'
    setActiveHash(hash)
  }, [])

  return (
    <nav className={`${className} navTools`}>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`navTools-link ${acl(activeHash === href)}`}
          onClick={() => {
            setActiveHash(href)
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

export default NavTools
