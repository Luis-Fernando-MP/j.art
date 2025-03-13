'use client'

import { acl } from '@/shared/acl'
import Logo from '@/shared/assets/Logo'
import dynamic from 'next/dynamic'
import type { JSX } from 'react'

import ToolsStore from '../../store/tools.store'
import { Tools, colorTools, deleteTools, drawTools, selectTools } from '../../store/tools.types'
import './style.scss'

interface ILeftTools {
  className?: string
}

const TrashTool = dynamic(() => import('./TrashTool'), {
  ssr: false,
  loading() {
    return <deleteTools.Trash />
  }
})

const LeftTools = ({ className = '' }: ILeftTools): JSX.Element => {
  const { selectedTool, setSelectedTool } = ToolsStore()

  return (
    <section className={`${className} leftTools`}>
      <div className='leftTools-logo active'>
        <Logo />
        <h1>J-ART</h1>
      </div>
      <div className='leftTools-section'>
        {Object.entries(drawTools).map(tool => {
          const [key, Icon] = tool
          return (
            <button
              key={key}
              onClick={() => setSelectedTool(key as Tools)}
              className={`leftTools-tool ${acl(selectedTool === key, 'selected')}`}
            >
              <Icon />
            </button>
          )
        })}
      </div>
      <div className='leftTools-section'>
        {Object.entries(selectTools).map(tool => {
          const [key, Icon] = tool
          return (
            <button
              key={key}
              onClick={() => setSelectedTool(key as Tools)}
              className={`leftTools-tool ${acl(selectedTool === key, 'selected')}`}
            >
              <Icon />
            </button>
          )
        })}
      </div>
      <div className='leftTools-section'>
        {Object.entries(colorTools).map(tool => {
          const [key, Icon] = tool
          return (
            <button
              key={key}
              onClick={() => setSelectedTool(key as Tools)}
              className={`leftTools-tool ${acl(selectedTool === key, 'selected')}`}
            >
              <Icon />
            </button>
          )
        })}
      </div>
      <div className='leftTools-section'>
        <button
          onClick={() => setSelectedTool('Eraser')}
          className={`leftTools-tool ${acl(selectedTool === 'Eraser', 'selected')}`}
        >
          <deleteTools.Eraser />
        </button>
        <TrashTool />
      </div>
    </section>
  )
}

export default LeftTools
