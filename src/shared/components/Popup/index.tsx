import dynamic from 'next/dynamic'

const Popup = dynamic(() => import('./PopupComponent'), {
  ssr: false
})

export default Popup
