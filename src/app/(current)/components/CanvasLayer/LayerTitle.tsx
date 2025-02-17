import { CheckIcon } from 'lucide-react'
import { ChangeEvent, type JSX, memo, useEffect } from 'react'
import { useSessionStorage } from 'usehooks-ts'

interface ILayerTitle {
  changeTitle: (value: string) => void
  value: string
  idLayer: string
}

const LayerTitle = ({ changeTitle, value, idLayer }: ILayerTitle): JSX.Element => {
  const [localValue, setLocalValue, removeLocalValue] = useSessionStorage(idLayer, value)

  useEffect(() => {
    if (value === localValue) {
      removeLocalValue()
    }
  }, [value, localValue, removeLocalValue])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setLocalValue(newValue)
  }

  return (
    <div className='canvasLayer-title'>
      <input defaultValue={localValue} onChange={handleInputChange} />
      {localValue !== value && (
        <button onClick={() => changeTitle(localValue)}>
          <CheckIcon />
        </button>
      )}
    </div>
  )
}

export default memo(LayerTitle)
