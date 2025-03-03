import Popup from '@/shared/components/Popup'
import { ImagePlusIcon, PencilRulerIcon } from 'lucide-react'
import { JSX } from 'react'

import useFileOptions from '../../hooks/useFileOptions'
import UploadArtFile from '../UploadArtFile'
import DimensionsSection from './DimensionsSection'
import DownloadCanvas from './DownloadCanvas'

interface IFilePopup {
  isOpen: boolean
  setOpen: (isOpen?: boolean) => void
}

const FilePopup = ({ isOpen, setOpen }: IFilePopup): JSX.Element => {
  const { title, handleSubmit, $formRef, tmpDimensions, setTmpDimensions, handleResetForm, handleNewDraw } = useFileOptions()

  return (
    <Popup isOpen={isOpen} onClose={() => setOpen(false)} className='cnFile-popup' title='Archivo'>
      <div className='cnFile-title'>
        <h3>Mi</h3>
        <h2>{title}</h2>
      </div>

      <form className='cnFile-form' onSubmit={handleSubmit} ref={$formRef}>
        <div className='cnFile-form__wrapper'>
          <section className='cnFile-info'>
            <div className='cnFile-info__field'>
              <p>Ancho</p>
              <input
                type='number'
                name='width'
                value={tmpDimensions.width}
                max={1000}
                min={8}
                onChange={e => setTmpDimensions({ ...tmpDimensions, width: Number(e.target.value) })}
              />
            </div>

            <div className='cnFile-info__field'>
              <p>Alto</p>
              <input
                type='number'
                name='height'
                value={tmpDimensions.height}
                max={1000}
                min={8}
                onChange={e => setTmpDimensions({ ...tmpDimensions, height: Number(e.target.value) })}
              />
            </div>

            <div className='cnFile-info__field title'>
              <p>Título</p>
              <input type='text' name='title' defaultValue={title} />
            </div>

            <button type='button' className='cnFile-resetForm' onClick={handleResetForm}>
              Restablecer
            </button>
          </section>

          <DimensionsSection setTmpDimensions={setTmpDimensions} tmpDimensions={tmpDimensions} />
        </div>

        <div className='cnFile-actions'>
          <button type='submit' className='cnFile-action active'>
            <PencilRulerIcon />
            Redimensionar
          </button>

          <button type='button' data-ignore-click className='cnFile-action' onClick={handleNewDraw}>
            <ImagePlusIcon />
            Crear
          </button>
        </div>
      </form>

      <DownloadCanvas />
      <UploadArtFile closePopup={() => setOpen(false)} />
    </Popup>
  )
}

export default FilePopup
