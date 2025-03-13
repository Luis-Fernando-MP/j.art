import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import './style.scss'

const SelectionLayout = () => {
  const { actParentId } = ActiveDrawsStore()
  const [currentFrame, setCurrentFrame] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const checkForFrame = () => {
      const $frame = document.getElementById(actParentId)
      if (!$frame) return
      setCurrentFrame($frame as HTMLDivElement)
    }

    checkForFrame()

    const observer = new MutationObserver(checkForFrame)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [actParentId])

  const renderPortal = useCallback(() => {
    return (
      <div className='selection' id='selection'>
        <div className='selection-action'>
          <h1>Selection Layout</h1>
        </div>
      </div>
    )
  }, [])

  if (!currentFrame) return null
  return createPortal(renderPortal(), currentFrame)
}

export default SelectionLayout
