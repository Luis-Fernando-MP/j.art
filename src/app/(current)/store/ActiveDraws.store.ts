import { StateCreator, create } from 'zustand'

import { DEFAULT_LAYER_ID, DEFAULT_PARENT_ID } from './layer.store'

interface IActiveDrawsStore {
  actParentId: string
  actLayerId: string
  actParentIndex: number
  setActParentId: (actParentId: string) => void
  setActLayerId: (actLayerId: string) => void
  setActParentIndex: (actParentIndex: number) => void
}

const state: StateCreator<IActiveDrawsStore> = set => ({
  actLayerId: DEFAULT_LAYER_ID,
  actParentId: DEFAULT_PARENT_ID,
  actParentIndex: 0,
  setActParentId: actParentId => set({ actParentId }),
  setActLayerId: actLayerId => set({ actLayerId }),
  setActParentIndex: actParentIndex => set({ actParentIndex })
})

const ActiveDrawsStore = create(state)

export default ActiveDrawsStore
