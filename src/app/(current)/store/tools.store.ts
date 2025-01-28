import { StateCreator, create } from 'zustand'

export enum Tools {
  Brush = 'Pincel',
  PerfectPixel = 'Pixel Perfect',
  Eraser = 'Borrador',
  Bucket = 'Rellenar',
  Pipette = 'Cuentagotas',

  // utilidades
  Shade = 'Sombrear',
  Transparency = 'Transparencia',
  Lighten = 'Aclarar',
  Noise = 'Ruido',
  Pattern = 'Patrón',
  Outline = 'Contorno',
  Gradient = 'Gradiente',

  // formas
  Square = 'Cuadrado',
  Circle = 'Círculo',
  Pentagon = 'Pentágono',
  Hexagon = 'Hexágono',
  Triangle = 'Triángulo',
  RightTriangle = 'Triángulo-horizontal',
  Line = 'Línea',
  X = 'Aspa',
  Torus = 'Dona',
  Heart = 'Corazón',
  Star = 'Estrella',
  House = 'Casa'
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
