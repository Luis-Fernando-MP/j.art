import Dropdown from '@/shared/components/Dropdown'
import Popup from '@/shared/components/Popup'
import { Image } from '@unpic/react'
import { MergeIcon } from 'lucide-react'
import { type JSX, useState } from 'react'

import useMergeTool from '../../hooks/useMergeTool'
import './style.scss'

const MergeTool = (): JSX.Element | null => {
  const [openPopup, setOpenPopup] = useState(false)
  const { currentLayers, updateSelectedLayer, handleMergeLayers } = useMergeTool()
  if (!currentLayers) return null
  return (
    <>
      <button onClick={() => setOpenPopup(!openPopup)}>
        <MergeIcon />
      </button>
      <Popup isOpen={openPopup} onClose={() => setOpenPopup(false)} title='Merge' className='mergeTool-popup'>
        <Dropdown
          list={currentLayers}
          className='mergeTool-dropdown'
          onChange={layer => updateSelectedLayer({ index: 0, layerId: layer.id })}
          revalidateChange={layer => updateSelectedLayer({ index: 0, layerId: layer.id })}
        >
          {layer => {
            const image = layer.imageUrl ?? '/images/blank-image.webp'
            return (
              <div className='mergeTool-itemDropdown'>
                <p className='mergeTool-itemDropdown__title'>{layer.title}</p>
                <Image src={image} alt={`layer image - ${layer.title}`} layout='fullWidth' />
              </div>
            )
          }}
        </Dropdown>
        <div className='mergeTool-separator'></div>
        <Dropdown
          list={currentLayers}
          className='mergeTool-dropdown'
          onChange={layer => updateSelectedLayer({ index: 1, layerId: layer.id })}
          revalidateChange={layer => updateSelectedLayer({ index: 1, layerId: layer.id })}
        >
          {layer => {
            const image = layer.imageUrl ?? '/images/blank-image.webp'
            return (
              <div className='mergeTool-itemDropdown'>
                <p className='mergeTool-itemDropdown__title'>{layer.title}</p>
                <Image src={image} alt={`layer image - ${layer.title}`} layout='fullWidth' />
              </div>
            )
          }}
        </Dropdown>
        <button className='mergeTool-action' onClick={handleMergeLayers}>
          <MergeIcon />
          Merge
        </button>
      </Popup>
    </>
  )
}

export default MergeTool
