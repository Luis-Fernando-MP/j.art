import type { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, JSX, MouseEvent } from 'react'

import './style.scss'

interface IRange extends Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'children'> {
  rangeValue: number
  typeRange?: 'vertical' | 'horizontal'
  handleChange: (value: number) => void
  handleMouseUp?: (value: number) => void
}

const Range = ({
  className = '',
  typeRange = 'vertical',
  rangeValue,
  handleChange,
  handleMouseUp,
  ...props
}: IRange): JSX.Element => {
  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const value = Number(target.value)
    handleChange(value)
  }

  const handleInputUp = (event: MouseEvent<HTMLInputElement>) => {
    const value = Number(event.currentTarget.value)
    if (handleMouseUp) handleMouseUp(value)
  }

  return (
    <input
      className={`range ${typeRange} ${className}`}
      {...props}
      type='range'
      value={rangeValue}
      onChange={handleInputChange}
      onMouseUp={handleInputUp}
    />
  )
}

export default Range
