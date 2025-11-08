import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContextProvider'
import { useContext } from 'react'

const OTPVerification = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { backendUrl, setToken } = useContext(AppContext)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [email, setEmail] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    } else {
      // If no email in URL, redirect to login
      navigate('/login?mode=signup')
      toast.error('Email not found. Please register again.')
    }
  }, [searchParams, navigate])

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      // Focus last input
      const lastInput = document.getElementById('otp-5')
      if (lastInput) lastInput.focus()
    }
  }

  const handleVerify = async () => {
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP')
      return
    }

    if (!email) {
      toast.error('Email not found. Please register again.')
      navigate('/login?mode=signup')
      return
    }

    setIsVerifying(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/verify-otp', {
        email,
        otp: otpString
      })

      if (data.success) {
        toast.success(data.message || 'Email verified successfully!')
        
        // If token is returned, save it and login
        if (data.token) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          navigate('/')
        } else {
          // Redirect to login if no token
          navigate('/login?mode=login')
        }
      } else {
        toast.error(data.message || 'Invalid OTP. Please try again.')
        // Clear OTP on error
        setOtp(['', '', '', '', '', ''])
        document.getElementById('otp-0')?.focus()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'An error occurred during verification')
      // Clear OTP on error
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Email not found')
      return
    }

    if (timer > 0) {
      toast.info(`Please wait ${timer} seconds before requesting a new OTP`)
      return
    }

    setIsResending(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/user/resend-otp', { email })

      if (data.success) {
        toast.success(data.message || 'OTP sent successfully! Please check your email.')
        setTimer(60) // Set 60 second cooldown
        setOtp(['', '', '', '', '', '']) // Clear OTP inputs
        document.getElementById('otp-0')?.focus()
      } else {
        toast.error(data.message || 'Failed to send OTP. Please try again.')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'An error occurred')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center'>
      <div className='flex flex-col gap-4 m-auto items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <h1 className='text-2xl font-semibold text-center'>Verify Your Email</h1>
        <p className='text-center text-gray-500'>
          We've sent a 6-digit OTP code to <br />
          <span className='font-medium text-gray-700'>{email}</span>
        </p>

        <div className='w-full mt-4'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Enter OTP Code
          </label>
          <div className='flex gap-2 justify-center' onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className='w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-[#60A5FA] focus:ring-2 focus:ring-[#60A5FA] outline-none transition-all'
                autoFocus={index === 0}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying || otp.join('').length !== 6}
          className={`w-full py-3 rounded-md text-base font-medium transition-all ${
            isVerifying || otp.join('').length !== 6
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#60A5FA] text-white hover:bg-[#3B82F6]'
          }`}
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className='w-full text-center'>
          <p className='text-sm text-gray-500 mb-2'>
            Didn't receive the code?
          </p>
          <button
            onClick={handleResendOTP}
            disabled={isResending || timer > 0}
            className={`text-sm ${
              isResending || timer > 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-[#60A5FA] hover:text-[#3B82F6] underline'
            }`}
          >
            {isResending
              ? 'Sending...'
              : timer > 0
              ? `Resend OTP (${timer}s)`
              : 'Resend OTP'}
          </button>
        </div>

        <div className='w-full pt-4 border-t'>
          <button
            onClick={() => navigate('/login?mode=signup')}
            className='text-sm text-gray-500 hover:text-gray-700 underline'
          >
            Back to Registration
          </button>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification

