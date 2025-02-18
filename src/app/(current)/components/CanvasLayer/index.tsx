import { acl } from '@/shared/acl'
import { Image } from '@unpic/react'
import { JSX, memo } from 'react'

import LayerStore, { Layer } from '../../store/layer.store'
import CanvasSeeMode from './CanvasSeeMode'
import LayerTitle from './LayerTitle'
import OpacityCanvasMode from './OpacityCanvasMode'
import './style.scss'

interface ICanvasLayer {
  layer: Layer
  isActive: boolean
  handleActive: (id: string) => void
}

const CanvasLayer = ({ layer, isActive, handleActive }: ICanvasLayer): JSX.Element => {
  const { imageUrl, title, id, parentId, isWatching, opacity } = layer
  const { updateLayer } = LayerStore()

  const handleClick = (): void => {
    if (isActive) return
    handleActive(id)
  }

  const handleTitleChange = (value: string): void => {
    updateLayer({
      parentId,
      layer: { id, title: value }
    })
  }

  const handleOpacityChange = (alpha: number): void => {
    updateLayer({
      parentId,
      layer: { id, opacity: alpha }
    })
  }

  return (
    <section className={`canvasLayer ${acl(isActive, 'selected')} ${acl(!isWatching, 'hidden')}`}>
      <div className='canvasLayer-viewer'>
        <CanvasSeeMode className='canvasLayer-see' layerId={id} isWatching={isWatching} parentId={parentId} />
        <button className='canvasLayer-image' onClick={handleClick}>
          {imageUrl && <Image src={imageUrl} alt='canvas-layer' layout='fullWidth' />}
        </button>
        <LayerTitle value={title} idLayer={id} changeTitle={handleTitleChange} />
      </div>
      <OpacityCanvasMode layerId={id} opacity={opacity} opacityChange={handleOpacityChange} />
    </section>
  )
}

export default memo(CanvasLayer)
