import { PopupPositions } from '@/shared/components/Popup/usePopup'
import { JSX, MouseEvent, useState } from 'react'

import FilePopup from './FilePopup'
import './style.scss'

const CanvasFile = (): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [positions, setPositions] = useState<PopupPositions>()

  const handleOpenPopup = (isOpen: boolean = !open): void => {
    setOpen(isOpen)
  }

  const handleClick = (e: MouseEvent): void => {
    handleOpenPopup()
    setPositions({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <button className='navTools-link' onClick={handleClick}>
        Archivo
      </button>
      <FilePopup isOpen={open} setOpen={handleOpenPopup} positions={positions} />
    </>
  )
}

export default CanvasFile
