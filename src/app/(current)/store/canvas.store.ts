import { StateCreator, create } from 'zustand'

type TDimensionPosition = {
  width: number
  height: number
}

export type TPositions = { x: number; y: number }

interface ICanvasStore {
  selectedCanvas: string
  listOfCanvas: string[]
  dimensions: TDimensionPosition

  setSelectedCanvas: (selectedCanvas: string) => void
  setListOfCanvas: (listOfCanvas: string[]) => void
  setDimensions: (dimensions: TDimensionPosition) => void
}

const DEFAULT_ID_CANVAS = 'default-canvas'
const DEFAULT_WIDTH_CANVAS = 900
const DEFAULT_HEIGHT_CANVAS = 900

const state: StateCreator<ICanvasStore> = set => ({
  selectedCanvas: DEFAULT_ID_CANVAS,
  listOfCanvas: [DEFAULT_ID_CANVAS],
  dimensions: {
    height: DEFAULT_HEIGHT_CANVAS,
    width: DEFAULT_WIDTH_CANVAS
  },
  setDimensions: dimensions => set({ dimensions }),
  setListOfCanvas: listOfCanvas => set({ listOfCanvas }),
  setSelectedCanvas: selectedCanvas => set({ selectedCanvas })
})

const CanvasStore = create(state)
export default CanvasStore
