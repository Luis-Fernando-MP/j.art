import Board from '@/shared/components/Board'
import { type JSX } from 'react'

import AddFrame from './AddFrame'
import CanvasList from './CanvasList'
import './style.scss'

const BoardCanvas = (): JSX.Element => {
  return (
    <Board className='canvasBoard' isCenter={false}>
      {() => (
        <>
          <CanvasList />
          <AddFrame />
        </>
      )}
    </Board>
  )
}

export default BoardCanvas
