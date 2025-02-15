import { StateCreator, create } from 'zustand'

type TDimensionPosition = {
  width: number
  height: number
}

export type TPositions = { x: number; y: number }

interface ICanvasStore {
  dimensions: TDimensionPosition

  setDimensions: (dimensions: TDimensionPosition) => void
}

const DEFAULT_WIDTH_CANVAS = 15 * 20
const DEFAULT_HEIGHT_CANVAS = 15 * 20

const state: StateCreator<ICanvasStore> = set => ({
  dimensions: {
    height: DEFAULT_HEIGHT_CANVAS,
    width: DEFAULT_WIDTH_CANVAS
  },
  setDimensions: dimensions => set({ dimensions })
})

const CanvasStore = create(state)
export default CanvasStore
