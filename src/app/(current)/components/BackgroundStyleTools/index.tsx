import { acl } from '@/shared/acl'
import { type JSX, useLayoutEffect } from 'react'

import backgroundStyleStore, { TPreferenceBackgroundStyle, backgroundStyleClassList } from '../../store/backgroundStyleStore'
import './style.scss'

const { classList: cl } = document.body

const BackgroundStyleTools = (): JSX.Element => {
  const { activeBackground, activeGrid, activeCross, activeTransparent, togglePreference } = backgroundStyleStore()

  useLayoutEffect(() => {
    cl.toggle(backgroundStyleClassList.background, activeBackground)
    cl.toggle(backgroundStyleClassList.grid, activeGrid)
    cl.toggle(backgroundStyleClassList.cross, activeCross)
    cl.toggle(backgroundStyleClassList.transparent, activeTransparent)
  }, [activeBackground, activeGrid, activeCross, activeTransparent])

  const handleToggleClass = (preference: TPreferenceBackgroundStyle) => {
    togglePreference(preference)
  }

  return (
    <section className='bgStyle'>
      <div className={`bgStyle-box ${acl(activeBackground, 'selected')}`}>
        <button onClick={() => handleToggleClass('activeBackground')}>background</button>
        <div className='bgStyle-circle'></div>
      </div>
      <div className={`bgStyle-box ${acl(activeGrid, 'selected')}`}>
        <button onClick={() => handleToggleClass('activeGrid')}>Rejilla</button>
        <div className='bgStyle-circle'></div>
      </div>
      <div className={`bgStyle-box ${acl(activeCross, 'selected')}`}>
        <button onClick={() => handleToggleClass('activeCross')}>Cruz</button>
        <div className='bgStyle-circle'></div>
      </div>
      <div className={`bgStyle-box ${acl(activeTransparent, 'selected')}`}>
        <button onClick={() => handleToggleClass('activeTransparent')}>Transparente</button>
        <div className='bgStyle-circle'></div>
      </div>
    </section>
  )
}

export default BackgroundStyleTools
