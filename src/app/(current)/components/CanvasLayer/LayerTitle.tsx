import { CheckIcon } from 'lucide-react'
import { type JSX, memo, useRef, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'

interface ILayerTitle {
  changeTitle: (value: string) => void
  value: string
}

const LayerTitle = ({ changeTitle, value }: ILayerTitle): JSX.Element => {
  const [inputValue, setInputValue] = useState(value)
  const $inputRef = useRef<HTMLInputElement>(null)

  const debounced = useDebounceCallback(v => {
    setInputValue(v)
  }, 500)

  return (
    <div className='canvasLayer-title'>
      <input defaultValue={inputValue} onChange={debounced} ref={$inputRef} />
      {inputValue !== value && (
        <button onClick={() => changeTitle(inputValue)}>
          <CheckIcon />
        </button>
      )}
    </div>
  )
}

export default memo(LayerTitle)
