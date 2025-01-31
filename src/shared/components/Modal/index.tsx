'use client'

import { XIcon } from 'lucide-react'
import React, { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import './style.scss'
import { useModal } from './useModal'

interface IModal extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode
  isOpen: boolean
  onClose: (close: boolean) => void
}

const Modal = ({ children, className = '', isOpen, onClose, ...props }: IModal) => {
  const [closing, setClosing] = useState(false)
  const { modalRef, closeModal } = useModal(isOpen, () => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose(false)
    }, 300)
  })

  useEffect(() => {
    if (!isOpen) setClosing(false)
  }, [isOpen])

  if (!isOpen && !closing) return null

  const RenderModal = (
    <section ref={modalRef} className={`modal ${closing ? 'closing' : 'active'}`}>
      <button className='modal-closeButton' onClick={closeModal}>
        <XIcon />
      </button>
      <div className={`modal-container ${className}`} {...props}>
        {children}
      </div>
    </section>
  )

  return createPortal(RenderModal, document.body)
}

export default Modal
