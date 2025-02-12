import Dropdown from '@/shared/components/Dropdown'
import Popup from '@/shared/components/Popup'
import { Image } from '@unpic/react'
import { MergeIcon } from 'lucide-react'
import { type JSX } from 'react'

import useMergeTool from '../../hooks/useMergeTool'
import './style.scss'

const MergeTool = (): JSX.Element | null => {
  const { openPopup, currentLayers, setOpenPopup, handleMergeLayers, updateSelectedLayer } = useMergeTool()

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
          renderClassName='mergeTool-itemDropdown'
          onChange={layer => updateSelectedLayer(0, layer.id)}
          render={layer => {
            console.log('layer', layer)
            const image = layer.imageUrl ?? '/images/blank-image.webp'
            return (
              <>
                <p className='mergeTool-itemDropdown__title'>{layer.title}</p>
                <Image src={image} alt={`layer image - ${layer.title}`} layout='fullWidth' />
              </>
            )
          }}
        />
        <div className='mergeTool-separator'></div>
        <Dropdown
          className='mergeTool-dropdown'
          list={currentLayers}
          renderClassName='mergeTool-itemDropdown'
          onChange={layer => updateSelectedLayer(1, layer.id)}
          render={layer => {
            const image = layer.imageUrl ?? '/images/blank-image.webp'
            return (
              <>
                <p className='mergeTool-itemDropdown__title'>{layer.title}</p>
                <Image src={image} alt={`layer image - ${layer.title}`} layout='fullWidth' />
              </>
            )
          }}
        />
        <button className='mergeTool-action' onClick={handleMergeLayers}>
          <MergeIcon />
          Merge
        </button>
      </Popup>
    </>
  )
}

export default MergeTool
