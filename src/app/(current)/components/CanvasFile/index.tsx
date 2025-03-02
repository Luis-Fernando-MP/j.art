import { JSX, useState } from 'react'

import FilePopup from './FilePopup'
import './style.scss'

const CanvasFile = (): JSX.Element => {
  const [open, setOpen] = useState(false)

  const handleToggleOpen = (): void => {
    setOpen(!open)
  }

  return (
    <>
      <button className='navTools-link' onClick={() => handleToggleOpen()}>
        Archivo
      </button>
      <FilePopup isOpen={open} toggleOpen={handleToggleOpen} />
    </>
  )
}

export default CanvasFile
