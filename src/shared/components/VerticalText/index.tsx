import type { JSX } from 'react'

import './style.scss'

interface IVerticalText {
  children?: string
}

const VerticalText = ({ children }: IVerticalText): JSX.Element => {
  const mindWidth = `${children ? children.length * 9 : 100}px`
  return (
    <div className='verticalText'>
      <div className='verticalText-wrapper' style={{ height: mindWidth }}>
        <h5 className='verticalText-paragraph' style={{ width: mindWidth }}>
          {children}
        </h5>
      </div>
      <div className='verticalText-line' />
    </div>
  )
}

export default VerticalText
