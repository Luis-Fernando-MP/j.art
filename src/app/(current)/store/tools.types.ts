import * as bre from '@scripts/bresenham'
import {
  BrushIcon,
  CircleDashedIcon,
  CircleIcon,
  DicesIcon,
  EraserIcon,
  HeartIcon,
  HexagonIcon,
  HouseIcon,
  MousePointer2Icon,
  MoveIcon,
  PaintBucketIcon,
  PenOffIcon,
  PenToolIcon,
  PentagonIcon,
  PipetteIcon,
  SlashIcon,
  SquareDashed,
  SquareIcon,
  StarIcon,
  TorusIcon,
  Trash2Icon,
  TriangleIcon,
  TriangleRightIcon,
  WandIcon,
  XIcon
} from 'lucide-react'

export const shapeTools = {
  Square: SquareIcon,
  Circle: CircleIcon,
  Pentagon: PentagonIcon,
  Hexagon: HexagonIcon,
  Triangle: TriangleIcon,
  RightTriangle: TriangleRightIcon,
  Line: SlashIcon,
  X: XIcon,
  Torus: TorusIcon,
  Heart: HeartIcon,
  Star: StarIcon,
  House: HouseIcon
}

export const drawTools = {
  Cursor: MousePointer2Icon,
  Brush: BrushIcon,
  PerfectPixel: PenToolIcon,
  InvertBrush: PenOffIcon,
  Dithering: DicesIcon
}

export const selectTools = {
  Move: MoveIcon,
  SelectSquare: SquareDashed,
  SelectCircle: CircleDashedIcon,
  SelectWand: WandIcon
}

export const colorTools = {
  Bucket: PaintBucketIcon,
  Pipette: PipetteIcon
}

export const deleteTools = {
  Eraser: EraserIcon,
  Trash: Trash2Icon
}

export const utilityTools = {
  Shade: 'Sombrear',
  Transparency: 'Transparencia',
  Lighten: 'Aclarar',
  Noise: 'Ruido',
  Pattern: 'Patrón',
  Outline: 'Contorno',
  Gradient: 'Gradiente'
}

export const drawingTools = {
  ...drawTools,
  ...selectTools,
  ...colorTools,
  ...deleteTools
}

export type ShapeTools = keyof typeof shapeTools
export type DrawingTools = keyof typeof drawingTools
export type UtilityTools = keyof typeof utilityTools
export type Tools = ShapeTools | DrawingTools | UtilityTools

export const handleBresenhamTools: { [key in ShapeTools]: (props: bre.IShapeBresenham) => void } = {
  Square: bre.drawSquareBresenham,
  Circle: bre.drawCircleBresenham,
  Pentagon: bre.drawPentagonBresenham,
  Triangle: bre.drawTriangleBresenham,
  Line: bre.drawLineBresenham,
  RightTriangle: bre.drawRightTriangleBresenham,
  Hexagon: bre.drawHexagonBresenham,
  Torus: bre.drawTorusBresenham,
  Heart: bre.drawHeartBresenham,
  Star: bre.drawStarBresenham,
  House: bre.drawHouseBresenham,
  X: bre.drawXBresenham
}
