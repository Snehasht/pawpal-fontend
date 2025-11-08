import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContextProvider'
import { useNavigate } from 'react-router-dom'

const ReletedPets = ({Breed, petId}) => {
    const {pets} = useContext(AppContext)
    const navigate = useNavigate()

    const [relPet,setRelPets] = useState([])

    useEffect(()=>{
        if(pets.length > 0 && Breed){
            const petsData = pets.filter((pet)=> {
                const petBreed = pet.Breed || pet.breed;
                const petIdValue = pet._id || pet.id;
                const currentPetId = String(petId);
                
                return petBreed === Breed && String(petIdValue) !== currentPetId;
            });
            setRelPets(petsData)
        }

    },[pets,Breed,petId])
  return (
       <div className="flex flex-col items-center gap-4 my-16 text-gray-900 text-center">
      {/* Centered header */}
      <h1 className="text-3xl font-medium">Recently Added Pets</h1>
      <p className="sm:w-1/3 text-sm">
        Meet the newest pets waiting for a loving home.
      </p>

      {/* Grid layout: 5 per row */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-5 px-3 sm:px-0">
        {relPet.slice(0, 5).map((item, index) => {
          const petId = item._id || item.id;
          return (
          <div onClick={()=>{
            if (petId) {
              navigate(`/appointment/${petId}`);
              scrollTo(0,0);
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
              <p className=" text-gray-600 text-sm">{item.description}</p>
            </div>
          </div>
          );
        })}
      </div>

      <button onClick={()=>{navigate(`/pets`); scroll(0,0)}} className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10">
        more
      </button>
    </div>
  )
}

export default ReletedPets
