import { TPositions } from '@/app/(current)/store/canvas.store'
import { StateCreator, create } from 'zustand'

interface IBoardStore {
  scale: number
  offset: TPositions
  enableScroll: boolean
  nextChild: () => void
  prevChild: () => void
  moveToChild: (index: number) => void

  setNextChild: (fn: IBoardStore['nextChild']) => void
  setPrevChild: (fn: IBoardStore['prevChild']) => void
  setMoveToChild: (fn: IBoardStore['moveToChild']) => void

  setScale: (scale: number) => void
  setEnableScroll: (enableScroll: boolean) => void
  setOffset: (offset: TPositions) => void
}

export const MIN_SCALE = 0.5
export const MAX_SCALE = 20
export const INITIAL_SCALE = 1

const state: StateCreator<IBoardStore> = set => ({
  scale: INITIAL_SCALE,
  offset: { x: 0, y: 0 },
  enableScroll: false,
  nextChild: () => {},
  prevChild: () => {},
  moveToChild: () => {},

  setEnableScroll: enableScroll => set({ enableScroll }),
  setScale: scale => set({ scale }),
  setOffset: offset => set({ offset }),
  setNextChild: nextChild => set({ nextChild }),
  setPrevChild: prevChild => set({ prevChild }),
  setMoveToChild: moveToChild => set({ moveToChild })
})

const boardStore = create(state)

export default boardStore
