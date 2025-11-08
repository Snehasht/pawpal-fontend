import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {

  const navigate = useNavigate()
  return (
    <div className='flex flex-col md:flex-row bg-[#60A5FA] rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 relative overflow-hidden md:overflow-visible'>
      {/*------left side ------*/}
      <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
        <div className='text-white'>
            <p className='text-xl sm:text-2xl font-semibold'>Find your perfect companion.</p>
            <p className='text-md sm:text-lg mt-2'>Adopt. Foster. Love. Care.</p>
        </div>
        <button onClick={()=>{navigate('/Login'); scrollTo(0,0)}} className='text-sm sm:text-base bg-white text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'>
          Create Account
        </button>
      </div>

      {/*------right side ------*/}
      <div className='hidden md:flex md:w-1/2 justify-end items-end relative min-h-[200px] md:min-h-[250px]'>
           <img 
             className='w-[280px] md:w-[320px] lg:w-[380px] xl:w-[420px] h-auto object-contain relative z-10 md:translate-y-4' 
             src={assets.appointment_img} 
             alt="Banner Pet" 
           />
      </div>
    </div>
  )
}

export default Banner
