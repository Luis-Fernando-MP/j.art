import { newKey } from '@/shared/key'
import toast from 'react-hot-toast'
import { StateCreator, create } from 'zustand'

export interface Layer {
  id: string
  parentId: string
  title: string
  imageUrl: string | null
  isWatching: boolean
  opacity: number
}

export interface ParentLayer {
  index: number
  id: string
}

interface ILayerStore {
  listOfLayers: { [key: string]: Layer[] }
  idParentLayer: ParentLayer
  activeLayer: { id: string; parentId: string }

  setListOfLayers: (listOfLayers: ILayerStore['listOfLayers']) => void
  setIdParentLayer: (idParentLayer: ParentLayer) => void
  setActiveLayer: (activeLayer: ILayerStore['activeLayer']) => void
  deleteLayer: (p: { id: string; parentId: string }) => void
  addLayer: (_: { parentId: string }) => void
  updateLayer: (_: { parentId: string; layer: Partial<Layer>; list?: Layer[] }) => void
}

const DEFAULT_CANVAS = 'default-canvas'
const DEFAULT_LAYER = `${DEFAULT_CANVAS}-layer1`
export const MAX_FRAMES = 20
export const MAX_LAYERS = 15

const state: StateCreator<ILayerStore> = (set, get) => ({
  idParentLayer: {
    index: 0,
    id: DEFAULT_CANVAS
  },
  activeLayer: { id: DEFAULT_LAYER, parentId: DEFAULT_CANVAS },
  listOfLayers: {
    [DEFAULT_CANVAS]: [
      { id: DEFAULT_LAYER, title: 'capa 01', parentId: DEFAULT_CANVAS, imageUrl: null, isWatching: true, opacity: 100 }
    ]
  },
  setListOfLayers: listOfLayers => set({ listOfLayers }),
  setIdParentLayer: idParentLayer => set({ idParentLayer }),
  setActiveLayer: activeLayer => set({ activeLayer }),
  deleteLayer({ id, parentId }) {
    const listOfLayers = get().listOfLayers
    const currentList = structuredClone(listOfLayers[parentId])
    if (!currentList) return
    if (currentList?.length <= 1) return toast.error('❗️Una cpa como mínimo', { id: 'min-layers' })
    const selectLayer = get().activeLayer
    const updatedList = currentList.filter(f => f.id !== id)
    const existLayer = updatedList.some(l => l.id === selectLayer.id)
    let newSelected = selectLayer
    if (!existLayer) newSelected = updatedList[0] ?? null
    set({
      listOfLayers: { ...listOfLayers, [parentId]: updatedList },
      activeLayer: newSelected
    })
  },
  addLayer({ parentId }) {
    const listOfLayers = get().listOfLayers
    const currentList = structuredClone(listOfLayers[parentId])
    if (!currentList) return
    if (currentList?.length >= MAX_LAYERS) {
      return toast.error(`❗️Máximo ${MAX_LAYERS} capas por frame`, { id: 'max-layers' })
    }
    const layerName = String(currentList.length + 1).padStart(2, '0')
    const newLayerId = newKey(`${parentId}-layer-${layerName}`)
    const newLayer = {
      id: newLayerId,
      title: `capa-${layerName}`,
      parentId: parentId,
      imageUrl: null,
      isActive: false,
      isWatching: true,
      opacity: 100
    }
    const updatedLayers = [...currentList, newLayer]
    set({ listOfLayers: { ...listOfLayers, [parentId]: updatedLayers } })
  },
  updateLayer({ parentId, layer, list }) {
    const listOfLayers = get().listOfLayers
    const currentList = list ?? [...listOfLayers[parentId]]
    if (!currentList) return
    const updatedList = currentList.map(f => {
      if (f.id !== layer.id) return f
      return { ...f, ...layer }
    })
    set({
      listOfLayers: { ...listOfLayers, [parentId]: updatedList }
    })
  }
})

const LayerStore = create(state)
export default LayerStore
