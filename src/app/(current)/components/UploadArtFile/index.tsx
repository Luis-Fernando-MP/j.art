import boardStore from '@/shared/components/Board/board.store'
import { BLANK_IMAGE, validateCopyrightData } from '@/shared/constants'
import { validateImageData } from '@/shared/helpers'
import { CloudUploadIcon } from 'lucide-react'
import { ChangeEvent, type JSX, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import CanvasStore from '../../store/canvas.store'
import LayerStore, { DEFAULT_LAYER_ID, DEFAULT_LIST, DEFAULT_PARENT_ID, Layer, setLayer } from '../../store/layer.store'
import RepaintDrawingStore from '../../store/repaintDrawing.store'
import { ArtData, LayerFile } from '../CanvasFile/artFile.type'
import './style.scss'

interface IUploadArtFile {
  closePopup: () => void
}

const UploadArtFile = ({ closePopup }: IUploadArtFile): JSX.Element => {
  const { setDimensions, setTitle } = CanvasStore()
  const { setActParentId, setActLayerId, setActParentIndex } = ActiveDrawsStore()
  const { setListOfLayers } = LayerStore()
  const { setRepaint } = RepaintDrawingStore()
  const { moveToChild, setScale } = boardStore()

  const setDefaultFrames = useCallback(() => {
    setListOfLayers(DEFAULT_LIST)
    setActParentId(DEFAULT_PARENT_ID)
    setActLayerId(DEFAULT_LAYER_ID)
    setActParentIndex(0)
    setScale(1)
    closePopup()
    setTimeout(() => {
      const canvas = document.getElementById(DEFAULT_LAYER_ID)
      if (canvas instanceof HTMLCanvasElement) {
        canvas.removeAttribute('style')
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        moveToChild(0)
        setRepaint('all')
      }
    }, 50)
    return toast.success('El archivo no cuenta con frames disponibles, se creará un frame por defecto', { icon: '🔍' })
  }, [closePopup, moveToChild, setActLayerId, setActParentId, setActParentIndex, setListOfLayers, setRepaint, setScale])

  const handleLoadFile = useCallback(
    async (content: string) => {
      try {
        const artData: ArtData = JSON.parse(content)
        const validMainData = validateCopyrightData(artData)
        if (!validMainData) return

        const { frames, width, height, title } = artData

        if (!Array.isArray(frames) || typeof width !== 'number' || typeof height !== 'number' || typeof title !== 'string') {
          return toast.error('El archivo es inválido')
        }

        setDimensions({ width: width * 15, height: height * 15 })
        setTitle(title)
        if (frames.length < 1) return setDefaultFrames()

        const newList: { [key: string]: Layer[] } = {}
        for (const frame of frames) {
          let processedLayers = await Promise.all(frame.layers.map(processLayer))
          if (processedLayers.length < 1) processedLayers = [setLayer({ parentId: frame.id }) as any]
          newList[frame.id] = processedLayers
        }

        let { actFrameId, actLayerId, actFrameIndex } = artData
        const actFrameInList = frames.findIndex(f => f.id === actFrameId)
        if (actFrameInList < 0 || actFrameInList !== actFrameIndex) {
          actFrameIndex = 0
          actFrameId = frames[0]?.id
        }

        const layersList = newList[actFrameId]
        const actLayerInList = layersList.findIndex(l => l.id === actLayerId)
        if (actLayerInList < 0 && layersList.length > 0) {
          actLayerId = layersList[0].id
        }

        setListOfLayers(newList)
        setActParentId(actFrameId)
        setActLayerId(actLayerId)
        setActParentIndex(actFrameIndex)
        setScale(1)
        closePopup()

        setTimeout(() => {
          for (const frame of frames) {
            frame.layers.forEach(drawLayerOnCanvas)
          }
          moveToChild(actFrameIndex)
        }, 100)
        setTimeout(() => {
          console.log('repaint')
          setRepaint('all')
        }, 1000)
      } catch (error) {
        toast.error('Verifica el contenido de tu archivo .art')
        console.log(error)
      }
    },
    [
      moveToChild,
      setRepaint,
      setDimensions,
      setTitle,
      setListOfLayers,
      setActParentId,
      setActLayerId,
      setActParentIndex,
      setScale,
      closePopup,
      setDefaultFrames
    ]
  )

  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target) return
      const file = e.target.files?.[0]
      e.target.value = ''
      if (!file) return toast.error('El archivo no es valido')
      if (!file.name.endsWith('.art')) return toast.error('Asegúrese de subir un archivo.art')
      const reader = new FileReader()
      reader.onload = async e => {
        const content = e.target?.result as string
        await handleLoadFile(content)
      }
      reader.onerror = () => toast.error('No se pudimos leer tu archivo')
      reader.readAsText(file)
    },
    [handleLoadFile]
  )

  const fileInputId = useMemo(() => 'fileUpload', [])

  return (
    <section className='uploadFile'>
      <h3>
        CARGAR ARCHIVO <span className='cnFile-extension'>.art</span>
      </h3>
      <p className='uploadFile-info'>
        La información de tu archivo .art se cargará de inmediato. Asegúrate de guardar tu dibujo actual antes de proceder.
      </p>
      <label htmlFor={fileInputId} className='uploadFile-label active'>
        <CloudUploadIcon /> Cargar archivo .art
      </label>
      <input id={fileInputId} type='file' accept='.art' onChange={handleFileUpload} className='uploadFile-input' />
    </section>
  )
}

export default UploadArtFile

async function processLayer(layer: LayerFile) {
  const { id, canvasUrl, imageUrl, isWatching, parentId, title, filters } = layer
  if (!id || !canvasUrl || !imageUrl || !isWatching || !parentId || !title) throw new Error('invalid layer props')
  const validatedImageUrl = await validateImageData(imageUrl)
  return {
    id,
    title,
    parentId,
    imageUrl: validatedImageUrl,
    isWatching,
    opacity: filters?.opacity ?? 100,
    hue: filters?.hue ?? 0
  }
}

function drawLayerOnCanvas(layer: LayerFile) {
  const $canvas = document.getElementById(layer.id) as HTMLCanvasElement
  if (!$canvas) return

  const ctx = $canvas.getContext('2d')
  if (!ctx) return

  const image = new Image()
  image.src = layer.canvasUrl ?? BLANK_IMAGE
  const { hue, opacity } = layer.filters
  const invalidOpacity = isNaN(Number(opacity))
  $canvas.style.opacity = invalidOpacity ? '100%' : `${opacity}%`
  $canvas.style.filter = `hue-rotate(${hue}deg)`
  image.onload = () => ctx.drawImage(image, 0, 0, $canvas.width, $canvas.height)
  image.onerror = e => console.log(e)
}
