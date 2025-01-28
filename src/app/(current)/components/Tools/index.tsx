import Image from 'next/image'
import type { JSX } from 'react'

import ToolsComponent from './ToolsComponent'
import './style.scss'

interface ITools {
  className?: string
}

const Tools = ({ className = '' }: ITools): JSX.Element => {
  return (
    <div className={`${className} tools`}>
      <div className='tools-logo'>
        <Image src='/logo.svg' alt='j-art' width={30} height={30} />
        <h1>J-ART</h1>
      </div>
      <section className='tools-list'>
        <ToolsComponent />
      </section>
    </div>
  )
}

export default Tools
