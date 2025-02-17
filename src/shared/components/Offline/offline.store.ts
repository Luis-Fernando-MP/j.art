import { StateCreator, create } from 'zustand'

const initialState = null

interface IOfflineStore {
  isOffline: boolean | null
  setIsOffline: (isOffline: boolean) => void
}

const state: StateCreator<IOfflineStore> = set => ({
  isOffline: initialState,
  setIsOffline: isOffline => set({ isOffline })
})

const OfflineStore = create(state)

export default OfflineStore
