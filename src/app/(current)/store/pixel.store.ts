import { StateCreator, create } from 'zustand'

interface IPixelStore {
  pixelSize: number
  pixelColor: string
  pixelOpacity: number

  setPixelSize: (pixelSize: number) => void
  setPixelColor: (pixelColor: string) => void
  setPixelOpacity: (pixelOpacity: number) => void
}

const state: StateCreator<IPixelStore> = set => ({
  pixelSize: 15,
  pixelOpacity: 1,
  pixelColor: 'rgb(255, 255, 255, 255)',
  setPixelSize: pixelSize => set({ pixelSize }),
  setPixelColor: pixelColor => set({ pixelColor }),
  setPixelOpacity: pixelOpacity => set({ pixelOpacity })
})

const PixelStore = create(state)
export default PixelStore
