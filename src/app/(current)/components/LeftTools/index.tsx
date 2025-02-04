'use client'

import { acl } from '@/shared/acl'
import Logo from '@/shared/assets/Logo'
import { Trash2Icon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import type { JSX } from 'react'

import ToolsStore from '../../store/tools.store'
import { colorTools, deleteTools, drawTools, drawingTools, selectTools } from '../../store/tools.types'
import './style.scss'

interface ILeftTools {
  className?: string
}

const TrashTool = dynamic(() => import('./TrashTool'), {
  ssr: false,
  loading() {
    return <Trash2Icon />
  }
})

const LeftTools = ({ className = '' }: ILeftTools): JSX.Element => {
  const { selectedTool, setSelectedTool } = ToolsStore()

  return (
    <section className={`${className} leftTools`}>
      <div className='leftTools-logo'>
        <Logo />
        <h1>J-ART</h1>
      </div>
      <div className='leftTools-section'>
        {Object.entries(drawTools).map(tool => {
          const [key, Icon] = tool
          return (
            <button key={key} onClick={() => setSelectedTool(key)} className={`leftTools-tool ${acl(selectedTool === key)}`}>
              <Icon />
            </button>
          )
        })}
      </div>
      <div className='leftTools-section'>
        {Object.entries(selectTools).map(tool => {
          const [key, Icon] = tool
          return (
            <button key={key} onClick={() => setSelectedTool(key)} className={`leftTools-tool ${acl(selectedTool === key)}`}>
              <Icon />
            </button>
          )
        })}
      </div>
      <div className='leftTools-section'>
        {Object.entries(colorTools).map(tool => {
          const [key, Icon] = tool
          return (
            <button key={key} onClick={() => setSelectedTool(key)} className={`leftTools-tool ${acl(selectedTool === key)}`}>
              <Icon />
            </button>
          )
        })}
      </div>
      <div className='leftTools-section'>
        <button onClick={() => setSelectedTool('Eraser')} className={`leftTools-tool ${acl(selectedTool === 'Eraser')}`}>
          <deleteTools.Eraser />
        </button>
        <button onClick={() => {}}>
          <deleteTools.Trash />
        </button>
      </div>
    </section>
  )
}

export default LeftTools
