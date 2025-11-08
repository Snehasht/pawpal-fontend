import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const appointmentId = searchParams.get('appointmentId');
  const refId = searchParams.get('refId');
  const oid = searchParams.get('oid');
  const amt = searchParams.get('amt');
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    const verifyPayment = async () => {
      console.log('========================================');
      console.log('Payment Success Page Loaded');
      console.log('Query Parameters:', { refId, oid, amt, appointmentId });
      console.log('Backend URL:', backendUrl);
      console.log('========================================');

      if (!refId || !oid || !amt) {
        console.error('❌ Missing payment information:', { refId, oid, amt });
        toast.error('Missing payment information. Please contact support.');
        setIsVerifying(false);
        return;
      }

      try {
        console.log('========================================');
        console.log('Initiating Payment Verification');
        console.log('Sending to:', `${backendUrl}/api/payment/verify-payment`);
        console.log('Payload:', {
          amount: amt,
          refId: refId,
          productId: oid,
        });
        console.log('========================================');

        const response = await axios.post(`${backendUrl}/api/payment/verify-payment`, {
          amount: amt,
          refId: refId,
          productId: oid,
        });

        console.log('========================================');
        console.log('Verification Response Received:');
        console.log('Success:', response.data.success);
        console.log('Message:', response.data.message);
        console.log('Full Response:', response.data);
        console.log('========================================');

        if (response.data.success) {
          console.log('✅ Payment verified successfully!');
          toast.success('Payment verified successfully! Your appointment has been confirmed.');
          setIsVerifying(false);
          
          // Redirect to my appointments after 3 seconds
          setTimeout(() => {
            console.log('Redirecting to /myappointment');
            navigate('/myappointment');
          }, 3000);
        } else {
          console.error('❌ Payment verification failed:', response.data);
          toast.error(response.data.message || 'Payment verification failed. Please contact support.');
          setIsVerifying(false);
        }
      } catch (error) {
        console.error('========================================');
        console.error('Payment Verification Error:');
        console.error('Error Message:', error.message);
        console.error('Error Response:', error.response?.data);
        console.error('Error Status:', error.response?.status);
        console.error('Full Error:', error);
        console.error('========================================');
        toast.error(error.response?.data?.message || 'Error verifying payment. Please contact support.');
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [refId, oid, amt, navigate, backendUrl, appointmentId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isVerifying ? 'Verifying Payment...' : 'Payment Successful!'}
        </h2>
        <p className="text-gray-600 mb-4">
          {isVerifying ? 'Please wait while we verify your payment...' : 'Your appointment has been confirmed.'}
        </p>
        {!isVerifying && <p className="text-sm text-gray-500">Redirecting to your appointments...</p>}
        <button
          onClick={() => navigate('/myappointment')}
          className="mt-6 bg-[#60A5FA] text-white px-6 py-2 rounded-full hover:bg-[#3B82F6] transition"
        >
          Go to My Appointments
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

