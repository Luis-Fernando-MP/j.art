import { type JSX, memo } from 'react'

import { WithId } from '.'

interface IOption<T extends WithId> {
  item: T
  className?: string
  onClick: (item: T & WithId) => void
  children: (item: T) => JSX.Element
}

const Option = <T extends WithId>({ onClick, item, children, className = '' }: IOption<T>) => {
  return (
    <div role='button' tabIndex={0} className={`dropdown-item ${className}`} onClick={() => onClick(item)}>
      {children(item)}
    </div>
  )
}

export default memo(Option)
