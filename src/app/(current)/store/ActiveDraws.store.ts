import { StateCreator, create } from 'zustand'

import { DEFAULT_LAYER_ID, DEFAULT_PARENT_ID } from './layer.store'

interface IActiveDrawsStore {
  activeParentId: string
  activeLayerId: string
  setActiveParentId: (activeParentId: string) => void
  setActiveLayerId: (activeLayerId: string) => void
}

const state: StateCreator<IActiveDrawsStore> = set => ({
  activeLayerId: DEFAULT_LAYER_ID,
  activeParentId: DEFAULT_PARENT_ID,
  setActiveLayerId: activeLayerId => set({ activeLayerId }),
  setActiveParentId: activeParentId => set({ activeParentId })
})

const ActiveDrawsStore = create(state)

export default ActiveDrawsStore
