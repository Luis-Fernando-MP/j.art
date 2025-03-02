import { StateCreator, create } from 'zustand'

import { getSize } from '../components/CanvasFile/FilePopup'

type TDimensionPosition = {
  width: number
  height: number
}

export type TPositions = { x: number; y: number }

interface ICanvasStore {
  dimensions: TDimensionPosition
  title: string

  setDimensions: (dimensions: TDimensionPosition) => void
  setTitle: (title: string) => void
}

const { w, h } = getSize('Favicons')
const DEFAULT_WIDTH_CANVAS = w
const DEFAULT_HEIGHT_CANVAS = h

const state: StateCreator<ICanvasStore> = set => ({
  dimensions: {
    height: DEFAULT_HEIGHT_CANVAS,
    width: DEFAULT_WIDTH_CANVAS
  },
  title: 'j-art',
  setDimensions: dimensions => set({ dimensions }),
  setTitle: title => set({ title })
})

const CanvasStore = create(state)
export default CanvasStore
