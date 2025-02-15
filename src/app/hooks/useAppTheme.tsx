'use client'

import { AUDIOS, playAudio } from '@/shared/audio'
import { THEMES } from '@/shared/themes'
import { useLayoutEffect } from 'react'

import AppThemeStore from '../store/appTheme'

const useAppTheme = () => {
  const { appTheme, setAppTheme } = AppThemeStore()

  useLayoutEffect(() => {
    const root = document.documentElement
    const currentTheme = THEMES[appTheme]
    if (!currentTheme) return
    Object.entries(THEMES[appTheme]).forEach(([key, color]) => {
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
