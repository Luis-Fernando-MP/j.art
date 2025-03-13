import Dropdown from '@/shared/components/Dropdown'
import Popup from '@/shared/components/Popup'
import { PopupPositions } from '@/shared/components/Popup/usePopup'
import { BLANK_IMAGE } from '@/shared/constants'
import { Image } from '@unpic/react'
import { MergeIcon } from 'lucide-react'
import { type JSX, MouseEvent, useState } from 'react'

import useMergeTool from '../../hooks/useMergeTool'
import './style.scss'

const MergeTool = (): JSX.Element | null => {
  const [openPopup, setOpenPopup] = useState(false)
  const { currentLayers, updateSelectedLayer, handleMergeLayers } = useMergeTool()
  const [positions, setPositions] = useState<PopupPositions>()

  const handleClick = (e: MouseEvent): void => {
    setOpenPopup(!openPopup)
    setPositions({ x: e.clientX, y: e.clientY })
  }

  if (!currentLayers) return null
  return (
    <>
      <button onClick={handleClick}>
        <MergeIcon />
      </button>
      <Popup
        isOpen={openPopup}
        onClose={() => setOpenPopup(false)}
        title='Merge'
        className='mergeTool-popup'
        clickPosition={positions}
      >
        <Dropdown
          list={currentLayers}
          className='mergeTool-dropdown'
          onChange={layer => updateSelectedLayer({ index: 0, layerId: layer.id })}
          revalidateChange={layer => updateSelectedLayer({ index: 0, layerId: layer.id })}
        >
          {layer => {
            const image = layer.imageUrl ?? BLANK_IMAGE
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
            const image = layer.imageUrl ?? BLANK_IMAGE
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
