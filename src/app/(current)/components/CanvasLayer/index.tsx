import { acl } from '@/shared/acl'
import { Image } from '@unpic/react'
import { EyeIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { JSX, memo, useEffect } from 'react'

import LayerStore, { Layer } from '../../store/layer.store'
import './style.scss'

const CanvasSeeMode = dynamic(() => import('./CanvasSeeMode'), {
  ssr: false,
  loading: () => <EyeIcon />
})

const OpacityCanvasMode = dynamic(() => import('./OpacityCanvasMode'), {
  ssr: false,
  loading() {
    return <p>loading</p>
  }
})

interface ICanvasLayer {
  layer: Layer
}

const CanvasLayer = ({ layer }: ICanvasLayer): JSX.Element => {
  const { setActiveLayer, activeLayer } = LayerStore()
  const { imageUrl, title, id, parentId, isWatching, opacity } = layer
  const isActive = layer.id === activeLayer.id
  const handleClick = (): void => {
    if (isActive) return
    setActiveLayer({ id, parentId })
  }

  useEffect(() => {
    console.log('render')
    return () => {
      console.log('unmount')
    }
  }, [])

  return (
    <section className={`canvasLayer ${acl(isActive)}`}>
      <div className='canvasLayer-viewer'>
        <CanvasSeeMode className='canvasLayer-see' layerId={id} isWatching={isWatching} parentId={parentId} />
        <div className='canvasLayer-image' role='button' tabIndex={0} onClick={handleClick}>
          {imageUrl && <Image src={imageUrl} alt='canvas-layer' layout='fullWidth' />}
        </div>
        <input defaultValue={title} />
      </div>
      <OpacityCanvasMode opacity={opacity} layerId={id} parentId={parentId} />
    </section>
  )
}

export default memo(CanvasLayer)
