import { JSX, useState } from 'react'

import FilePopup from './FilePopup'
import './style.scss'

const CanvasFile = (): JSX.Element => {
  const [open, setOpen] = useState(false)

  const handleOpenPopup = (isOpen: boolean = !open): void => {
    setOpen(isOpen)
  }

  return (
    <>
      <button className='navTools-link' onClick={() => handleOpenPopup()}>
        Archivo
      </button>
      <FilePopup isOpen={open} setOpen={handleOpenPopup} />
    </>
  )
}

export default CanvasFile
