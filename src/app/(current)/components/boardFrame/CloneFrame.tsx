import { getContext } from '@/scripts/transformCanvas'
import { getBitmapFromParentCanvas } from '@/shared/bitmap'
import { newKey } from '@/shared/key'
import { EWorkerActions, WorkerMessage } from '@workers/layer-view'
import { Layers2Icon } from 'lucide-react'
import { type JSX, type MouseEvent, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { ISelectAndMoveFrame } from '.'
import LayerStore, { Layer, MAX_LAYERS, setLayer } from '../../store/layer.store'
import RepaintDrawingStore from '../../store/repaintDrawing.store'

interface ICloneFrame {
  parentKey: string
  onClone: (_: ISelectAndMoveFrame) => void
}

const CloneFrame = ({ parentKey, onClone }: ICloneFrame): JSX.Element => {
  const { listOfLayers, setListOfLayers } = LayerStore()
  const cloneWorker = useRef<Worker | null>(null)
  const [noRender] = useState(null)
  const { setRepaint } = RepaintDrawingStore()

  useEffect(() => {
    if (cloneWorker.current && !noRender) return
    cloneWorker.current = new Worker(/* turbopackIgnore: true */ '/workers/layer-view.js', { type: 'module' })
    return () => {
      cloneWorker.current = null
    }
  }, [noRender])

  const handleCloneLayer = async (e: MouseEvent) => {
    if (e.ctrlKey || !cloneWorker.current) return
    const cloneLayers = structuredClone(listOfLayers)
    const currentLayer = cloneLayers[parentKey]
    if (!currentLayer) return toast.error('❗️El frame seleccionado no existe')
    if (Object.keys(cloneLayers).length + 1 > MAX_LAYERS) return toast.error('🔥 Hay muchos frames no lo crees')

    const frameId = newKey()
    const layerId = newKey()

    const updatedList = Object.entries(cloneLayers)
    const parentIndex = updatedList.findIndex(([p]) => p === parentKey)

    const newFrame: [string, Layer[]] = [frameId, [setLayer({ id: layerId, parentId: frameId })]]
    updatedList.splice(parentIndex + 1, 0, newFrame)
    setListOfLayers(Object.fromEntries(updatedList))

    try {
      const listOfBitmaps = await getBitmapFromParentCanvas(parentKey)
      if (!listOfBitmaps) throw new Error('fail to load canvas bitmap')
      const message: WorkerMessage = { imagesBitmap: listOfBitmaps, action: EWorkerActions.GENERATE_FULL_VIEW }

      cloneWorker.current.postMessage(message, listOfBitmaps)
      cloneWorker.current.onmessage = event => {
        const { mergedBitmap } = event.data
        if (!mergedBitmap) return toast.error('😟 Algo a salido mal')
        setTimeout(() => {
          const currentCanvas = getContext(layerId)
          if (!currentCanvas) return
          const { ctx } = currentCanvas
          ctx.drawImage(mergedBitmap, 0, 0)
          onClone({ frameId, layerId, parentIndex: parentIndex + 1 })
          setRepaint('all')
        }, 50)
        toast.success('👁️ Clonado')
      }
      cloneWorker.current.onerror = error => {
        console.error('Worker Error:', error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <button className='boardFrame-control' onClick={handleCloneLayer}>
      <Layers2Icon />
    </button>
  )
}

export default CloneFrame
