'use client'

import { handleClearCanvas } from '@/scripts/toolsCanvas'
import { getContext } from '@/scripts/transformCanvas'
import type { JSX } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import RepaintDrawingStore from '../../store/repaintDrawing.store'
import { deleteTools } from '../../store/tools.types'

const TrashTool = (): JSX.Element => {
  const { actLayerId } = ActiveDrawsStore()
  const { setRepaint } = RepaintDrawingStore()

  return (
    <button
      className='tools-options__tool'
      onClick={() => {
        const canvasRef = getContext(actLayerId)
        if (!canvasRef) return
        handleClearCanvas(canvasRef.ctx)
        setRepaint('all')
      }}
    >
      <deleteTools.Trash />
    </button>
  )
}

export default TrashTool
