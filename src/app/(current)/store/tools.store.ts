import { StateCreator, create } from 'zustand'

import { Tools } from './tools.types'

interface IToolsStore {
  fileName: string
  horizontalFlip: boolean
  verticalFlip: boolean
  horizontalMirror: boolean
  verticalMirror: boolean
  selectedTool: Tools

  setFileName: (fileName: string) => void
  setHorizontalFlip: (horizontalFlip: boolean) => void
  setVerticalFlip: (verticalFlip: boolean) => void
  setHorizontalMirror: (horizontalMirror: boolean) => void
  setVerticalMirror: (verticalMirror: boolean) => void
  setSelectedTool: (selectedTool: string) => void
}

const state: StateCreator<IToolsStore> = set => ({
  fileName: '',
  horizontalFlip: false,
  verticalFlip: false,
  horizontalMirror: false,
  verticalMirror: false,
  selectedTool: 'Brush',

  setFileName: fileName => set({ fileName }),
  setHorizontalFlip: horizontalFlip => set({ horizontalFlip }),
  setVerticalFlip: verticalFlip => set({ verticalFlip }),
  setHorizontalMirror: horizontalMirror => set({ horizontalMirror }),
  setVerticalMirror: verticalMirror => set({ verticalMirror }),
  setSelectedTool: selectedTool => set({ selectedTool: selectedTool as Tools })
})

const ToolsStore = create(state)

export default ToolsStore
