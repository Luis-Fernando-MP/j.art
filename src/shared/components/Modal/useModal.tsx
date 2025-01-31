import { useCallback, useEffect, useRef } from 'react'

export function useModal(isOpen: boolean, onClose: (close: boolean) => void) {
  const modalRef = useRef<HTMLDivElement | null>(null)

  const closeModal = useCallback(() => {
    onClose(false)
  }, [onClose])

  useEffect(() => {
    const modal = modalRef.current
    if (!modal) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    const handleModalClick = (e: MouseEvent) => {
      if (e.target === modal) {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    modal.addEventListener('click', handleModalClick)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      modal.removeEventListener('click', handleModalClick)
    }
  }, [closeModal])

  return { modalRef, closeModal }
}
