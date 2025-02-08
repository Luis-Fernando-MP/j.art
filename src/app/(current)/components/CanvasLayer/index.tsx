import { acl } from '@/shared/acl'
import { Image } from '@unpic/react'
import { EyeIcon, XIcon } from 'lucide-react'
import { JSX, memo } from 'react'

import { Layer } from '../../store/layer.store'
import './style.scss'

interface ICanvasLayer {
  layer: Layer
  isActive: boolean
  handleActiveLayer: (id: string) => void
}

const CanvasLayer = ({ layer, handleActiveLayer, isActive }: ICanvasLayer): JSX.Element => {
  const { id, imageUrl, parentId, title } = layer

  return (
    <section role='button' tabIndex={0} className={`canvasLayer ${acl(isActive)}`} onClick={() => handleActiveLayer(id)}>
      <div className='canvasLayer-viewer'>
        <button className='canvasLayer-see'>
          <EyeIcon />
        </button>
        <div className='canvasLayer-image'>{imageUrl && <Image src={imageUrl} alt='canvas-layer' layout='fullWidth' />}</div>
        <input defaultValue={title} />
      </div>

      <button className='canvasLayer-delete'>
        <XIcon />
      </button>
    </section>
  )
}

export default memo(CanvasLayer)
