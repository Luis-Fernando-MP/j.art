import { StateCreator, create } from 'zustand'

export enum Tools {
  Brush = 'Pincel',
  Eraser = 'Borrador',
  Bucket = 'Rellenar',
  Eyedropper = 'Cuentagotas',
  Transparency = 'Transparencia',
  Circle = 'Círculo',
  Square = 'Cuadrado',
  Triangle = 'Triángulo',
  Line = 'Línea',
  Shade = 'Sombrear',
  Lighten = 'Aclarar',
  Pixelate = 'Pixelar',
  Noise = 'Ruido',
  Gradient = 'Gradiente',
  Pattern = 'Patrón',
  Outline = 'Contorno',
  PerfectPixel = 'Pixel Perfect'
}

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
  setSelectedTool: (selectedTool: Tools) => void
}

const state: StateCreator<IToolsStore> = set => ({
  fileName: '',
  horizontalFlip: false,
  verticalFlip: false,
  horizontalMirror: false,
  verticalMirror: false,
  selectedTool: Tools.Brush,

  setFileName: fileName => set({ fileName }),
  setHorizontalFlip: horizontalFlip => set({ horizontalFlip }),
  setVerticalFlip: verticalFlip => set({ verticalFlip }),
  setHorizontalMirror: horizontalMirror => set({ horizontalMirror }),
  setVerticalMirror: verticalMirror => set({ verticalMirror }),
  setSelectedTool: selectedTool => set({ selectedTool })
})

const ToolsStore = create(state)

export default ToolsStore
