import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContextProvider';
import { assets } from '../assets/assets';
import RelatedPets from '../components/ReletedPets';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { petId } = useParams();
  const { pets, currencySymbol, backendUrl, token, getPetsData, userData } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [petInfo, setPetInfo] = useState(null);
  const [petSlots, setpetSlots] = useState([]);
  const [SlotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🐾 Fetch specific dog's info
  const fetchpetInfo = async () => {
    console.log('fetchpetInfo called with:', { petId, petsLength: pets.length, pets });
    
    if (!petId) {
      console.log('No petId provided');
      setPetInfo(null);
      return;
    }
    
    if (!pets.length) {
      console.log('Pets array is empty, waiting for data...');
      return;
    }
    
    const petIdStr = String(petId);
    console.log('Looking for pet with ID:', petIdStr);
    
    const info = pets.find(pet => {
      const petIdValue = pet._id?.toString() || pet.id?.toString() || String(pet._id) || String(pet.id);
      const petIdNum = parseInt(pet.id) || parseInt(pet._id);
      const matchId = parseInt(petId);
      
      const matches = petIdValue === petIdStr || 
                     pet.id === matchId || 
                     pet._id === petId ||
                     petIdNum === matchId ||
                     String(pet._id) === petIdStr ||
                     String(pet.id) === petIdStr;
      
      if (matches) {
        console.log('Found matching pet:', pet);
      }
      
      return matches;
    });
    
    if (!info) {
      console.log('No pet found matching ID:', petIdStr);
      console.log('Available pet IDs:', pets.map(p => ({ id: p.id, _id: p._id, name: p.name })));
    }
    
    setPetInfo(info || null);
  };

  // 🕒 Generate available 7-day slots (exclude already booked ones)
  const getAvailableSlots = () => {
    console.log('getAvailableSlots called');
    let allSlots = [];
    let today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for consistent comparison

    // Build map of booked slots: YYYY-MM-DD -> Set(HH:mm)
    const toHHMM = (d) => `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    const bookedByDate = {};
    const rawBooked = petInfo?.slots_booked || {};
    Object.keys(rawBooked).forEach(dateKey => {
      const times = Array.isArray(rawBooked[dateKey]) ? rawBooked[dateKey] : [];
      bookedByDate[dateKey] = new Set(times);
    });

    for (let i = 0; i < 7; i++) {
      // Create target date for day i
      let targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      
      // Store the date for this day (used for display even if no slots)
      let dayDate = new Date(targetDate);
      
      // Set end time for the day (9 PM)
      let endTime = new Date(targetDate);
      endTime.setHours(21, 0, 0, 0);

      // Set start time logic
      let startTime = new Date(targetDate);
      
      // If it's today, start from current time rounded to next 30 min interval
      // Otherwise, start from 10:00 AM
      if (i === 0) {
        // Today - start from next available slot
        let now = new Date();
        let currentHour = now.getHours();
        let currentMinute = now.getMinutes();
        
        // If it's before 10 AM, start at 10 AM
        if (currentHour < 10) {
          startTime.setHours(10, 0, 0, 0);
        } else if (currentHour >= 21) {
          // If it's 9 PM or later today, add empty slots but keep the date
          allSlots.push({
            date: dayDate,
            slots: []
          });
          console.log(`Day ${i} (${dayDate.toLocaleDateString()}): No slots - past 9 PM`);
          continue;
        } else {
          // Round up to next 30 min interval
          let nextMinute = currentMinute <= 30 ? 30 : 0;
          let nextHour = currentMinute <= 30 ? currentHour : currentHour + 1;
          
          // Ensure we don't go past 9 PM
          if (nextHour >= 21) {
            allSlots.push({
              date: dayDate,
              slots: []
            });
            console.log(`Day ${i} (${dayDate.toLocaleDateString()}): No slots - too late`);
            continue;
          }
          
          startTime.setHours(nextHour, nextMinute, 0, 0);
        }
      } else {
        // Future days - start at 10:00 AM
        startTime.setHours(10, 0, 0, 0);
      }

      let timeSlots = [];
      let currentSlot = new Date(startTime);
      
      // Generate 30-minute intervals until 9 PM
      while (currentSlot < endTime) {
        let formattedTime = currentSlot.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const dateKey = new Date(targetDate).toISOString().split('T')[0];
        const canonical = toHHMM(currentSlot);
        const isBooked = bookedByDate[dateKey]?.has(canonical);
        if (!isBooked) {
          timeSlots.push({
            datetime: new Date(currentSlot),
            time: formattedTime,
          });
        }
        // Increment by 30 mins
        currentSlot.setMinutes(currentSlot.getMinutes() + 30);
      }

      // Add to overall slots array with date
      allSlots.push({
        date: dayDate,
        slots: timeSlots
      });
      console.log(`Day ${i} (${dayDate.toLocaleDateString()}): ${timeSlots.length} slots generated`);
    }

    console.log('All slots generated:', allSlots.length, 'days');
    setpetSlots(allSlots);
  };

  const bookAppointment = async () => {
    console.log('bookAppointment called', { token, SlotIndex, selectedSlot, petSlots });
    
    // Validate token - must be a string and not 'false'
    if (!token || token === false || token === 'false' || typeof token !== 'string') {
      toast.warn('Please login to book appointment');
      localStorage.removeItem('token');
      return navigate('/login');
    }

    // Validate selection
    if (!petSlots[SlotIndex] || !petSlots[SlotIndex].slots?.length || !selectedSlot) {
      console.log('Validation failed:', { 
        hasSlotIndex: !!petSlots[SlotIndex], 
        hasSlots: !!petSlots[SlotIndex]?.slots?.length,
        hasSelectedSlot: !!selectedSlot 
      });
      toast.error('Please select a time slot');
      return;
    }

    console.log('Starting appointment booking process...');
    setIsProcessing(true);

    try {
      const selectedDate = petSlots[SlotIndex].date;
      const slotDate = selectedDate.toISOString().split('T')[0];
      const toHHMM = (d) => `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
      const slotTimeCanonical = toHHMM(new Date(selectedSlot.datetime));

      const payload = {
        userId: userData?._id || userData?.id,
        petId,
        slotDate,
        slotTime: slotTimeCanonical
      };

      // Step 1: Create appointment
      console.log('Creating appointment with payload:', payload);
      console.log('Token being sent:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      const appointmentResponse = await axios.post(backendUrl + '/api/user/book-appointment', payload, { 
        headers: { 
          token: token || '',
          'Content-Type': 'application/json'
        } 
      });
      console.log('Appointment response:', appointmentResponse.data);
      
      if (!appointmentResponse.data.success) {
        toast.error(appointmentResponse.data.message || 'Failed to book appointment');
        setIsProcessing(false);
        return;
      }

      // Appointment booked successfully - redirect to my appointments
      toast.success('Appointment booked successfully!');
      setIsProcessing(false);
      
      // Redirect to my appointments page
      setTimeout(() => {
        navigate('/myappointment');
      }, 1000);
    } catch (error) {
      console.error('Error in bookAppointment:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || error.message || 'An error occurred. Please try again.');
      setIsProcessing(false);
    }
  }

  // Fetch dog info
  useEffect(() => {
    console.log('useEffect triggered - pets or petId changed', { petsLength: pets.length, petId });
    fetchpetInfo();
  }, [pets, petId]);

  // Fetch slots after dog info loads
  useEffect(() => {
    console.log('petInfo changed:', petInfo);
    if (petInfo) {
      getAvailableSlots();
    } else {
      setpetSlots([]);
    }
  }, [petInfo]);



  // Reset SlotIndex to first available day when slots change
  useEffect(() => {
    if (petSlots.length > 0) {
      // Find first day with available slots, or default to index 0
      const firstAvailableIndex = petSlots.findIndex(day => day.slots && day.slots.length > 0);
      setSlotIndex(firstAvailableIndex >= 0 ? firstAvailableIndex : 0);
    }
  }, [petSlots]);

  // Log slots to verify array length = 7
  useEffect(() => {
    console.log('Pet slots:', petSlots);
  }, [petSlots]);


  // ✅ Return UI only when dogInfo is available
  return (
    petInfo && (
      <div>
        {/* 🐶 Dog detail section */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div>
            <img
              className='bg-[#60A5FA] w-full sm:max-w-72 rounded-lg'
              src={petInfo.image}
              alt={petInfo.name}
            />
          </div>

          <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            {/*--------info -------*/}
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {petInfo.name}
              <img className='w-5' src={assets.groupprofile} alt='icon' />
            </p>

            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>
                {petInfo.Breed || petInfo.breed} - {petInfo.gender}
              </p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>
                {petInfo.age} years old
              </button>
            </div>

            {/*----- about-------*/}
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                About
              </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
                {petInfo.description}
              </p>
            </div>

            {/*----- fee -------*/}
            <p className='text-gray-500 font-medium mt-4'>
              Appointment fee:{' '}
              <span>
                {currencySymbol}
                {petInfo.fee}
              </span>
            </p>
          </div>
        </div>
        {/*----booking------ */}
        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>
            Booking Slots
          </p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {
              petSlots.length > 0 && petSlots.map((item,index)=>(
                <div 
                  onClick={()=> {
                    // Allow clicking on all days
                    setSlotIndex(index);
                  }}
                  className={`text-center py-6 min-w-16 rounded-full border border-gray-200 cursor-pointer hover:border-[#60A5FA] transition-all ${item.slots && item.slots.length > 0 ? '' : 'opacity-60'} ${SlotIndex === index ? 'bg-[#60A5FA] text-white border-[#60A5FA]' : 'bg-white'}`} 
                  key={index}
                >
                  <p className={`font-medium ${SlotIndex === index ? 'text-white' : 'text-gray-700'}`}>{daysOfWeek[item.date.getDay()]}</p>
                  <p className={`text-sm ${SlotIndex === index ? 'text-white' : 'text-gray-600'}`}>{item.date.getDate()}</p>
                </div>
              ))
            }
          </div>

        
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {petSlots.length > 0 && petSlots[SlotIndex] && petSlots[SlotIndex].slots && petSlots[SlotIndex].slots.length > 0 ? (
            petSlots[SlotIndex].slots.map((item,index)=>(
              <p onClick={()=>{ setSlotTime(item.time); setSelectedSlot(item); }} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-[#60A5FA] text-white': 'text-gray-400 border border-gray-300'}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))
          ) : (
            <p className='text-gray-500 text-sm'>No available slots for this day</p>
          )}
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Button clicked!', { isProcessing, token: !!token, selectedSlot: !!selectedSlot });
            if (!isProcessing) {
              bookAppointment();
            }
          }}
          disabled={isProcessing}
          className='bg-[#60A5FA] text-white text-sm font-light px-14 py-3 rounded-full my-6 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3B82F6] transition-colors active:scale-95'
          type="button"
          style={{ pointerEvents: isProcessing ? 'none' : 'auto' }}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Processing...
            </span>
          ) : (
            'Book Appointment'
          )}
        </button>
      </div>
      
      {/*listing related pets */}
      <RelatedPets petId={petId} Breed={petInfo.Breed || petInfo.breed}/>
      </div>
    )
  );
};

export default Appointment;
