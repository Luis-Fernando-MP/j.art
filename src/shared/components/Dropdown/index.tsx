import { acl } from '@/shared/acl'
import { newKey } from '@/shared/key'
import { JSX, ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import './style.scss'

interface WithId {
  id: string | number
}

interface IDropdown<T extends WithId> {
  renderClassName?: string
  className?: string
  onChange?: (child: T) => void
  selectedIndex?: number
  list: T[]
  render: (child: T) => ReactNode
}

const Dropdown = <T extends WithId>({
  list,
  render,
  onChange,
  renderClassName = '',
  className = ''
}: IDropdown<T>): JSX.Element => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T | null>(list[0])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!list.length) return setSelectedItem(null)
    if (!list.some(item => item.id === selectedItem?.id)) setSelectedItem(list[0])
  }, [list])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current || dropdownRef.current.contains(event.target as Node)) return
      setIsDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectItem = useCallback(
    (item: T): void => {
      setSelectedItem(item)
      setIsDropdownOpen(false)
      if (onChange) onChange(item)
    },
    [onChange]
  )

  return (
    <article className='dropdown' ref={dropdownRef}>
      {selectedItem && (
        <div role='button' tabIndex={0} className='dropdown-item' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div className={`dropdown-wrapper ${renderClassName}`}>{render(selectedItem)}</div>
        </div>
      )}
      {isDropdownOpen && list.length > 1 && (
        <section className={`dropdown-menu ${className}`}>
          {list.map(item => (
            <div
              role='button'
              tabIndex={0}
              className={`dropdown-item ${acl(item.id === selectedItem?.id, 'hidden')}`}
              key={newKey()}
              onClick={() => handleSelectItem(item)}
            >
              <div className={`dropdown-wrapper ${renderClassName}`}>{render(item)}</div>
            </div>
          ))}
        </section>
      )}
    </article>
  )
}

export default Dropdown
