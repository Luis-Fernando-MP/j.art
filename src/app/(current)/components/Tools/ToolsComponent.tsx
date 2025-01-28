'use client'

import { acl } from '@/shared/acl'
import CanvasStore from '@home/store/canvas.store'
import ToolsStore, { Tools } from '@home/store/tools.store'
import {
  AlignCenterVerticalIcon,
  BrushIcon,
  CircleIcon,
  EraserIcon,
  FlipHorizontal2Icon,
  FlipHorizontalIcon,
  FlipVertical2Icon,
  FlipVerticalIcon,
  HeartIcon,
  HexagonIcon,
  HouseIcon,
  PaintBucketIcon,
  PenToolIcon,
  PentagonIcon,
  PipetteIcon,
  Rotate3DIcon,
  SlashIcon,
  SquareIcon,
  StarIcon,
  TorusIcon,
  Trash2Icon,
  TriangleIcon,
  TriangleRightIcon,
  XIcon
} from 'lucide-react'
import type { JSX } from 'react'

import {
  centerCanvasContent,
  changeBrushSize,
  clearCanvas,
  flipHorizontal,
  flipVertical,
  getContext,
  rotateCanvas
} from '../../helpers/canvas.utils'

const ToolsComponent = (): JSX.Element => {
  const {
    fileName,
    horizontalFlip,
    verticalFlip,
    horizontalMirror,
    verticalMirror,
    selectedTool,
    setHorizontalFlip,
    setFileName,
    setHorizontalMirror,
    setSelectedTool,
    setVerticalFlip,
    setVerticalMirror
  } = ToolsStore()

  const { pixelColor, pixelOpacity, pixelSize, setPixelSize } = CanvasStore()

  const handleSetTool = (tool: Tools): void => {
    setSelectedTool(tool)
  }

  return (
    <>
      <section className='tools-section'>
        <h3>Transformaciones</h3>
        <div className='tools-section__wrapper center'>
          {[1, 2, 3, 4, 3, 2, 1].map(size => {
            const key = `${size}-${Math.random()}-brush`
            const boxSize = 15 * size
            return (
              <button
                key={key}
                className={`tools-section__size ${acl(boxSize === pixelSize)}`}
                onClick={() => {
                  changeBrushSize(boxSize)
                  setPixelSize(boxSize)
                }}
                style={{
                  width: `${boxSize * 0.5}px`,
                  height: `${boxSize * 0.5}px`,
                  borderRadius: `${size}px`
                }}
              />
            )
          })}
        </div>

        <div className='tools-section__wrapper'>
          <p>Flips</p>
          <div className='tools-section__options'>
            <button
              className={acl(horizontalFlip)}
              onClick={() => {
                const { ctx } = getContext()
                flipHorizontal(ctx)
                setHorizontalFlip(!horizontalFlip)
              }}
            >
              <FlipHorizontalIcon />
            </button>
            <button
              className={acl(verticalFlip)}
              onClick={() => {
                const { ctx } = getContext()
                flipVertical(ctx)
                setVerticalFlip(!verticalFlip)
              }}
            >
              <FlipVerticalIcon />
            </button>
          </div>
        </div>

        <div className='tools-section__wrapper'>
          <p>Rotación</p>
          <div className='tools-section__options'>
            <button
              onClick={() => {
                const { ctx } = getContext()
                rotateCanvas(ctx, 90)
              }}
            >
              <Rotate3DIcon />
            </button>
            <button
              onClick={() => {
                const { ctx } = getContext()
                console.log('---', pixelSize)

                centerCanvasContent(ctx, pixelSize)
              }}
            >
              <AlignCenterVerticalIcon />
            </button>
          </div>
        </div>
      </section>
      <section className='tools-section'>
        <h3>Herramientas</h3>

        <div className='tools-section__wrapper dark'>
          <div className='tools-section__options tools-section__actions'>
            <button
              className={`${acl(selectedTool === Tools.Brush)}`}
              onClick={() => {
                setSelectedTool(Tools.Brush)
              }}
            >
              <BrushIcon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.Eraser)}`}
              onClick={() => {
                setSelectedTool(Tools.Eraser)
              }}
            >
              <EraserIcon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.Bucket)}`}
              onClick={() => {
                setSelectedTool(Tools.Bucket)
              }}
            >
              <PaintBucketIcon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.Pipette)}`}
              onClick={() => {
                setSelectedTool(Tools.Pipette)
              }}
            >
              <PipetteIcon />
            </button>
            <button
              onClick={() => {
                const { ctx } = getContext()
                clearCanvas(ctx)
              }}
            >
              <Trash2Icon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.PerfectPixel)}`}
              onClick={() => {
                setSelectedTool(Tools.PerfectPixel)
              }}
            >
              <PenToolIcon />
            </button>
          </div>
        </div>

        <div className='tools-section__wrapper col dark'>
          <p>Formas</p>
          <span className='tools-options__perfect active' id='perfect-shape'>
            Perfect Shape
          </span>
          <div className='tools-section__options tools-section__actions'>
            <button
              className={`${acl(selectedTool === Tools.Square)}`}
              onClick={() => {
                setSelectedTool(Tools.Square)
              }}
            >
              <SquareIcon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.Circle)}`}
              onClick={() => {
                setSelectedTool(Tools.Circle)
              }}
            >
              <CircleIcon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.Pentagon)}`}
              onClick={() => {
                setSelectedTool(Tools.Pentagon)
              }}
            >
              <PentagonIcon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.Triangle)}`}
              onClick={() => {
                setSelectedTool(Tools.Triangle)
              }}
            >
              <TriangleIcon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.Line)}`}
              onClick={() => {
                setSelectedTool(Tools.Line)
              }}
            >
              <SlashIcon />
            </button>

            <button
              className={`${acl(selectedTool === Tools.RightTriangle)}`}
              onClick={() => {
                setSelectedTool(Tools.RightTriangle)
              }}
            >
              <TriangleRightIcon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.X)}`}
              onClick={() => {
                setSelectedTool(Tools.X)
              }}
            >
              <XIcon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.Torus)}`}
              onClick={() => {
                setSelectedTool(Tools.Torus)
              }}
            >
              <TorusIcon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.Heart)}`}
              onClick={() => {
                setSelectedTool(Tools.Heart)
              }}
            >
              <HeartIcon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.Star)}`}
              onClick={() => {
                setSelectedTool(Tools.Star)
              }}
            >
              <StarIcon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.House)}`}
              onClick={() => {
                setSelectedTool(Tools.House)
              }}
            >
              <HouseIcon />
            </button>
            <button
              className={`${acl(selectedTool === Tools.Hexagon)}`}
              onClick={() => {
                setSelectedTool(Tools.Hexagon)
              }}
            >
              <HexagonIcon />
            </button>
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
