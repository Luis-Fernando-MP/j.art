import type { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, JSX, ReactNode } from 'react'

import './style.scss'

interface IVerticalRange extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
  rangeValue: number
  handleChange: (value: number) => void
}

const VerticalRange = ({ className, rangeValue, handleChange, ...props }: IVerticalRange): JSX.Element => {
  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const value = Number(target.value)
    handleChange(value)
  }

  return (
    <input type='range' className={`verticalRange ${className}`} {...props} value={rangeValue} onChange={handleInputChange} />
  )
}

export default VerticalRange
