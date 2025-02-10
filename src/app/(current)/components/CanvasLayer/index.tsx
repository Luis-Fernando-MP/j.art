import { acl } from '@/shared/acl'
import { Image } from '@unpic/react'
import { BlendIcon, EyeIcon } from 'lucide-react'
import { JSX, memo } from 'react'

import LayerStore, { Layer } from '../../store/layer.store'
import './style.scss'

interface ICanvasLayer {
  layer: Layer
  isActive: boolean
}

const CanvasLayer = ({ layer, isActive }: ICanvasLayer): JSX.Element => {
  const { setActiveLayer } = LayerStore()

  const { imageUrl, title, id, parentId } = layer

  const handleClick = (): void => {
    if (isActive) return
    setActiveLayer({ id, parentId })
  }

  return (
    <section role='button' tabIndex={0} className={`canvasLayer ${acl(isActive)}`} onClick={handleClick}>
      <div className='canvasLayer-viewer'>
        <button className='canvasLayer-see'>
          <EyeIcon />
        </button>
        <div className='canvasLayer-image'>{imageUrl && <Image src={imageUrl} alt='canvas-layer' layout='fullWidth' />}</div>
        <input defaultValue={title} />
      </div>

      <button className='canvasLayer-delete'>
        <BlendIcon />
      </button>
    </section>
  )
}

export default memo(CanvasLayer)
