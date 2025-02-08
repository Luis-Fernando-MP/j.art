import { StateCreator, create } from 'zustand'

const initialState = typeof window !== 'undefined' ? !navigator.onLine : false

interface IOfflineStore {
  isOffline: boolean
  setIsOffline: (isOffline: boolean) => void
}

const state: StateCreator<IOfflineStore> = set => ({
  isOffline: initialState,
  setIsOffline: isOffline => set({ isOffline })
})

const OfflineStore = create(state)

export default OfflineStore
