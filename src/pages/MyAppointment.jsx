import React, { useContext } from 'react'
import { AppContext } from '../context/AppContextProvider'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

const MyAppointment = () => {

  const {backendUrl, token, getPetsData} = useContext(AppContext) 

  const [appointments,setAppointments] = useState([])
  const months = [ "","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const slotDateFormat = (slotDate) =>{

    if (!slotDate) return ''
    let y, m, d
    if (slotDate.includes('-')) { // YYYY-MM-DD
      ;[y, m, d] = slotDate.split('-').map(Number)
    } else if (slotDate.includes('_')) { // D_M_YYYY
      ;[d, m, y] = slotDate.split('_').map(Number)
    } else {
      return slotDate
    }
    const monthName = months[(m || 0) - 1]
    if (!monthName || !d || !y) return slotDate
    return `${d} ${monthName} ${y}`
  }

  const getUserAppointments = async () => {
    try {
      
      const {data} = await axios.get(backendUrl + '/api/user/appointments',{headers:{token}})

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments);
        
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }
  }

const cancelAppointment = async (appointmentId) => {

  try {

    console.log('Cancelling appointment:', appointmentId)
    const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment', {appointmentId},{headers:{token}})
    if (data.success) {
      toast.success(data.message)
      getUserAppointments()
      getPetsData()
    } else {
      toast.error(data.message)
    }

  } catch (error) {
    console.log(error)
    toast.error(error.response?.data?.message || error.message)
  }
}

const payOnline = async (appointmentId) => {
  try {
    console.log('Initiating payment for appointment:', appointmentId);
    toast.info('Processing payment...', { autoClose: 2000 });
    
    // Step 1: Initiate payment
    const paymentResponse = await axios.post(
      backendUrl + '/api/payment/initiate',
      { appointmentId },
      { 
        headers: { 
          token: token || '',
          'Content-Type': 'application/json'
        } 
      }
    );
    
    console.log('Payment response:', paymentResponse.data);

    if (paymentResponse.data.success) {
      console.log('Payment data received, submitting form immediately...');
      const paymentData = paymentResponse.data.paymentData;
      
      // Validate payment data
      if (!paymentData || !paymentData.esewaUrl) {
        console.error('Invalid payment data:', paymentData);
        toast.error('Invalid payment data received. Please try again.');
        return;
      }
      
      console.log('Payment Data:', {
        esewaUrl: paymentData.esewaUrl,
        tAmt: paymentData.tAmt,
        pid: paymentData.pid,
      });
      
      // Show loading message
      toast.info('Redirecting to eSewa payment gateway...', { autoClose: 2000 });
      
      // Create and submit form immediately
      try {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentData.esewaUrl;
        form.style.display = 'none';
        form.target = '_self';
        form.enctype = 'application/x-www-form-urlencoded'; // Set proper encoding
        
        // Add all required fields in eSewa format
        const fields = {
          tAmt: paymentData.tAmt || '0', // Total amount (required)
          amt: paymentData.amt || '0', // Amount (required)
          pid: paymentData.pid || '', // Product ID (required)
          scd: paymentData.scd || 'EPAYTEST', // Merchant code (required)
          su: paymentData.su || '', // Success URL (required)
          fu: paymentData.fu || '' // Failure URL (required)
        };
        
        // Validate all required fields have values
        if (!fields.tAmt || !fields.amt || !fields.pid || !fields.scd || !fields.su || !fields.fu) {
          console.error('Missing required payment fields:', fields);
          toast.error('Payment data incomplete. Please try again.');
          return;
        }
        
        console.log('========================================');
        console.log('Form fields being submitted:', fields);
        console.log('Form action URL:', paymentData.esewaUrl);
        console.log('========================================');
        
        Object.keys(fields).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(fields[key] || '');
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        console.log('Form created and appended to body');
        console.log('Submitting form to eSewa:', paymentData.esewaUrl);
        
        // Submit form with small delay
        setTimeout(() => {
          form.submit();
        }, 100);
        
      } catch (formError) {
        console.error('Error creating/submitting form:', formError);
        toast.error('Error redirecting to payment. Please try again.');
      }
    } else {
      toast.error(paymentResponse.data.message || 'Failed to initiate payment');
    }
  } catch (error) {
    console.error('Error in payOnline:', error);
    toast.error(error.response?.data?.message || error.message || 'An error occurred. Please try again.');
  }
}
  useEffect(()=>{
    if (token) {
      getUserAppointments()
    }
  },[token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
       {appointments.map((item,index)=>(
        <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
          <div>
            <img className='w-32 bg-indigo-50' src={item.petData.image} alt="" />
          </div>
          <div className='flex-1 text-sm text-zinc-600'>
            <p className='text-neutal-800 font-semibold'>{item.petData.name}</p>
            <p>{item.petData.Breed}</p>
            <p className='text-zinc-700 font-medium mt-1'>Address:</p>
            <p className='text-xs'>{item.petData.address?.line1}</p>
            <p className='text-xs'>{item.petData.address?.line2}</p>
            <p className='text-xs mt-1'><span className='text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
          </div>
          <div className='flex flex-col gap-2 justify-end'>
            {!item.cancelled && !item.payment && (
              <button 
                onClick={() => payOnline(item._id)} 
                className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-[#60A5FA] hover:text-white transition-all duration-300'
              >
                Pay Online
              </button>
            )}
            {!item.cancelled && item.payment && (
              <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 bg-green-50'>
                Payment Completed
              </button>
            )}
            {!item.cancelled && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
            {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
          </div>
        </div>
       ))}
      </div>
    </div>
  )
}

export default MyAppointment
