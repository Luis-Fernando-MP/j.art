'use client'

import { acl } from '@/shared/acl'
import VerticalText from '@/shared/components/VerticalText'
import { Trash2Icon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import type { JSX } from 'react'

import ToolsStore from '../../store/tools.store'
import { drawingTools } from '../../store/tools.types'
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
        <div>
          <Image src='/logo.svg' alt='j-art' width={20} height={20} />
          <h1>J-ART</h1>
        </div>
      </div>
      <VerticalText>Herramientas</VerticalText>
      <div className='leftTools-drawingTools'>
        {Object.entries(drawingTools).map(tool => {
          const [key, Icon] = tool
          return (
            <button
              key={key}
              onClick={() => setSelectedTool(key)}
              className={`leftTools-drawingTool ${acl(selectedTool === key)}`}
            >
              <Icon />
            </button>
          )
        })}
        <TrashTool />
      </div>
    </section>
  )
}

export default LeftTools
