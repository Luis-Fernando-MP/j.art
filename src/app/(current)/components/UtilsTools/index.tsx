'use client'

import { centerCanvasContent, flipHorizontal, flipVertical, getContext, rotateCanvas } from '@/scripts/transformCanvas'
import { acl } from '@/shared/acl'
import {
  AlignCenterVerticalIcon,
  FlipHorizontal2Icon,
  FlipHorizontalIcon,
  FlipVertical2Icon,
  FlipVerticalIcon,
  Rotate3DIcon
} from 'lucide-react'
import type { JSX } from 'react'

import ToolsStore from '../../store/tools.store'
import './style.scss'

const UtilsTools = (): JSX.Element => {
  const { xMirror, yMirror, setXMirror, setYMirror, horizontalFlip, verticalFlip, setHorizontalFlip, setVerticalFlip } =
    ToolsStore()

  return (
    <section className='utilsTools'>
      <div className='utilsTools-wrapper'>
        <p>Mirror</p>
        <div className='utilsTools-actions'>
          <button className={`${acl(xMirror)} active`} onClick={() => setXMirror(!xMirror)}>
            <FlipHorizontal2Icon />
          </button>
          <button className={`${acl(yMirror)}`} onClick={() => setYMirror(!yMirror)}>
            <FlipVertical2Icon />
          </button>
        </div>
      </div>

      <div className='utilsTools-wrapper'>
        <p>Flips</p>
        <div className='utilsTools-actions'>
          <button
            className={`${acl(horizontalFlip)}`}
            onClick={() => {
              const { ctx } = getContext()
              flipHorizontal(ctx)
              setHorizontalFlip(!horizontalFlip)
            }}
          >
            <FlipHorizontalIcon />
          </button>
          <button
            className={`${acl(verticalFlip)}`}
            onClick={() => {
              const { ctx } = getContext()
              flipVertical(ctx)
              setVerticalFlip(!verticalFlip)
            }}
          >
            <FlipVerticalIcon />
          </button>
        </div>
      </div>

      <div className='utilsTools-wrapper'>
        <p>Rotar</p>
        <div className='utilsTools-actions'>
          <button
            onClick={() => {
              const { ctx } = getContext()
              rotateCanvas(ctx, 90)
            }}
          >
            <Rotate3DIcon />
          </button>
          <button
            onClick={() => {
              const { ctx } = getContext()
              centerCanvasContent(ctx, 15)
            }}
          >
            <AlignCenterVerticalIcon />
          </button>
        </div>
      </div>
    </section>
  )
}

export default UtilsTools
