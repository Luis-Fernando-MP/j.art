import { StateCreator, create } from 'zustand'

export interface Layer {
  id: string
  parentId: string
  title: string
  imageUrl: string | null
}

export interface ParentLayer {
  index: number
  id: string
}

interface ILayerStore {
  listOfLayers: { [key: string]: Layer[] }
  idParentLayer: ParentLayer
  activeLayer: string

  setListOfLayers: (listOfLayers: ILayerStore['listOfLayers']) => void
  setIdParentLayer: (idParentLayer: ParentLayer) => void
  setActiveLayer: (activeLayer: string) => void
}

const DEFAULT_CANVAS = 'default-canvas'
const DEFAULT_LAYER = `${DEFAULT_CANVAS}-layer1`
export const MAX_LAYERS = 20

const state: StateCreator<ILayerStore> = (set, get) => ({
  idParentLayer: {
    index: 0,
    id: DEFAULT_CANVAS
  },
  activeLayer: DEFAULT_LAYER,
  listOfLayers: {
    [DEFAULT_CANVAS]: [
      { id: DEFAULT_LAYER, title: 'capa 01', parentId: DEFAULT_CANVAS, imageUrl: null },
      { id: `${DEFAULT_CANVAS}-layer2`, title: 'capa 02', parentId: DEFAULT_CANVAS, imageUrl: null },
      { id: `${DEFAULT_CANVAS}-layer3`, title: 'capa 03', parentId: DEFAULT_CANVAS, imageUrl: null }
    ]
  },
  setListOfLayers: listOfLayers => set({ listOfLayers }),
  setIdParentLayer: idParentLayer => set({ idParentLayer }),
  setActiveLayer: activeLayer => set({ activeLayer })
})

const LayerStore = create(state)
export default LayerStore
