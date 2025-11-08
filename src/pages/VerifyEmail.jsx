import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContextProvider'
import { useContext } from 'react'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { backendUrl } = useContext(AppContext)
  const [verificationStatus, setVerificationStatus] = useState('verifying') // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')

      if (!token) {
        setVerificationStatus('error')
        setMessage('Verification token is missing')
        return
      }

      try {
        const { data } = await axios.get(backendUrl + '/api/user/verify-email', {
          params: { token }
        })

        if (data.success) {
          setVerificationStatus('success')
          setMessage(data.message || 'Email verified successfully!')
          toast.success(data.message || 'Email verified successfully!')
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login?mode=login')
          }, 3000)
        } else {
          setVerificationStatus('error')
          setMessage(data.message || 'Verification failed')
          toast.error(data.message || 'Verification failed')
        }
      } catch (error) {
        setVerificationStatus('error')
        setMessage(error.response?.data?.message || error.message || 'An error occurred during verification')
        toast.error(error.response?.data?.message || error.message || 'An error occurred during verification')
      }
    }

    verifyEmail()
  }, [searchParams, backendUrl, navigate])

  return (
    <div className='min-h-[80vh] flex items-center justify-center'>
      <div className='flex flex-col gap-4 m-auto items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        {verificationStatus === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#60A5FA]"></div>
            <p className='text-lg font-semibold'>Verifying your email...</p>
            <p className='text-center text-gray-500'>Please wait while we verify your email address.</p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className='text-2xl font-semibold text-green-600'>Email Verified!</p>
            <p className='text-center text-gray-600'>{message}</p>
            <p className='text-center text-sm text-gray-500'>Redirecting to login page...</p>
            <button
              onClick={() => navigate('/login?mode=login')}
              className='mt-4 bg-[#60A5FA] text-white px-8 py-3 rounded-full font-light hover:opacity-90 transition-all duration-300'
            >
              Go to Login
            </button>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className='text-2xl font-semibold text-red-600'>Verification Failed</p>
            <p className='text-center text-gray-600'>{message}</p>
            <div className='flex flex-col gap-3 mt-4 w-full'>
              <button
                onClick={() => navigate('/login?mode=login')}
                className='bg-[#60A5FA] text-white px-8 py-3 rounded-full font-light hover:opacity-90 transition-all duration-300'
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate('/login?mode=signup')}
                className='border border-[#60A5FA] text-[#60A5FA] px-8 py-3 rounded-full font-light hover:bg-[#60A5FA] hover:text-white transition-all duration-300'
              >
                Resend Verification Email
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail

