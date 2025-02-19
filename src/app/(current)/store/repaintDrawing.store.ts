import { BLANK_IMAGE } from '@/shared/constants'
import { StateCreator, create } from 'zustand'

export type Repaint = 'all' | 'layers' | 'frames' | 'zoom' | 'slider' | null
interface IRepaintDrawingStore {
  repaint: Repaint
  setRepaint: (repaint?: Repaint) => void
  cleanViewerFrame: () => void
}

const state: StateCreator<IRepaintDrawingStore> = set => ({
  repaint: null,
  setRepaint: (repaint = 'all') => set({ repaint }),
  cleanViewerFrame: () => {
    const $viewerFrame = document.getElementById('viewer-frame')
    if ($viewerFrame instanceof HTMLImageElement) {
      $viewerFrame.src = BLANK_IMAGE
    }
  }
})

const RepaintDrawingStore = create(state)

export default RepaintDrawingStore
