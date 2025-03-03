export interface ArtData {
  website: string
  extension: string
  author: string
  contact: string
  width: number
  height: number
  title: string
  created_at: number
  updated_at: number
  actFrameId: string
  actFrameIndex: number
  actLayerId: string
  frames: Frame[]
}

export interface Frame {
  speed: number
  id: string
  layers: LayerFile[]
}

export interface LayerFile {
  id: string
  title: string
  parentId: string
  imageUrl: string | null
  canvasUrl: string | null
  isWatching: boolean
  filters: {
    opacity: number
    hue: number
  }
}
