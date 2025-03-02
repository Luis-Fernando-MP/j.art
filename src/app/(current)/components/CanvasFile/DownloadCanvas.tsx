import { getBitmapFromParentCanvas } from '@/shared/bitmap'
import Range from '@/shared/components/Range'
import { socialSizes } from '@/shared/constants'
import { handleWorkerMessage } from '@/shared/handleWorkerMessage'
import { drawToGif, frameToPng, toFileArt } from '@/shared/imageDownloader'
import { EDowImageWk } from '@workers/downloadImage'
import { FileBoxIcon, GiftIcon, ImageIcon } from 'lucide-react'
import { type JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import CanvasStore from '../../store/canvas.store'
import LayerStore from '../../store/layer.store'

const MAX_SCALE = 2000

const DownloadCanvas = (): JSX.Element => {
  const { dimensions, title, setDimensions, setTitle } = CanvasStore()
  const [factorScale, setFactorScale] = useState(1)
  const { actLayerId, actParentId, actParentIndex, setActParentId, setActLayerId, setActParentIndex } = ActiveDrawsStore()
  const { listOfLayers, setListOfLayers } = LayerStore()

  const imageWorker = useRef<Worker | null>(null)

  const width = dimensions.width / 15
  const height = dimensions.height / 15
  const average = (width + height) / 2
  const limitScale = useMemo(() => Math.floor(MAX_SCALE / average), [average])

  useEffect(() => {
    imageWorker.current = new Worker('/workers/downloadImage.js', { type: 'module' })
    return () => {
      imageWorker.current?.terminate()
    }
  }, [])

  useEffect(() => {
    const newScale = Math.min(factorScale, limitScale)
    setFactorScale(newScale)
  }, [dimensions, limitScale, factorScale])

  const handleDownloadPng = useCallback(async (): Promise<void> => {
    if (!imageWorker.current) return

    frameToPng({
      frameId: actParentId,
      width: width,
      height: height,
      title,
      scale: factorScale,
      worker: imageWorker.current
    })
  }, [actParentId, width, height, title, factorScale])

  const handleDownloadFile = useCallback((): void => {
    toFileArt({
      frameId: actParentId,
      width: width,
      height: height,
      title,
      listOfLayers,
      actFrameId: actParentId,
      actFrameIndex: actParentIndex,
      actLayerId
    })
  }, [actParentId, width, height, title, listOfLayers, actParentIndex, actLayerId, factorScale])

  const handleDownloadGif = useCallback((): void => {
    drawToGif({
      width: width,
      height: height,
      title,
      listOfLayers,
      scale: factorScale
    })
  }, [width, height, title, listOfLayers, factorScale])

  const handleScaleChange = useCallback(
    (newScale: number) => {
      setFactorScale(Math.min(newScale, limitScale))
    },
    [limitScale]
  )

  const handleSocialSizeClick = useCallback(
    (size: { width: number; height: number }) => {
      const scaleWidth = size.width / width
      const scaleHeight = size.height / height
      const newScale = Math.min(scaleWidth, scaleHeight, limitScale)
      setFactorScale(newScale)
    },
    [width, height, limitScale]
  )
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      try {
        const content = e.target?.result as string
        const artData = JSON.parse(content)
        const $viewerFrame = document.getElementById('viewer-frame')
        if (!($viewerFrame instanceof HTMLImageElement)) return

        $viewerFrame.src = artData.preview

        setActParentId(artData.actFrameId)
        setActLayerId(artData.actLayerId)
        setActParentIndex(artData.actFrameIndex)

        setDimensions({
          width: artData.width * 15,
          height: artData.height * 15
        })

        setTitle(artData.title)

        const newList: any = {}
        for (const frame of artData.frames) {
          newList[frame.id] = frame.layers.map((layer: any) => {
            return {
              id: layer.id,
              title: layer.title,
              parentId: layer.parentId,
              imageUrl: layer.imageUrl,
              isWatching: layer.isWatching,
              opacity: layer.filters.opacity,
              hue: layer.filters.hue
            }
          })

          setTimeout(() => {
            frame.layers.forEach((layer: any) => {
              const $canvas = document.getElementById(layer.id) as HTMLCanvasElement
              if (!$canvas) return

              const ctx = $canvas.getContext('2d')
              if (!ctx) return

              const image = new Image()
              image.src = layer.imageUrl // Asumiendo que imageUrl es una URL en base64
              image.onload = () => {
                ctx.globalAlpha = layer.filters.opacity || 1
                ctx.drawImage(image, 0, 0, $canvas.width, $canvas.height)
              }
            })
          }, 100)
        }
        console.log(newList)
        setListOfLayers(newList)
      } catch (error) {
        toast.error('Error al cargar el archivo .art')
      }
    }
    reader.readAsText(file)
  }, [])

  return (
    <section className='cnFile-scale'>
      <h3>ESCALADO</h3>
      <div className='cnFile-dimensions__wrapper'>
        {Object.entries(socialSizes).map(([key, size]) => (
          <button type='button' key={key} className='cnFile-option' onClick={() => handleSocialSizeClick(size)}>
            {key}
            <span>
              {size.width}x{size.height}
            </span>
          </button>
        ))}
      </div>

      <div className='cnFile-range'>
        <p>x1</p>
        <Range min={1} max={limitScale} rangeValue={factorScale} handleChange={handleScaleChange} typeRange='horizontal' />
        <p>x{limitScale}</p>
      </div>

      <div className='cnFile-actions'>
        <button type='button' className='cnFile-action active' onClick={handleDownloadPng}>
          <ImageIcon />
          Descargar <span>.png</span>
        </button>
        <button type='button' className='cnFile-action' onClick={handleDownloadFile}>
          <FileBoxIcon />
          Descargar <span>.art</span>
        </button>
        <button type='button' className='cnFile-action' onClick={handleDownloadGif}>
          <GiftIcon />
          Descargar <span>.gif</span>
        </button>
      </div>

      <div className='cnFile-finalInfo'>
        <h4>DIMENSIONES FINALES</h4>
        <h5>
          Ancho: {Math.round(width * factorScale)} x{factorScale}
        </h5>
        <h5>
          Alto: {Math.round(height * factorScale)} x{factorScale}
        </h5>
      </div>

      <div className='cnFile-finalInfo'>
        <h4>CARGAR ARCHIVO .art</h4>
        <input type='file' accept='.art' onChange={handleFileUpload} />
      </div>
    </section>
  )
}

export default DownloadCanvas
