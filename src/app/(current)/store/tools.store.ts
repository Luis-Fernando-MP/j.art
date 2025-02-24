import { StateCreator, create } from 'zustand'

import { Tools } from './tools.types'

interface IToolsStore {
  fileName: string
  horizontalFlip: boolean
  verticalFlip: boolean
  xMirror: boolean
  yMirror: boolean
  selectedTool: Tools

  setFileName: (fileName: string) => void
  setHorizontalFlip: (horizontalFlip: boolean) => void
  setVerticalFlip: (verticalFlip: boolean) => void
  setXMirror: (xMirror: boolean) => void
  setYMirror: (yMirror: boolean) => void
  setSelectedTool: (selectedTool: Tools) => void
}

const state: StateCreator<IToolsStore> = set => ({
  fileName: '',
  horizontalFlip: false,
  verticalFlip: false,
  xMirror: false,
  yMirror: false,
  selectedTool: 'Brush',

  setFileName: fileName => set({ fileName }),
  setHorizontalFlip: horizontalFlip => set({ horizontalFlip }),
  setVerticalFlip: verticalFlip => set({ verticalFlip }),
  setXMirror: xMirror => set({ xMirror }),
  setYMirror: yMirror => set({ yMirror }),
  setSelectedTool: selectedTool => set({ selectedTool: selectedTool as Tools })
})

const ToolsStore = create(state)

export default ToolsStore
