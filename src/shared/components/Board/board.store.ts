import { TPositions } from '@/app/(current)/store/canvas.store'
import { StateCreator, create } from 'zustand'

interface IBoardStore {
  scale: number
  offset: TPositions
  setScale: (scale: number) => void
  setOffset: (offset: TPositions) => void
}

export const MIN_SCALE = 0.7
export const MAX_SCALE = 5
export const INITIAL_SCALE = 1

const state: StateCreator<IBoardStore> = set => ({
  scale: INITIAL_SCALE,
  offset: { x: 0, y: 0 },
  setScale: scale => set({ scale }),
  setOffset: offset => set({ offset })
})

const boardStore = create(state)

export default boardStore
