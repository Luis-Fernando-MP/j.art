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

const PopupComponent = ({
  children,
  className = '',
  isOpen,
  onClose,
  title,
  clickPosition = { x: 0, y: 0 },
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
        top: `${position.y}px`,
        opacity: isOpen ? 1 : 0
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
