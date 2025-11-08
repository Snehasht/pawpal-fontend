import React from 'react'
import { BreedData } from '../assets/assets'
import { Link } from 'react-router-dom'

const BreedMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='Breed'>
      <h1 className='text-3xl font-medium'>Find by Breed</h1>
      <p className='sm:w-1/3 text-center text-sm'>Every breed has its charm. Search by breed and discover the loyal friend waiting just for you.</p>
      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
        {BreedData.map((item,index)=>(
          <Link onClick={()=>scrollTo(0,0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index}to={`/Pets/${item.Breed}`}>
<img className='w-16 sm:w-24 mb-2' src={item.image} alt="" />
<p>{item.Breed}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BreedMenu
