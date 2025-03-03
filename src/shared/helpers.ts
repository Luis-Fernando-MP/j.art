import toast from 'react-hot-toast'

import { BLANK_IMAGE } from './constants'

export const validateImageData = async (imageUrl?: string | null): Promise<string> => {
  if (!imageUrl) return BLANK_IMAGE
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(imageUrl)
    img.onerror = () => resolve(BLANK_IMAGE)
    img.src = imageUrl
  })
}

export function validateTitle(title: string) {
  const toastId = 'validateError'
  const titleRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\-]+$/
  if (typeof title !== 'string' || !titleRegex.test(title)) {
    toast.error('El título solo debe de tener letras, números y -', { id: toastId })
    return
  }

  return true
}

export function validateDimensionsAndTitle(width: number, height: number, title: string) {
  const toastId = 'validateError'
  if (typeof width !== 'number' || width <= 8) {
    toast.error('Ancho mínimo de 8px', { id: toastId })
    return
  }

  if (typeof height !== 'number' || height <= 8) {
    toast.error('Alto mínimo de 8px', { id: toastId })
    return
  }

  return validateTitle(title)
}
