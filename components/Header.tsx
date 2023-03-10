import {MagnifyingGlassIcon ,BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const {logout,user} = useAuth();
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 0) {
          setIsScrolled(true)
        } else {
          setIsScrolled(false)
        }
      }
  
      window.addEventListener('scroll', handleScroll)
  
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }, [])
    
  return (
    <header className={`${isScrolled ? 'bg-[#141414]' :'bg-transparent'}`}>
    {/* // <header className={'bg-transparent'}> */}
      <div className="flex items-center space-x-2 md:space-x-10 ">
        <img
          src="https://rb.gy/ulxxee"
          width={100}
          height={100}
          alt=""
          className="cursor-pointer object-contain"
        />
        <ul className="hidden space-x-4 md:flex" >
            <li>Home</li>
            <li>Tv Shows</li>
            <li>Movies</li>
            <li>New & popular</li>
            <li>My List</li>
        </ul>
        </div>
        <div className='flex items-center space-x-4 font-light'>
            <MagnifyingGlassIcon className="hidden h-6 w-6 sm:inline " />  
            <p className='hidden lg:inline'>{user?.email}</p>  
            <BellIcon className="h-6 w-6 " />
            <Link onClick={()=>{
               logout();
            }}href="/login">
                <img
                src="https://rb.gy/g1pwyx"
                alt=""
                className="cursor-pointer rounded"
                />
            </Link>
        </div>
    </header>
  )
}



export default Header