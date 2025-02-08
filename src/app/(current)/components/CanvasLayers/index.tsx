'use client'

import { onion } from '@lucide/lab'
import { ArrowDown, ArrowUp, CombineIcon, EyeIcon, Icon, PlusIcon, XIcon } from 'lucide-react'
import { type JSX, useMemo } from 'react'

import LayerStore from '../../store/layer.store'
import CanvasLayer from '../CanvasLayer'
import './style.scss'

const CanvasLayers = (): JSX.Element | null => {
  const { listOfLayers, idParentLayer, setListOfLayers, setIdParentLayer } = LayerStore()
  const layers = listOfLayers[idParentLayer.id]
  const { setActiveLayer, activeLayer } = LayerStore()

  if (!layers) return null

  // Función para agregar una nueva capa
  const addLayer = () => {
    const newLayerId = `${idParentLayer.id}-layer${layers.length + 1}`
    const newLayer = {
      id: newLayerId,
      title: `capa ${layers.length + 1}`,
      parentId: idParentLayer.id,
      imageUrl: null,
      isActive: false
    }

    const updatedLayers = [...layers, newLayer]
    setListOfLayers({ ...listOfLayers, [idParentLayer.id]: updatedLayers })
  }

  const moveLayerDown = (index: number) => {
    if (index >= layers.length - 1) return
    const updatedLayers = [...layers]
    const temp = updatedLayers[index]
    updatedLayers[index] = updatedLayers[index + 1]
    updatedLayers[index + 1] = temp
    setListOfLayers({ ...listOfLayers, [idParentLayer.id]: updatedLayers })
  }

  const moveLayerUp = (index: number) => {
    if (index <= 0) return
    const updatedLayers = [...layers]
    const temp = updatedLayers[index]
    updatedLayers[index] = updatedLayers[index - 1]
    updatedLayers[index - 1] = temp
    setListOfLayers({ ...listOfLayers, [idParentLayer.id]: updatedLayers })
  }

  return (
    <section className='canvasLayers' id='layers'>
      <h5>Capas</h5>
      <div className='canvasLayers-wrapper'>
        <div className='canvasLayers-actions'>
          <button onClick={addLayer}>
            <PlusIcon />
          </button>
          <button onClick={() => moveLayerDown(activeLayer.index)}>
            <ArrowDown />
          </button>
          <button onClick={() => moveLayerUp(activeLayer.index)}>
            <ArrowUp />
          </button>
          <button>
            <CombineIcon />
          </button>
          <button>
            <Icon iconNode={onion} />
          </button>
        </div>
        <div className='canvasLayers-list'>
          {layers.map((layer, i) => {
            return (
              <CanvasLayer
                layer={layer}
                key={`item-layer-${layer.id}`}
                handleActiveLayer={() => setActiveLayer({ id: layer.id, index: i })}
                isActive={layer.id === activeLayer.id}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CanvasLayers
