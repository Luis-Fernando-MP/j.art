'use client'

import { acl } from '@/shared/acl'
import ToolsStore from '@home/store/tools.store'
import { FlipHorizontal2Icon, FlipVertical2Icon } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { JSX } from 'react'

import { drawingTools, shapeTools } from '../../store/tools.types'

const TransformTools = dynamic(() => import('../TransformTools'), {
  ssr: false,
  loading() {
    return <p>loading</p>
  }
})

const ToolsComponent = (): JSX.Element => {
  const { horizontalMirror, verticalMirror, selectedTool, setSelectedTool } = ToolsStore()

  return (
    <>
      <TransformTools />
      <section className='tools-section'>
        <h3>Herramientas</h3>

        <div className='tools-section__wrapper dark'>
          <div className='tools-section__options tools-section__actions'>
            {Object.entries(drawingTools).map(tool => {
              const [key, Icon] = tool
              return (
                <button
                  key={key}
                  onClick={() => setSelectedTool(key)}
                  className={`${acl(selectedTool === key)}`}
                >
                  <Icon />
                </button>
              )
            })}
          </div>
        </div>

        <div className='tools-section__wrapper col dark'>
          <p>Formas</p>
          <span className='tools-options__perfect active' id='perfect-shape'>
            Perfect Shape
          </span>
          <div className='tools-section__options tools-section__actions'>
            {Object.entries(shapeTools).map(tool => {
              const [key, Icon] = tool
              return (
                <button
                  key={key}
                  onClick={() => setSelectedTool(key)}
                  className={`${acl(selectedTool === key)}`}
                >
                  <Icon />
                </button>
              )
            })}
          </div>
        </div>

        <div className='tools-section__wrapper dark'>
          <p>Mirror</p>
          <div className='tools-section__options'>
            <button className={acl(horizontalMirror)}>
              <FlipHorizontal2Icon />
            </button>
            <button className={acl(verticalMirror)}>
              <FlipVertical2Icon />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default ToolsComponent
