import { type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import './style.scss'
import usePopup, { PopupPositions } from './usePopup'

interface IPopup extends React.HTMLAttributes<HTMLElement> {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
  isOpen: boolean
  title?: string
  clickPosition?: PopupPositions
  onClose: () => void
}

const middleH = document.body.getBoundingClientRect().height / 2 - 100
const middleW = document.body.getBoundingClientRect().width / 2 - 100

const PopupComponent = ({
  children,
  className = '',
  isOpen,
  onClose,
  title,
  clickPosition = { x: middleW, y: middleH },
  ...props
}: IPopup) => {
  const { $popupRef, handleMouseDown, isDragging, position } = usePopup({ isOpen, clickPosition })

  if (!isOpen) return null

  const RenderPopup = (
    <article
      ref={$popupRef}
      className='popup'
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div className={`popup-container ${className}`} {...props}>
        {children}
      </div>
      <header
        role='button'
        tabIndex={0}
        className='popup-header'
        onMouseDown={handleMouseDown}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <button className='popup-closeButton' onClick={onClose} />
        <p>{title}</p>
      </header>
    </article>
  )

  return createPortal(RenderPopup, document.body)
}

export default PopupComponent
