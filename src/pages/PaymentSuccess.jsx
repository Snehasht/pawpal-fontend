import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    const verifyPayment = async () => {
      // Log ALL query parameters to see what eSewa is actually sending
      const allParams = {};
      searchParams.forEach((value, key) => {
        allParams[key] = value;
      });
      
      console.log('========================================');
      console.log('Payment Success Page Loaded');
      console.log('ALL Query Parameters:', allParams);
      console.log('URL:', window.location.href);
      console.log('Full URL Search:', window.location.search);
      console.log('========================================');

      // eSewa v2 sometimes appends ?data= instead of &data=, causing appointmentId to include data
      // Extract appointmentId correctly - it might contain ?data= if eSewa malformed the URL
      let appointmentId = searchParams.get('appointmentId') || searchParams.get('appointment_id');
      
      // If appointmentId contains ?data=, extract only the appointmentId part
      if (appointmentId && appointmentId.includes('?data=')) {
        appointmentId = appointmentId.split('?data=')[0];
        console.log('Fixed appointmentId (removed ?data= part):', appointmentId);
      }
      
      // eSewa v2 sends payment data as Base64-encoded JSON in 'data' parameter
      // Try to get it from searchParams first, then from URL directly if needed
      let dataParam = searchParams.get('data');
      
      // If data is not in searchParams, try to extract it from the URL directly
      // This handles the case where eSewa appends ?data= instead of &data=
      if (!dataParam) {
        const urlMatch = window.location.href.match(/[?&]data=([^&]+)/);
        if (urlMatch) {
          dataParam = decodeURIComponent(urlMatch[1]);
          console.log('Extracted data parameter from URL directly');
        }
      }
      let paymentData = null;
      let refId = null;
      let oid = null;
      let amt = null;
      
      if (dataParam) {
        try {
          // Decode Base64 and parse JSON
          const decodedData = atob(dataParam);
          paymentData = JSON.parse(decodedData);
          
          console.log('Decoded Payment Data:', paymentData);
          
          // Extract payment information from decoded data
          // eSewa v2 uses: transaction_code (like refId), transaction_uuid (like oid), total_amount
          refId = paymentData.transaction_code || paymentData.refId;
          oid = paymentData.transaction_uuid || paymentData.oid;
          amt = paymentData.total_amount || paymentData.amount;
          
          console.log('Extracted from data:', { refId, oid, amt, status: paymentData.status });
          
          // If payment status is COMPLETE, treat as successful even before verification
          if (paymentData.status === 'COMPLETE' && appointmentId) {
            console.log('✅ Payment status is COMPLETE. Proceeding with verification...');
            // Continue to verification below
          }
        } catch (error) {
          console.error('Error decoding payment data:', error);
          toast.error('Error parsing payment data. Please contact support.');
          setIsVerifying(false);
          setTimeout(() => navigate('/myappointment'), 3000);
          return;
        }
      } else {
        // Fallback: Try different parameter name variations (for backward compatibility)
        refId = searchParams.get('refId') || searchParams.get('ref_id') || searchParams.get('reference_id');
        oid = searchParams.get('oid') || searchParams.get('transaction_uuid') || searchParams.get('product_id');
        amt = searchParams.get('amt') || searchParams.get('amount') || searchParams.get('total_amount');
      }
      
      console.log('Final Extracted Parameters:', { refId, oid, amt, appointmentId, paymentStatus: paymentData?.status });

      // If payment status is COMPLETE, mark payment as successful directly
      if (paymentData && paymentData.status === 'COMPLETE' && appointmentId) {
        console.log('✅ Payment status is COMPLETE. Marking payment as successful...');
        
        try {
          // Mark payment as successful based on COMPLETE status
          const response = await axios.post(`${backendUrl}/api/payment/mark-as-paid`, {
            appointmentId: appointmentId,
            transactionCode: refId || paymentData.transaction_code,
            transactionUUID: oid || paymentData.transaction_uuid,
            amount: amt || paymentData.total_amount
          });
          
          if (response.data.success) {
            toast.success('Payment successful! Your appointment has been confirmed.');
            setIsVerifying(false);
            setTimeout(() => {
              navigate('/myappointment');
            }, 2000);
            return;
          } else {
            console.warn('Failed to mark payment, trying verification instead...');
            // Fall through to verification below
          }
        } catch (error) {
          console.error('Error marking payment as paid:', error);
          // Fall through to verification below
        }
      } else if (appointmentId && (!refId || !oid || !amt)) {
        // If we have appointmentId but missing payment params and status is not COMPLETE
        console.warn('⚠️ Missing payment parameters, but have appointmentId. Attempting verification with appointmentId only.');
        
        // Try to verify payment using appointmentId (backend can look it up)
        try {
          const response = await axios.post(`${backendUrl}/api/payment/verify-by-appointment`, {
            appointmentId: appointmentId
          });
          
          if (response.data.success) {
            toast.success('Payment verified successfully! Your appointment has been confirmed.');
            setIsVerifying(false);
            setTimeout(() => {
              navigate('/myappointment');
            }, 2000);
            return;
          }
        } catch (error) {
          console.error('Verification by appointmentId failed:', error);
        }
      }

      // Only show error if we don't have payment data with COMPLETE status
      if (!paymentData || paymentData.status !== 'COMPLETE') {
        if (!refId || !oid || !amt) {
          console.error('❌ Missing payment information:', { refId, oid, amt, appointmentId });
          console.error('Available parameters:', allParams);
          toast.error('Missing payment information. Please check your payment status in My Appointments.');
          setIsVerifying(false);
          
          // Redirect to appointments page after showing error
          setTimeout(() => {
            navigate('/myappointment');
          }, 3000);
          return;
        }
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

        // For eSewa v2, use transaction_code as refId and transaction_uuid as productId
        const response = await axios.post(`${backendUrl}/api/payment/verify-payment`, {
          amount: amt,
          refId: refId, // transaction_code from eSewa v2
          productId: oid, // transaction_uuid from eSewa v2
        });

        console.log('========================================');
        console.log('Verification Response Received:');
        console.log('Success:', response.data.success);
        console.log('Message:', response.data.message);
        console.log('Full Response:', response.data);
        console.log('========================================');

        if (response.data.success) {
          console.log('✅ Payment verified successfully!');
          toast.success('Payment successful! Your appointment has been confirmed.');
          setIsVerifying(false);
          
          // Redirect to my appointments after 2 seconds
          setTimeout(() => {
            console.log('Redirecting to /myappointment');
            navigate('/myappointment');
          }, 2000);
        } else {
          console.error('❌ Payment verification failed:', response.data);
          // If payment status was COMPLETE, mark as paid directly
          if (paymentData && paymentData.status === 'COMPLETE' && appointmentId) {
            console.log('Payment status is COMPLETE but verification failed. Marking as paid directly...');
            try {
              const markResponse = await axios.post(`${backendUrl}/api/payment/mark-as-paid`, {
                appointmentId: appointmentId,
                transactionCode: refId || paymentData.transaction_code,
                transactionUUID: oid || paymentData.transaction_uuid,
                amount: amt || paymentData.total_amount
              });
              
              if (markResponse.data.success) {
                toast.success('Payment successful! Your appointment has been confirmed.');
                setIsVerifying(false);
                setTimeout(() => navigate('/myappointment'), 2000);
              } else {
                toast.error('Payment verification failed. Please contact support.');
                setIsVerifying(false);
              }
            } catch (markError) {
              console.error('Error marking as paid:', markError);
              toast.error('Payment verification failed. Please contact support.');
              setIsVerifying(false);
            }
          } else {
            toast.error(response.data.message || 'Payment verification failed. Please contact support.');
            setIsVerifying(false);
          }
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
  }, [searchParams, navigate, backendUrl]);

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

