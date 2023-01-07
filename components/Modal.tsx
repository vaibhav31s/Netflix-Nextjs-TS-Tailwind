import MuiModal from '@mui/material/Modal'
import { useRecoilState, useRecoilValue } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import { XMarkIcon } from '@heroicons/react/24/outline'
const Modal = () => {
  const [showModal, setShowModal] = useRecoilState(modalState)

  const handelClose = () => {
    setShowModal(false)
  }

  return (
    <MuiModal
    open={showModal}
    onClose={handelClose} >
      <>
        <button onClick={handelClose} className='modalButton absolute right-5 top-5 !z-40'>
          <XMarkIcon className='h-6 w-6 text-white' />
      <h1>sadlfjal;</h1>
        </button>
      
      </>
      
    </MuiModal>
  )
}
 
export default Modal