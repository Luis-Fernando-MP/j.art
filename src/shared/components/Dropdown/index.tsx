import { acl } from '@/shared/acl'
import { newKey } from '@/shared/key'
import { JSX, useEffect, useRef, useState } from 'react'

import Option from './Option'
import './style.scss'

export type WithId = { id: string }

interface IDropdown<T extends WithId> {
  list: T[]
  className?: string
  onChange?: (child: T) => void
  revalidateChange?: (child: T) => void
  children: (item: T) => JSX.Element
}

const Dropdown = <T extends WithId>({ list, children, onChange, revalidateChange, className = '' }: IDropdown<T>) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<(T & WithId) | null>(list[0] ?? null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (list.length < 1) return
    const updatedItem = list.find(l => l.id === selectedItem?.id)
    if (!updatedItem) {
      revalidateChange && revalidateChange(list[0])
      return setSelectedItem(list[0])
    }
    if (updatedItem !== selectedItem) setSelectedItem(updatedItem)
  }, [list])

  if (list.length < 1 || !selectedItem) return null

  const handleSelectItem = (item: T & WithId): void => {
    setIsDropdownOpen(false)
    setSelectedItem(item)
    onChange && onChange(item)
  }

  return (
    <article className='dropdown' ref={dropdownRef}>
      <Option
        key={newKey(selectedItem.id)}
        item={selectedItem}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={acl(isDropdownOpen, 'showBorder')}
      >
        {item => children(item as T)}
      </Option>

      {isDropdownOpen && list.length > 1 && (
        <section className={`dropdown-menu ${className}`}>
          {list.map(item => {
            if (!selectedItem) return
            const className = acl(item.id === selectedItem.id, 'hidden')
            return (
              <Option key={newKey(item.id)} item={item} onClick={item => handleSelectItem(item as T)} className={className}>
                {item => children(item as T)}
              </Option>
            )
          })}
        </section>
      )}
    </article>
  )
}

export default Dropdown
