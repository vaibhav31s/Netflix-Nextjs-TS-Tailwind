import React from 'react'
import { baseUrl, baseUrlImage } from '../constants/movie';
import { Movie } from '../typing';
import  Image  from 'next/image'
import { useRecoilState } from 'recoil';
import { modalState, movieState } from '../atoms/modalAtom';
interface Props {
    //for firebase use document
    // movie:Movie | DocumentData;
    movie:Movie;
}

const Thumbnail = ({movie}:Props) => {
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState)


  const handelClose = () => {
    setShowModal(false)
  }
  return (
    <div className='relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-105'
      onClick={()=>{setCurrentMovie(movie); setShowModal(true)}}
    >
        <Image  src={`${baseUrlImage}${movie.backdrop_path || movie.poster_path}`}  className='rounded-sm object-cover md:rounded' layout='fill' alt={''}/>
    </div>
  )
}

export default Thumbnail