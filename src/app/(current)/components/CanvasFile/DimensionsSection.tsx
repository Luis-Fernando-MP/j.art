import { acl } from '@/shared/acl'
import { defaultSizes } from '@/shared/constants'

import { getSize } from '../../hooks/useFileOptions'

interface IDimensionsSection {
  tmpDimensions: { width: number; height: number }
  setTmpDimensions: (dims: { width: number; height: number }) => void
}

const DimensionsSection = ({ setTmpDimensions, tmpDimensions }: IDimensionsSection) => {
  const { width: tmpW, height: tmpH } = tmpDimensions
  const dimensionsToString = `${tmpW}x${tmpH}`
  return (
    <section className='cnFile-dimensions'>
      <h3>DIMENSIONES</h3>
      <div className='cnFile-dimensions__wrapper'>
        {Object.entries(defaultSizes).map(([key, value]) => {
          const { w, h } = getSize(key as keyof typeof defaultSizes)

          return (
            <button
              type='button'
              key={value}
              className={`cnFile-option ${acl(value === dimensionsToString, 'selected')}`}
              onClick={() => setTmpDimensions({ width: w / 15, height: h / 15 })}
            >
              {value}
              <span>{key}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default DimensionsSection
