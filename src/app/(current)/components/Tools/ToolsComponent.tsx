'use client'

import { acl } from '@/shared/acl'
import { drawingTools, shapeTools } from '@home-store/tools.types'
import ToolsStore from '@home/store/tools.store'
import { FlipHorizontal2Icon, FlipVertical2Icon } from 'lucide-react'
import type { JSX } from 'react'

import ColorsTool from '../ColorsTool'
import TransformTools from './TransformTools'

const ToolsComponent = (): JSX.Element => {
  const { xMirror, yMirror, selectedTool, setSelectedTool, setXMirror, setYMirror } = ToolsStore()

  return (
    <>
      <TransformTools />
      <section className='tools-section'>
        <h3 className='tools-title'>Herramientas</h3>

        <div className='tools-actions'>
          <div className='tools-options dark'>
            {Object.entries(drawingTools).map(tool => {
              const [key, Icon] = tool
              return (
                <button
                  key={key}
                  onClick={() => setSelectedTool(key)}
                  className={`tools-options__tool ${acl(selectedTool === key)}`}
                >
                  <Icon />
                </button>
              )
            })}
          </div>
        </div>

        <div className='tools-group dark'>
          <p className='tools-group__title'>Formas</p>
          <span className='tools-perfectShape' id='perfect-shape'>
            Perfect Shape
          </span>
          <div className='tools-options dark'>
            {Object.entries(shapeTools).map(tool => {
              const [key, Icon] = tool
              return (
                <button
                  key={key}
                  onClick={() => setSelectedTool(key)}
                  className={`tools-options__tool ${acl(selectedTool === key)}`}
                >
                  <Icon />
                </button>
              )
            })}
          </div>
        </div>

        <div className='tools-group dark'>
          <p className='tools-group__title'>Mirror</p>
          <div className='tools-group__options'>
            <button className={`${acl(xMirror)} tools-options__normal`} onClick={() => setXMirror(!xMirror)}>
              <FlipHorizontal2Icon />
            </button>
            <button className={`${acl(yMirror)} tools-options__normal`} onClick={() => setYMirror(!yMirror)}>
              <FlipVertical2Icon />
            </button>
          </div>
        </div>
        <ColorsTool />
      </section>
    </>
  )
}

export default ToolsComponent
