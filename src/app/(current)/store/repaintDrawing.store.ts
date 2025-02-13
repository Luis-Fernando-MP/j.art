import { StateCreator, create } from 'zustand'

interface IRepaintDrawingStore {
  repaint: boolean
  setRepaint: (repaint: boolean) => void
}

const state: StateCreator<IRepaintDrawingStore> = set => ({
  repaint: false,
  setRepaint: repaint => set({ repaint })
})

const RepaintDrawingStore = create(state)

export default RepaintDrawingStore
