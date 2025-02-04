'use client'

import { AUDIOS, playAudio } from '@/shared/audio'
import { THEMES } from '@/shared/themes'
import { useEffect } from 'react'

import AppThemeStore from '../store/appTheme'

const useAppTheme = () => {
  const { appTheme, setAppTheme } = AppThemeStore()

  useEffect(() => {
    console.log('exe')
    const root = document.documentElement
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
