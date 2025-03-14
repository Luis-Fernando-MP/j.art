import { StateCreator, create } from 'zustand'

interface ISelectionStore {
  selection: {
    startX: number
    startY: number
    endX: number
    endY: number
    width: number
    height: number
  }
  setSelection: (selection: Partial<ISelectionStore['selection']>) => void
}

const state: StateCreator<ISelectionStore> = (set, get) => ({
  selection: {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    width: 0,
    height: 0
  },

  setSelection: selection => {
    const prevSelection = get().selection
    const newSelection = { ...prevSelection, ...selection }
    set({ selection: newSelection })
  }
})

const SelectionStore = create(state)

export default SelectionStore
