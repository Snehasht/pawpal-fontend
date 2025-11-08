import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const refId = searchParams.get('refId');
  const oid = searchParams.get('oid');
  const amt = searchParams.get('amt');

  useEffect(() => {
    console.log('========================================');
    console.log('Payment Failure Page Loaded');
    console.log('Query Parameters:', { refId, oid, amt });
    console.log('========================================');
    
    toast.error('Payment failed. Please try again.');
  }, [refId, oid, amt]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-4">Your payment could not be processed. Please try again.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/myappointment')}
            className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition"
          >
            Go to My Appointments
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#60A5FA] text-white px-6 py-2 rounded-full hover:bg-[#3B82F6] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;

