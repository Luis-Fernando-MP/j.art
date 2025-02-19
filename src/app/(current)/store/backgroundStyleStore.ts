import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TPreferenceBackgroundStyle = keyof Omit<IBackgroundStyleStore, 'togglePreference'>

export const backgroundStyleClassList = {
  background: 'active-background',
  grid: 'active-grid',
  cross: 'active-cross',
  transparent: 'active-transparent'
}

interface IBackgroundStyleStore {
  activeBackground: boolean
  activeGrid: boolean
  activeCross: boolean
  activeTransparent: boolean
  togglePreference: (preference: TPreferenceBackgroundStyle) => void
}

const state: StateCreator<IBackgroundStyleStore> = (set, get) => ({
  activeBackground: true,
  activeGrid: true,
  activeCross: false,
  activeTransparent: false,
  togglePreference: preference => set(() => ({ [preference]: !get()[preference] }))
})

const backgroundStyleStore = create(persist(state, { name: 'backgroundStyle' }))

export default backgroundStyleStore
