import { XIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import './styles/Image.css'

const Image = ({
  img = '',
  alt = 'Image',
  errIcon,
  contain = false,
  ignoreErr = false,
  classNameContainer = '',
  classNameImg = '',
  bigDisplay = false,
  style = {}
}) => {
  const [loading, setLoading] = useState(true)
  const [imgErr, setImgErr] = useState(false)
  const [isBigDisplay, setIsBigDisplay] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const handleError = useCallback(() => {
    if (!ignoreErr) setImgErr(true)
  }, [ignoreErr])

  const handleLoad = useCallback(() => {
    setLoading(false)
    setImgErr(false)
  }, [])

  useEffect(() => {
    const imgElement = imgRef.current
    if (!imgElement) return

    if (imgElement.complete) {
      setLoading(false)
    } else {
      setLoading(true)
      setImgErr(false)
      imgElement.addEventListener('load', handleLoad)
      imgElement.addEventListener('error', handleError)
    }

    return () => {
      imgElement.removeEventListener('load', handleLoad)
      imgElement.removeEventListener('error', handleError)
    }
  }, [handleLoad, handleError])

  return (
    <>
      {bigDisplay &&
        isBigDisplay &&
        !imgErr &&
        createPortal(
          <div className='image-big-display'>
            <button className='close-button' aria-label='Close' onClick={() => setIsBigDisplay(false)}>
              ✖
            </button>
            <div className='image-big-display-container'>
              <img src={img} alt={alt} />
            </div>
          </div>,
          document.body
        )}
      <div
        className={classNames('image-container', { 'image-error': imgErr, 'image-loading': loading }, classNameContainer)}
        style={style}
        onClick={() => bigDisplay && img && setIsBigDisplay(true)}
      >
        {imgErr && errIcon ? (
          <XIcon />
        ) : (
          <img
            ref={imgRef}
            className={classNames({ 'image-contain': contain }, classNameImg)}
            src={img}
            alt={alt}
            draggable='false'
            loading='lazy'
            onError={handleError}
          />
        )}
      </div>
    </>
  )
}

export default Image
