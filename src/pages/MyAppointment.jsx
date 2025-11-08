import React, { useContext } from 'react'
import { AppContext } from '../context/AppContextProvider'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const MyAppointment = () => {

  const {backendUrl, token, getPetsData} = useContext(AppContext)
  const navigate = useNavigate() 

  const [appointments,setAppointments] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
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
      
      // Log full payment data for debugging
      console.log('Full Payment Data received:', JSON.stringify(paymentData, null, 2));
      
      // Validate payment data
      if (!paymentData || !paymentData.esewaUrl) {
        console.error('Invalid payment data:', paymentData);
        toast.error('Invalid payment data received. Please try again.');
        return;
      }
      
      // Check if backend is returning old v1 format (backward compatibility check)
      if (paymentData.tAmt && paymentData.pid && !paymentData.total_amount) {
        console.error('⚠️ Backend is returning old eSewa v1 format. Please restart the backend server.');
        toast.error('Backend needs to be restarted. Please contact administrator.');
        return;
      }
      
      console.log('Payment Data:', {
        esewaUrl: paymentData.esewaUrl,
        total_amount: paymentData.total_amount,
        transaction_uuid: paymentData.transaction_uuid,
        amount: paymentData.amount,
        product_code: paymentData.product_code,
      });
      
      // Show loading message
      toast.info('Redirecting to eSewa payment gateway...', { autoClose: 2000 });
      
      // Create and submit form with eSewa v2 format
      try {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentData.esewaUrl;
        form.style.display = 'none';
        form.target = '_self';
        
        // Add all required fields in eSewa v2 format
        const fields = {
          amount: paymentData.amount || '0',
          tax_amount: paymentData.tax_amount || '0',
          total_amount: paymentData.total_amount || '0',
          transaction_uuid: paymentData.transaction_uuid || '',
          product_code: paymentData.product_code || 'EPAYTEST',
          product_service_charge: paymentData.product_service_charge || '0',
          product_delivery_charge: paymentData.product_delivery_charge || '0',
          success_url: paymentData.success_url || '',
          failure_url: paymentData.failure_url || '',
          signed_field_names: paymentData.signed_field_names || '',
          signature: paymentData.signature || ''
        };
        
        // Validate all required fields have values
        if (!fields.total_amount || fields.total_amount === '0' || 
            !fields.transaction_uuid || 
            !fields.product_code || 
            !fields.success_url || 
            !fields.failure_url) {
          console.error('Missing required payment fields. Full paymentData:', paymentData);
          console.error('Extracted fields:', fields);
          toast.error(`Payment data incomplete. Missing: ${[
            !fields.total_amount || fields.total_amount === '0' ? 'total_amount' : '',
            !fields.transaction_uuid ? 'transaction_uuid' : '',
            !fields.product_code ? 'product_code' : '',
            !fields.success_url ? 'success_url' : '',
            !fields.failure_url ? 'failure_url' : ''
          ].filter(Boolean).join(', ')}`);
          return;
        }
        
        console.log('========================================');
        console.log('Form fields being submitted:', { ...fields, signature: fields.signature.substring(0, 20) + '...' });
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
        console.log('Submitting form to eSewa v2:', paymentData.esewaUrl);
        
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
  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment)
    setShowDetails(true)
  }

  const closeDetails = () => {
    setShowDetails(false)
    setSelectedAppointment(null)
  }

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(()=>{
    if (token) {
      getUserAppointments()
    } else {
      // Clear appointments if logged out
      setAppointments([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token])

  // Refresh appointments when returning from payment or when page becomes visible
  useEffect(() => {
    if (!token) return; // Early return inside useEffect is fine
    
    const handleFocus = () => {
      getUserAppointments()
    }
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        getUserAppointments()
      }
    }
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Don't render if no token (will redirect)
  if (!token) {
    return null;
  }

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
              <button 
                onClick={() => viewAppointmentDetails(item)}
                className='text-sm text-center sm:min-w-48 py-2 border border-[#60A5FA] text-[#60A5FA] hover:bg-[#60A5FA] hover:text-white transition-all duration-300'
              >
                View Details
              </button>
            )}
            {!item.cancelled && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
            {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
          </div>
        </div>
       ))}
      </div>

      {/* Appointment Details Modal */}
      {showDetails && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
              <button
                onClick={closeDetails}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Pet Image */}
              <div className="flex justify-center">
                <img 
                  className="w-48 h-48 object-cover rounded-lg bg-indigo-50" 
                  src={selectedAppointment.petData.image} 
                  alt={selectedAppointment.petData.name} 
                />
              </div>

              {/* Pet Information */}
              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Pet Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Pet Name</p>
                    <p className="font-medium text-gray-900">{selectedAppointment.petData.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Breed</p>
                    <p className="font-medium text-gray-900">{selectedAppointment.petData.Breed || selectedAppointment.petData.breed}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Age</p>
                    <p className="font-medium text-gray-900">{selectedAppointment.petData.age} years</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Gender</p>
                    <p className="font-medium text-gray-900">{selectedAppointment.petData.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Size</p>
                    <p className="font-medium text-gray-900">{selectedAppointment.petData.size}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vaccinated</p>
                    <p className="font-medium text-gray-900">{selectedAppointment.petData.vaccinated ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-500">Description</p>
                  <p className="font-medium text-gray-900 mt-1">{selectedAppointment.petData.description}</p>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Appointment Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{slotDateFormat(selectedAppointment.slotDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">{selectedAppointment.slotTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Appointment Fee</p>
                    <p className="font-medium text-gray-900">Rs. {selectedAppointment.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payment Status</p>
                    <p className="font-medium text-green-600">✓ Paid</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Address</h3>
                <div className="text-sm">
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.petData.location}</p>
                  <p className="text-gray-500 mt-2">Address Line 1</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.petData.address?.line1 || 'N/A'}</p>
                  <p className="text-gray-500 mt-2">Address Line 2</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.petData.address?.line2 || 'N/A'}</p>
                </div>
              </div>

              {/* Transaction ID if available */}
              {selectedAppointment.transactionId && (
                <div className="border-t pt-4">
                  <p className="text-gray-500 text-sm">Transaction ID</p>
                  <p className="font-medium text-gray-900">{selectedAppointment.transactionId}</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end gap-3">
              <button
                onClick={closeDetails}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyAppointment
