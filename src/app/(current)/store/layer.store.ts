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
  setListOfLayers: (listOfLayers: ILayerStore['listOfLayers']) => void
  deleteLayer: (p: { id: string; parentId: string; actLayerId: string }) => void
  addNewLayer: (_: { parentId: string }) => void
  addNewFrame: (index?: number) => { index: number; frameKey: string; layerId: string } | null
  updateLayer: (_: { parentId: string; layer: Partial<Layer>; list?: Layer[] }) => void
}

export const DEFAULT_PARENT_ID = 'default-canvas'
export const DEFAULT_LAYER_ID = `${DEFAULT_PARENT_ID}-layer1`
export const MAX_FRAMES = 20
export const MAX_LAYERS = 15

const state: StateCreator<ILayerStore> = (set, get) => ({
  idParentLayer: {
    index: 0,
    id: DEFAULT_PARENT_ID
  },
  activeLayer: { id: DEFAULT_LAYER_ID, parentId: DEFAULT_PARENT_ID },
  listOfLayers: {
    [DEFAULT_PARENT_ID]: [
      { id: DEFAULT_LAYER_ID, title: 'Capa 01', parentId: DEFAULT_PARENT_ID, imageUrl: null, isWatching: true, opacity: 100 }
    ]
  },
  setListOfLayers: listOfLayers => set({ listOfLayers }),
  deleteLayer({ id, parentId, actLayerId }) {
    const listOfLayers = get().listOfLayers
    const currentList = structuredClone(listOfLayers[parentId])
    if (!currentList) return
    if (currentList?.length <= 1) return toast.error('❗️Una cpa como mínimo', { id: 'min-layers' })
    const updatedList = currentList.filter(f => f.id !== id)
    const existLayer = updatedList.some(l => l.id === actLayerId)
    console.log(existLayer)
    // let newSelected = actLayerId
    // if (!existLayer) newSelected = updatedList[0] ?? null
    set({
      listOfLayers: { ...listOfLayers, [parentId]: updatedList }
      // activeLayer: newSelected
    })
  },
  addNewLayer({ parentId }) {
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
  addNewFrame(selectIndex) {
    const listOfLayers = get().listOfLayers
    const frameKey = newKey()
    const layerId = newKey()
    const newList = structuredClone(listOfLayers)
    const index = selectIndex ?? Object.keys(listOfLayers).length
    newList[frameKey] = [
      {
        id: layerId,
        parentId: frameKey,
        imageUrl: null,
        title: `Capa 01`,
        isWatching: true,
        opacity: 100
      }
    ]
    if (Object.keys(newList).length > MAX_LAYERS) {
      toast.error('🔥 hay muchos canvas')
      return null
    }

    set({ listOfLayers: newList })
    return { index, frameKey, layerId }
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
