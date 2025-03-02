'use client'

import { newKey } from '@/shared/key'
import toast from 'react-hot-toast'
import { StateCreator, create } from 'zustand'

export interface Layer {
  id: string
  title: string
  parentId: string
  imageUrl: string | null
  isWatching: boolean
  opacity: number
  hue: number
}

interface ILayerStore {
  listOfLayers: { [key: string]: Layer[] }

  setListOfLayers: (listOfLayers: ILayerStore['listOfLayers']) => void
  deleteLayer: (p: { parentId: string; actLayerId: string }) => Layer | null
  addNewLayer: (_: { parentId: string }) => void
  addNewFrame: (index?: number) => { index: number; frameKey: string; layerId: string } | null
  updateLayer: (_: { parentId: string; layer: Partial<Layer>; list?: Layer[] }) => void
  reset: () => void
}

export const DEFAULT_PARENT_ID = newKey('default-canvas')
export const DEFAULT_LAYER_ID = newKey('layer1')
export const MAX_FRAMES = 20
export const MAX_LAYERS = 15

const DEFAULT_LIST = {
  [DEFAULT_PARENT_ID]: [setLayer({ id: DEFAULT_LAYER_ID, parentId: DEFAULT_PARENT_ID })]
}

const state: StateCreator<ILayerStore> = (set, get) => ({
  listOfLayers: DEFAULT_LIST,
  reset: () => {
    const canvas = document.getElementById(DEFAULT_LAYER_ID)
    if (canvas instanceof HTMLCanvasElement) {
      canvas.removeAttribute('style')
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    set({ listOfLayers: DEFAULT_LIST })
  },
  setListOfLayers: listOfLayers => set({ listOfLayers }),
  deleteLayer({ parentId, actLayerId }) {
    const listOfLayers = get().listOfLayers
    const currentList = structuredClone(listOfLayers[parentId])
    if (!currentList) return null
    if (currentList?.length <= 1) {
      toast.error('❗️Una cpa como mínimo', { id: 'min-layers' })
      return null
    }
    const updatedList = currentList.filter(f => f.id !== actLayerId)
    set({
      listOfLayers: { ...listOfLayers, [parentId]: updatedList }
    })
    return updatedList[0]
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
    const newLayer = setLayer({ id: newLayerId, title: `capa-${layerName}`, parentId })
    const updatedLayers = [...currentList, newLayer]
    set({ listOfLayers: { ...listOfLayers, [parentId]: updatedLayers } })
  },
  addNewFrame(selectIndex) {
    const listOfLayers = get().listOfLayers
    const frameKey = newKey()
    const layerId = newKey()
    const newList = structuredClone(listOfLayers)
    const index = selectIndex ?? Object.keys(listOfLayers).length
    newList[frameKey] = [setLayer({ id: layerId, parentId: frameKey })]

    if (Object.keys(newList).length > MAX_LAYERS) {
      toast.error('🔥 hay muchos canvas')
      return null
    }

    set({ listOfLayers: newList })
    return { index, frameKey, layerId }
  },
  updateLayer({ parentId, layer, list }) {
    const listOfLayers = get().listOfLayers

    console.log('lista', listOfLayers, parentId, listOfLayers[parentId])
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

export function setLayer(layer: Partial<Layer>): Layer {
  const basicLayer: Layer = {
    id: layer.id ?? newKey(),
    title: 'capa 01',
    parentId: layer.parentId ?? newKey(),
    imageUrl: null,
    isWatching: true,
    opacity: 100,
    hue: 0
  }
  return { ...basicLayer, ...layer }
}
