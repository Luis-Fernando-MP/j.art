import { type JSX } from 'react'
import { useDebounceCallback } from 'usehooks-ts'

interface ILayerTitle {
  onChange: (value: string) => void
  value: string
}

const LayerTitle = ({ onChange, value }: ILayerTitle): JSX.Element => {
  const debounced = useDebounceCallback(onChange, 500)

  return <input defaultValue={value} onChange={event => debounced(event.target.value)} />
}

export default LayerTitle
