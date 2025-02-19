export const handleWorkerMessage = (workerRef: Worker | null, callback: (data: any) => void) => {
  if (!workerRef) return
  workerRef.onmessage = ({ data }) => {
    if (data.error) return console.log(data.error)
    callback(data)
  }
  workerRef.onerror = error => console.error('Worker Error:', error)
}
