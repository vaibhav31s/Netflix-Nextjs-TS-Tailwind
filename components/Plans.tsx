import React from 'react'
import Image from 'next/image'
import { CheckIcon } from '@heroicons/react/24/outline'
import useAuth from '../hooks/useAuth'
import { Table } from '@mui/material'
const Plans = () => {
    const {logout}  = useAuth();
  return (
    
    <div>
    <div className='h-16 flex justify-between p-4 border-slate-500 border-b-2 '>
        <img src='https://rb.gy/ulxxee' className='fill' alt=''
              /> 
        <button onClick={logout}className='text-base antialiased	font-mono hover:underline 
'>Sing out</button>
              
    </div>

    <div className='flex flex-col font-sans subpixel-antialiased  	items-between justify-between pl-28 pt-2
 '>
        <h1 className='text-2xl font-semibold
'>Choose the plan that's right for you</h1>
        <p className='flex font-normal'><CheckIcon className='h-7 w-7   text-red-500 m-1' />Watch anywhere. Cancel anytime.</p>
        <p className='flex font-normal'><CheckIcon className='h-7 w-7  text-red-500 m-1'/>Recommendations just for you.</p>
        <p className='flex font-normal'><CheckIcon className='h-7 w-7  text-red-500 m-1'/>Change or cancel your plan anytime.</p>
    </div>
    <div className='mt-4 flex flex-col space-y-4'>
       <div className='flex w-full items-center justify-end self-end md:w-3/5'>
            <div className='planBox'>Standard</div>
            <div className='planBox'>Standard</div>
            <div className='planBox'>Standard</div>
            
       </div>
       {/* <Table></Table> */}
<button>Subscribe</button>
    </div>
        
    
    </div>
  )
}

export default Plans  