import { StateCreator, create } from 'zustand'

import { basicColorsRGBA } from '../components/BoardColors/colors.'

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
  pixelColor: basicColorsRGBA[0],
  setPixelSize: pixelSize => set({ pixelSize }),
  setPixelColor: pixelColor => set({ pixelColor }),
  setPixelOpacity: pixelOpacity => set({ pixelOpacity })
})

const PixelStore = create(state)
export default PixelStore
