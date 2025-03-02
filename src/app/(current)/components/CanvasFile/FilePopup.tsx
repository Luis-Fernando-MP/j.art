import boardStore from '@/shared/components/Board/board.store'
import Popup from '@/shared/components/Popup'
import { defaultSizes } from '@/shared/constants'
import { ImagePlusIcon, PencilRulerIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, JSX, useCallback, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import CanvasStore from '../../store/canvas.store'
import LayerStore from '../../store/layer.store'
import DimensionsSection from './DimensionsSection'
import DownloadCanvas from './DownloadCanvas'

interface IFilePopup {
  isOpen: boolean
  toggleOpen: () => void
}

const FilePopup = ({ isOpen, toggleOpen }: IFilePopup): JSX.Element => {
  const $formRef = useRef<HTMLFormElement>(null)
  const { dimensions, title, setTitle, setDimensions } = CanvasStore()

  const [tmpDimensions, setTmpDimensions] = useState({
    width: dimensions.width / 15,
    height: dimensions.height / 15
  })

  const { refresh } = useRouter()
  const { moveToChild, setScale } = boardStore()
  const { reset, listOfLayers } = LayerStore()
  const { resetActiveStore, actParentId } = ActiveDrawsStore()

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

    reset()
    resetActiveStore()
    setTitle(title)
    setDimensions({ width, height })
    setScale(1)
    setTimeout(() => moveToChild(0), 50)
    refresh()
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

  return (
    <Popup isOpen={isOpen} onClose={toggleOpen} className='cnFile-popup' title='Archivo'>
      <div className='cnFile-title'>
        <h3>Mi</h3>
        <h2>{title}</h2>
      </div>

      <form className='cnFile-form' onSubmit={handleSubmit} ref={$formRef}>
        <div className='cnFile-form__wrapper'>
          <section className='cnFile-info'>
            <div className='cnFile-info__field'>
              <p>Ancho</p>
              <input
                type='number'
                name='width'
                value={tmpDimensions.width}
                max={1000}
                min={8}
                onChange={e => setTmpDimensions({ ...tmpDimensions, width: Number(e.target.value) })}
              />
            </div>

            <div className='cnFile-info__field'>
              <p>Alto</p>
              <input
                type='number'
                name='height'
                value={tmpDimensions.height}
                max={1000}
                min={8}
                onChange={e => setTmpDimensions({ ...tmpDimensions, height: Number(e.target.value) })}
              />
            </div>

            <div className='cnFile-info__field title'>
              <p>Título</p>
              <input type='text' name='title' defaultValue={title} />
            </div>

            <button type='button' onClick={handleResetForm}>
              reset
            </button>
          </section>

          <DimensionsSection setTmpDimensions={setTmpDimensions} tmpDimensions={tmpDimensions} />
        </div>

        <div className='cnFile-actions'>
          <button type='submit' className='cnFile-action active'>
            <PencilRulerIcon />
            Redimensionar
          </button>

          <button type='button' data-ignore-click className='cnFile-action' onClick={handleNewDraw}>
            <ImagePlusIcon />
            Crear
          </button>
        </div>
      </form>

      <DownloadCanvas />
    </Popup>
  )
}

export default FilePopup

export function getSize(key: keyof typeof defaultSizes) {
  const [w, h] = defaultSizes[key].split('x').map(Number)
  return { w: w * 15, h: h * 15 }
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

  const titleRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\-]+$/
  if (typeof title !== 'string' || !titleRegex.test(title)) {
    toast.error('El título solo debe de tener letras, números y -', { id: toastId })
    return
  }

  return true
}
