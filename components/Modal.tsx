import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import ReactPlayer from 'react-player/lazy'
import { FaPlay } from 'react-icons/fa'
import MuiModal from '@mui/material/Modal'
import { modalState } from '../atoms/modalAtom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Box, Typography } from '@mui/material'
import style from 'styled-jsx/style'
const Modal = () => {
  const [showModal, setShowModal] = useRecoilState(modalState)

  const handelClose = () => {
    setShowModal(false)
  }
  const toastStyle = {
    background: 'white',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '15px',
    borderRadius: '9999px',
    maxWidth: '1000px',
  }
  
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


  return (
    <MuiModal
    open={showModal}
    onClose={handelClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    className="modal modal-fx-fadeInScale modal-open modal-center modal-overflow modal-fullscreen modal-fullscreen-sm-down  "
  >
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Text in a modal
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </Typography>
    </Box>
  </MuiModal>
  )
}
 
export default Modal