'use client'

import useAppTheme from '@/app/hooks/useAppTheme'
import { acl } from '@/shared/acl'
import Popup from '@/shared/components/Popup'
import { type JSX, useState } from 'react'

import './style.scss'

const ThemeController = (): JSX.Element => {
  const [openThemes, setOpenThemes] = useState(false)
  const { appTheme, THEMES, handleSetTheme } = useAppTheme()
  const togglePopup = (): void => {
    setOpenThemes(!openThemes)
  }

  return (
    <section className='theme'>
      <button className='theme-controller' onClick={togglePopup}>
        {appTheme}
      </button>
      <Popup isOpen={openThemes} onClose={togglePopup} title='Temas' className='theme-popup'>
        {Object.entries(THEMES).map(current => {
          const [key, colors] = current
          return (
            <button
              key={key}
              onClick={() => handleSetTheme(key)}
              className={`theme-action ${acl(key === appTheme)}`}
              style={{
                backgroundColor: `rgb(${colors['tn-primary']})`
              }}
            >
              <p style={{ color: `rgb(${colors['fnt-primary']})`, backgroundColor: `rgb(${colors['bg-primary']})` }}>{key}</p>
              <div
                className='theme-colors'
                style={{
                  backgroundColor: `rgb(${colors['tn-primary']})`
                }}
              >
                <div style={{ backgroundColor: `rgb(${colors['bg-primary']})` }} />
                <div style={{ backgroundColor: `rgb(${colors['fnt-primary']})` }} />
                <div style={{ backgroundColor: `rgb(${colors['tn-secondary']})` }} />
              </div>
            </button>
          )
        })}
      </Popup>
    </section>
  )
}

export default ThemeController
