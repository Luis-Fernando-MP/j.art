import { StateCreator, create } from 'zustand'

export interface Layer {
  id: string
  parentId: string
}

export interface ParentLayer {
  index: number
  id: string
}

export interface ListOfLayers {
  [key: string]: Layer[]
}

interface ILayerStore {
  listOfLayers: ListOfLayers
  activeLayer: Layer
  idParentLayer: ParentLayer

  setListOfLayers: (listOfLayers: ListOfLayers) => void
  setActiveLayer: (activeLayer: Layer) => void
  setIdParentLayer: (idParentLayer: ParentLayer) => void
}

const DEFAULT_CANVAS = 'default-canvas'
const DEFAULT_LAYER = `${DEFAULT_CANVAS}-layer1`
export const MAX_LAYERS = 20

const state: StateCreator<ILayerStore> = set => ({
  idParentLayer: {
    index: 0,
    id: DEFAULT_CANVAS
  },
  listOfLayers: {
    [DEFAULT_CANVAS]: [
      { id: DEFAULT_LAYER, parentId: DEFAULT_CANVAS },
      { id: `${DEFAULT_CANVAS}-layer2`, parentId: DEFAULT_CANVAS }
    ]
  },
  activeLayer: { id: DEFAULT_LAYER, parentId: DEFAULT_CANVAS },

  setListOfLayers: listOfLayers => set({ listOfLayers }),
  setActiveLayer: activeLayer => set({ activeLayer }),
  setIdParentLayer: idParentLayer => set({ idParentLayer })
})

const LayerStore = create(state)
export default LayerStore
