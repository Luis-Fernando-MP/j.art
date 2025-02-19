import toast from 'react-hot-toast'

export const handleWorkerMessage = (workerRef: Worker | null, callback: (data: any) => void) => {
  if (!workerRef) return
  workerRef.onmessage = ({ data }) => {
    if (data.error) return console.error(data.error)
    if (data.warning) return toast.error(data.warning)
    callback(data)
  }
  workerRef.onerror = error => console.error('Worker Error:', error)
}
