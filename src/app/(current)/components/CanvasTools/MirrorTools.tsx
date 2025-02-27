import { acl } from '@/shared/acl'
import { FlipHorizontal2Icon, FlipVertical2Icon } from 'lucide-react'
import type { JSX } from 'react'

import ToolsStore from '../../store/tools.store'

const MirrorTools = (): JSX.Element => {
  const { setXMirror, setYMirror, yMirror, xMirror } = ToolsStore()

  return (
    <div className='utilityTools-actions'>
      <button className={`utilityTools-mirror ${acl(xMirror, 'selected')}`} onClick={() => setXMirror(!xMirror)}>
        <FlipHorizontal2Icon />
      </button>
      <button className={`utilityTools-mirror ${acl(yMirror, 'selected')}`} onClick={() => setYMirror(!yMirror)}>
        <FlipVertical2Icon />
      </button>
    </div>
  )
}

export default MirrorTools
