import Range from '@/shared/components/Range'
import { CircleDotDashedIcon } from 'lucide-react'
import { type JSX, useEffect, useState } from 'react'

import ActiveDrawsStore from '../../store/ActiveDraws.store'
import LayerStore from '../../store/layer.store'
import RepaintDrawingStore from '../../store/repaintDrawing.store'

const HueRange = (): JSX.Element => {
  const { actLayerId, actParentId } = ActiveDrawsStore()
  const { listOfLayers, updateLayer } = LayerStore()
  const { setRepaint } = RepaintDrawingStore()

  const [hue, setHue] = useState(0)

  useEffect(() => {
    const parent = listOfLayers[actParentId]
    if (!parent) return
    const currentLayer = parent.find(l => l.id === actLayerId)
    if (!currentLayer) return
    setHue(currentLayer.hue)
  }, [actLayerId, listOfLayers, setHue, actParentId])

  const handleChangeHue = (angle: number): void => {
    const canvas = document.getElementById(actLayerId)
    if (!(canvas instanceof HTMLCanvasElement)) return
    canvas.style.filter = `hue-rotate(${angle}deg)`
    setHue(angle)
  }

  const handleFinalHue = (angle: number): void => {
    updateLayer({
      layer: { id: actLayerId, hue: angle },
      parentId: actParentId
    })
    setRepaint('all')
  }

  return (
    <div className='canvasRangeTools-container'>
      <h4 className='canvasRangeTools-paragraph'>{hue}deg Hue</h4>
      <Range rangeValue={hue} max={360} handleChange={handleChangeHue} handleMouseUp={handleFinalHue} />
      <CircleDotDashedIcon />
    </div>
  )
}

export default HueRange
