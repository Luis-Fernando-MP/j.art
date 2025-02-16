'use client'

import { AUDIOS, playAudio } from '@/shared/audio'
import { THEMES } from '@/shared/themes'
import { useLayoutEffect } from 'react'

import AppThemeStore, { DEFAULT_THEME } from '../store/appTheme'

const useAppTheme = () => {
  const { appTheme, setAppTheme } = AppThemeStore()

  useLayoutEffect(() => {
    const root = document.documentElement
    let currentTheme = THEMES[appTheme]
    if (!currentTheme) currentTheme = THEMES[DEFAULT_THEME]

    Object.entries(currentTheme).forEach(([key, color]) => {
      root.style.setProperty(`--${key}`, `${color}`)
    })
  }, [appTheme])

  const handleSetTheme = (selectTheme: string): void => {
    if (appTheme === selectTheme) {
      return playAudio(AUDIOS.ERROR)
    }
    playAudio(AUDIOS.CHANGE)
    setAppTheme(selectTheme)
  }

  return { appTheme, handleSetTheme, THEMES }
}

export default useAppTheme
