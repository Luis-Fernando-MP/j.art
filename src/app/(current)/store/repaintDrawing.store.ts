import { StateCreator, create } from 'zustand'

export type Repaint = 'all' | 'layers' | 'frames' | null
interface IRepaintDrawingStore {
  repaint: Repaint
  setRepaint: (repaint?: Repaint) => void
}

const state: StateCreator<IRepaintDrawingStore> = set => ({
  repaint: null,
  setRepaint: (repaint = 'all') => set({ repaint })
})

const RepaintDrawingStore = create(state)

export default RepaintDrawingStore
