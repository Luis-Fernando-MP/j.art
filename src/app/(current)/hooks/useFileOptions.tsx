import boardStore from '@/shared/components/Board/board.store'
import { defaultSizes } from '@/shared/constants'
import { validateDimensionsAndTitle } from '@/shared/helpers'
import { useRouter } from 'next/navigation'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'

import ActiveDrawsStore from '../store/ActiveDraws.store'
import CanvasStore from '../store/canvas.store'
import LayerStore from '../store/layer.store'

const useFileOptions = () => {
  const { dimensions, title, setTitle, setDimensions } = CanvasStore()
  const { resetActiveStore, actParentId } = ActiveDrawsStore()
  const { moveToChild, setScale } = boardStore()
  const { reset, listOfLayers } = LayerStore()
  const { refresh } = useRouter()
  const [tmpDimensions, setTmpDimensions] = useState({ width: 0, height: 0 })
  const $formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    setTmpDimensions({
      width: dimensions.width / 15,
      height: dimensions.height / 15
    })
  }, [dimensions])

  const getFormData = useCallback(() => {
    const $form = $formRef.current
    if (!$form) return
    const formDt = new FormData($form)
    const title = (formDt.get('title') as string) || 'j-art'
    const width = Number(formDt.get('width'))
    const height = Number(formDt.get('height'))
    const validateData = validateDimensionsAndTitle(width, height, title)
    if (!validateData) return

    return { title, width: width * 15, height: height * 15 }
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const data = getFormData()
    if (!data) return
    const parentIndex = Object.keys(listOfLayers).findIndex(l => l === actParentId)
    const { width, height, title } = data
    setTitle(title)
    setDimensions({ width, height })
    setScale(1)
    setTimeout(() => moveToChild(parentIndex), 50)
  }

  const handleNewDraw = (): void => {
    const data = getFormData()
    if (!data) return
    const { width, height, title } = data
    const validateData = validateDimensionsAndTitle(width, height, title)
    if (!validateData) return
    const userConfirm = confirm('El dibujo actual sera borrado y creara uno nuevo, ¿Esta de acuerdo?')
    if (!userConfirm) return
    reset()
    resetActiveStore()
    setTitle(title)
    setDimensions({ width, height })
    setScale(1)
    refresh()
    setTimeout(() => moveToChild(0), 50)
  }

  const handleResetForm = (): void => {
    const $form = $formRef.current
    if ($form) $form.reset()
    if (dimensions.width === tmpDimensions.width && dimensions.height === tmpDimensions.height) return
    setTmpDimensions({
      height: dimensions.height / 15,
      width: dimensions.width / 15
    })
  }

  return { title, handleSubmit, $formRef, tmpDimensions, setTmpDimensions, handleResetForm, handleNewDraw }
}

export default useFileOptions

export function getSize(key: keyof typeof defaultSizes) {
  const [w, h] = defaultSizes[key].split('x').map(Number)
  return { w: w * 15, h: h * 15 }
}
