import { StateCreator, create } from 'zustand'

export type TPositions = { x: number; y: number }

interface ICanvasStore {
  pixelSize: number
  pixelColor: string
  pixelOpacity: number

  setPixelSize: (pixelSize: number) => void
}

const state: StateCreator<ICanvasStore> = set => ({
  pixelSize: 30,
  pixelOpacity: 1,
  pixelColor: '#c689ff',
  setPixelSize: pixelSize => set({ pixelSize })
})

const CanvasStore = create(state)

export default CanvasStore
