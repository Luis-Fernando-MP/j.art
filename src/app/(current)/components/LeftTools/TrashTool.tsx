'use client'

import { handleClearCanvas } from '@/scripts/toolsCanvas'
import { getContext } from '@/scripts/transformCanvas'
import type { JSX } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import { deleteTools } from '../../store/tools.types'

const TrashTool = (): JSX.Element => {
  const { actLayerId } = ActiveDrawsStore()

  return (
    <button
      className='tools-options__tool'
      onClick={() => {
        const { ctx } = getContext(actLayerId)
        handleClearCanvas(ctx)
      }}
    >
      <deleteTools.Trash />
    </button>
  )
}

export default TrashTool
