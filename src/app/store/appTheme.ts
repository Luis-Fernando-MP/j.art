import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

export const DEFAULT_THEME = 'Twilight Purple'

interface IAppThemeStore {
  appTheme: string
  setAppTheme: (appTheme: string) => void
  resetTheme: () => void
}

const state: StateCreator<IAppThemeStore> = set => ({
  appTheme: DEFAULT_THEME,
  setAppTheme: appTheme => set({ appTheme }),
  resetTheme: () => set({ appTheme: DEFAULT_THEME })
})

const AppThemeStore = create(persist(state, { name: 'j-art-theme' }))

export default AppThemeStore
