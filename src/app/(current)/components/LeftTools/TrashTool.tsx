'use client'

import { handleClearCanvas } from '@/scripts/toolsCanvas'
import { getContext } from '@/scripts/transformCanvas'
import { Trash2Icon } from 'lucide-react'
import type { JSX } from 'react'

const TrashTool = (): JSX.Element => {
  return (
    <button
      className='tools-options__tool'
      onClick={() => {
        const { ctx } = getContext()
        handleClearCanvas(ctx)
      }}
    >
      <Trash2Icon />
    </button>
  )
}

export default TrashTool
