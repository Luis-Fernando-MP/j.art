import { acl } from '@/shared/acl'
import { Image } from '@unpic/react'
import { EyeIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { JSX, memo } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import LayerStore, { Layer } from '../../store/layer.store'
import './style.scss'

const CanvasSeeMode = dynamic(() => import('./CanvasSeeMode'), { ssr: false, loading: () => <EyeIcon /> })
const OpacityCanvasMode = dynamic(() => import('./OpacityCanvasMode'), { ssr: false })
const LayerTitle = dynamic(() => import('./LayerTitle'), {
  ssr: false,
  loading: () => <div className='canvasLayer-title'>loading...</div>
})

interface ICanvasLayer {
  layer: Layer
}

const CanvasLayer = ({ layer }: ICanvasLayer): JSX.Element => {
  const { updateLayer } = LayerStore()
  const { actLayerId, setActLayerId, setActParentId } = ActiveDrawsStore()
  const { imageUrl, title, id, parentId, isWatching, opacity } = layer
  const isActive = layer.id === actLayerId
  const handleClick = (): void => {
    if (isActive) return
    setActLayerId(id)
    setActParentId(parentId)
  }

  const handleTitleChange = (value: string): void => {
    updateLayer({
      parentId,
      layer: { id, title: value }
    })
  }

  return (
    <section className={`canvasLayer ${acl(isActive, 'selected')}`}>
      <div className='canvasLayer-viewer'>
        <CanvasSeeMode className='canvasLayer-see' layerId={id} isWatching={isWatching} parentId={parentId} />
        <div className='canvasLayer-image' role='button' tabIndex={0} onClick={handleClick}>
          {imageUrl && <Image src={imageUrl} alt='canvas-layer' layout='fullWidth' />}
        </div>
        <LayerTitle value={title} idLayer={id} changeTitle={handleTitleChange} />
      </div>
      <OpacityCanvasMode opacity={opacity} layerId={id} />
    </section>
  )
}

export default memo(CanvasLayer)
