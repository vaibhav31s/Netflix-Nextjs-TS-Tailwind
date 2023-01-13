import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import ReactPlayer from 'react-player/lazy'
import { FaPlay } from 'react-icons/fa'
import MuiModal from '@mui/material/Modal'
import { modalState } from '../atoms/modalAtom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Box, Typography } from '@mui/material'
import Modal from '../components/Modal'
const demo = () => {
  const [showModal, setShowModal] = useRecoilState(modalState)
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
  const handelClose = () => {
    setShowModal(false)
  console.log('close');
  
  }
  const handleOpen = () => {
    setShowModal(true)
  console.log('iopne');
  console.log(showModal);
  
  }
  return (
    <>
      <button onClick={()=>handleOpen()}> Click here </button>
      <Modal/>
      </>
  )
}

export default demo