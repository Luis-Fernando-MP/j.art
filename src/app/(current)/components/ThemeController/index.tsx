'use client'

import useAppTheme from '@/app/hooks/useAppTheme'
import { acl } from '@/shared/acl'
import Popup from '@/shared/components/Popup'
import { PopupPositions } from '@/shared/components/Popup/usePopup'
import { type JSX, MouseEvent, useState } from 'react'

import './style.scss'

const ThemeController = (): JSX.Element => {
  const [openThemes, setOpenThemes] = useState(false)
  const { appTheme, THEMES, handleSetTheme } = useAppTheme()
  const [positions, setPositions] = useState<PopupPositions>()

  const togglePopup = (e: MouseEvent): void => {
    setOpenThemes(!openThemes)
    setPositions({ x: e.clientX, y: e.clientY })
  }

  return (
    <section className='theme'>
      <button className='theme-controller' onClick={togglePopup}>
        <h5 className='footer-text'>Tema: {appTheme}</h5>
      </button>
      <Popup
        isOpen={openThemes}
        onClose={() => setOpenThemes(false)}
        title='Temas'
        className='theme-popup'
        clickPosition={positions}
      >
        {Object.entries(THEMES).map(current => {
          const [key, colors] = current
          return (
            <button
              key={key}
              onClick={() => handleSetTheme(key)}
              className={`theme-action ${acl(key === appTheme, 'selected')}`}
              style={{
                backgroundColor: `rgb(${colors['bg-primary']})`,
                borderColor: `rgb(${colors['bg-tertiary']})`
              }}
            >
              <div
                className='theme-action__circle'
                style={{
                  backgroundImage: `linear-gradient(45deg, rgb(${colors['tn-primary']}), rgb(${colors['tn-primary']}, 0.3), rgb(${colors['bg-primary']}) 80%)`
                }}
              />
              <div className='theme-action__blur' style={{ backgroundColor: `rgb(${colors['bg-secondary']})` }} />
              <h4
                style={{
                  backgroundColor: `rgb(${colors['bg-primary']}, .1)`,
                  color: `rgb(${colors['fnt-primary']})`
                }}
              >
                {key}
              </h4>
            </button>
          )
        })}
      </Popup>
    </section>
  )
}

export default ThemeController
