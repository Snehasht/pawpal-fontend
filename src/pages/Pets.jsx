import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContextProvider'

const Pets = () => {
  const { Breed } = useParams()
  const [filterpet, setFilterpet] = useState([])
  const [showFilter,setShowFilter ] = useState(false)
  const navigate = useNavigate()
  const { pets } = useContext(AppContext)

  const applyfilter = () => {
    if (Breed) {
      setFilterpet(pets.filter(pet => pet.Breed === Breed || pet.breed === Breed))
    } else {
      setFilterpet(pets)
    }
  }
  
  useEffect(() => {
    applyfilter()
  }, [pets, Breed])

  return (
    <div>
      <p className='text-gray-600'>Browse through the lovely</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-[#60A5FA] text-white' : ''}`} onClick={()=>setShowFilter(prev => !prev)}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => Breed === 'Golden Retriever' ? navigate('/pets') : navigate('/pets/Golden%20Retriever')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${Breed == "Golden Retriever" ? "bg-indigo-100 text-black" : ""}`}>
            Golden Retriever
          </p>
          <p onClick={() => Breed === 'Labrador' ? navigate('/pets') : navigate('/pets/Labrador')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${Breed == "Labrador" ? "bg-indigo-100 text-black" : ""}`}>
            Labrador
          </p>
          <p onClick={() => Breed === 'Beagle' ? navigate('/pets') : navigate('/pets/Beagle')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${Breed == "Beagle" ? "bg-indigo-100 text-black" : ""}`}>
            Beagle
          </p>
          <p onClick={() => Breed === 'German Shepherd' ? navigate('/pets') : navigate('/pets/German%20Shepherd')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${Breed == "German Shepherd" ? "bg-indigo-100 text-black" : ""}`}>
            German Shepherd
          </p>
          <p onClick={() => Breed === 'Poodle' ? navigate('/pets') : navigate('/pets/Poodle')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${Breed == "Poodle" ? "bg-indigo-100 text-black" : ""}`}>
            Poodle
          </p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-5 px-3 sm:px-0">
          {filterpet.map((item, index) => {
            const petId = item._id || item.id;
            return (
            <div
              onClick={() => {
                if (petId) {
                  navigate(`/appointment/${petId}`);
                } else {
                  console.error('Pet ID is missing:', item);
                }
              }}
              key={item._id || item.id || index}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 flex flex-col"
            >
              <div className="w-full h-48 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div className="p-4 flex flex-col gap-1">
                <div className={`flex items-center gap-2 text-sm ${item.available !== false ? 'text-green-500' : 'text-red-500'}`}>
                  <span className={`w-2 h-2 rounded-full ${item.available !== false ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <p>{item.available !== false ? 'Available' : 'Not Available'}</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Pets
