import {
  BrushIcon,
  CircleIcon,
  EraserIcon,
  HeartIcon,
  HexagonIcon,
  HouseIcon,
  PaintBucketIcon,
  PenToolIcon,
  PentagonIcon,
  PipetteIcon,
  SlashIcon,
  SquareIcon,
  StarIcon,
  TorusIcon,
  Trash2Icon,
  TriangleIcon,
  TriangleRightIcon,
  XIcon
} from 'lucide-react'

import * as bre from '../helpers/bresenham'

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

export const drawingTools = {
  Brush: BrushIcon,
  Eraser: EraserIcon,
  PerfectPixel: PenToolIcon,
  Bucket: PaintBucketIcon,
  Pipette: PipetteIcon,
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
