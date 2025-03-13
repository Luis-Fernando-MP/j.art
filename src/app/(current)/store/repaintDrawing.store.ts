import { BLANK_IMAGE } from '@/shared/constants'
import { StateCreator, create } from 'zustand'

import { Layer } from './layer.store'

export type Repaint = 'all' | 'layers' | 'frames' | 'zoom' | 'slider' | null
export interface FullRepaintCallback extends Layer {
  $canvas: HTMLCanvasElement | null
}

interface Props {
  repaint: Repaint
  setRepaint: (repaint?: Repaint) => void
  cleanViewerFrame: () => void
  fullRepaint: (callback: (layer: FullRepaintCallback) => void) => void
  setFullRepaint: (fullRepaint: Props['fullRepaint']) => void
}

const state: StateCreator<Props> = set => ({
  repaint: null,
  setRepaint: (repaint = 'all') => set({ repaint }),
  cleanViewerFrame: () => {
    const $viewerFrame = document.getElementById('viewer-frame')
    if ($viewerFrame instanceof HTMLImageElement) {
      $viewerFrame.src = BLANK_IMAGE
    }
  },
  fullRepaint: () => {},
  setFullRepaint: fullRepaint => set({ fullRepaint })
})

const RepaintDrawingStore = create(state)

export default RepaintDrawingStore
