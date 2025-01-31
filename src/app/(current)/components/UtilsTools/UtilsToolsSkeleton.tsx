import { JSX } from 'react'

const UtilsToolsSkeleton = (): JSX.Element => {
  return (
    <section className='utilsTools'>
      <div className='utilsTools-wrapper loading'></div>
      <div className='utilsTools-wrapper loading'></div>
      <div className='utilsTools-wrapper loading'></div>
    </section>
  )
}

export default UtilsToolsSkeleton
