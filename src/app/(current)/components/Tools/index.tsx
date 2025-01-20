import Image from 'next/image'
import type { JSX } from 'react'

import './style.scss'

const Tools = (): JSX.Element => {
  return (
    <div className='app-tools__wrapper tools'>
      <div className='tools-logo'>
        <Image src='/logo.svg' alt='j-art' width={30} height={30} />
        <h1>J-ART</h1>
      </div>
      <section className='tools-section'>tr</section>
    </div>
  )
}

export default Tools
