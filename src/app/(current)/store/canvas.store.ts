import { StateCreator, create } from 'zustand'

export type TPositions = { x: number; y: number }

interface ICanvasStore {
  pixelSize: number
  pixelColor: string
  pixelOpacity: number

  setPixelSize: (pixelSize: number) => void
  setPixelColor: (pixelColor: string) => void
  setPixelOpacity: (pixelOpacity: number) => void
}

const state: StateCreator<ICanvasStore> = set => ({
  pixelSize: 30,
  pixelOpacity: 1,
  pixelColor: 'rgba(198, 137, 255, 255)',
  setPixelSize: pixelSize => set({ pixelSize }),
  setPixelColor: pixelColor => set({ pixelColor }),
  setPixelOpacity: pixelOpacity => set({ pixelOpacity })
})

const CanvasStore = create(state)
export default CanvasStore
