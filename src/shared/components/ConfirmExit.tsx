'use client'

import { useEffect } from 'react'

const ConfirmExit = () => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = 'Asegúrate de guardar tus cambios antes de salir del sitio web'
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return null
}

export default ConfirmExit
