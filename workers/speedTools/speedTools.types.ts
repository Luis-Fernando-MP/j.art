export enum EToolsWorker {
  BUCKET = 'bucket',
  PIPETTE = 'pipette'
}
export interface ToolsWorkerMessage {
  bitmap?: ImageBitmap
  action?: EToolsWorker
  startX?: number
  startY?: number
  fillColor?: string
}
export type WorkerEvent = MessageEvent<ToolsWorkerMessage>
