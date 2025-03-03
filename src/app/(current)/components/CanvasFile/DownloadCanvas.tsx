import Range from '@/shared/components/Range'
import { socialSizes } from '@/shared/constants'
import { drawToGif, frameToPng, toFileArt } from '@/shared/imageDownloader'
import { FileBoxIcon, GiftIcon, ImageIcon } from 'lucide-react'
import { type JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import CanvasStore from '../../store/canvas.store'
import LayerStore from '../../store/layer.store'

const MAX_SCALE = 2000

const DownloadCanvas = (): JSX.Element => {
  const { dimensions, title } = CanvasStore()
  const [factorScale, setFactorScale] = useState(1)
  const { actLayerId, actParentId, actParentIndex } = ActiveDrawsStore()
  const { listOfLayers } = LayerStore()

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
          Descargar <span className='cnFile-extension'>.png</span>
        </button>
        <button type='button' className='cnFile-action' onClick={handleDownloadFile}>
          <FileBoxIcon />
          Descargar <span className='cnFile-extension'>.art</span>
        </button>
        <button type='button' className='cnFile-action' onClick={handleDownloadGif}>
          <GiftIcon />
          Descargar <span className='cnFile-extension'>.gif</span>
        </button>
      </div>

      <div className='cnFile-finalInfo'>
        <h4>DIMENSIONES FINALES</h4>
        <h5>
          Ancho: {Math.round(width * factorScale)} x{Math.round(factorScale)}
        </h5>
        <h5>
          Alto: {Math.round(height * factorScale)} x{Math.round(factorScale)}
        </h5>
      </div>
    </section>
  )
}

export default DownloadCanvas
