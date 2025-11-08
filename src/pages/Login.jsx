import React, { useContext, useEffect, useState } from 'react'
import {AppContext} from '../context/AppContextProvider'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'


const Login = () => {

const {backendUrl, token, setToken} = useContext(AppContext)
const navigate = useNavigate()
const [searchParams] = useSearchParams()
const location = useLocation()

// Check if mode is specified in URL or location state
const initialMode = searchParams.get('mode') || location.state?.mode || 'signup'
const [state,setState] = useState(initialMode === 'login' ? 'Login' : 'Sign Up')

const[email,setEmail] = useState('')
const[password,setPassword] = useState('')
const[name,setName] = useState('')

// Track which fields have been touched (dirty)
const [touched, setTouched] = useState({
  name: false,
  email: false,
  password: false
})

// Validation functions
const validateEmail = (email) => {
  if (!email) return 'Email is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Please enter a valid email address'
  return ''
}

const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must contain at least 8 characters'
  return ''
}

const validateName = (name) => {
  if (!name) return 'Full name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  return ''
}

// Get validation errors
const errors = {
  name: state === 'Sign Up' ? validateName(name) : '',
  email: validateEmail(email),
  password: validatePassword(password)
}

// Check if form is valid
const isFormValid = () => {
  if (state === 'Sign Up') {
    return !errors.name && !errors.email && !errors.password && name && email && password
  } else {
    return !errors.email && !errors.password && email && password
  }
}

// Handle field blur (mark as touched)
const handleBlur = (field) => {
  setTouched(prev => ({ ...prev, [field]: true }))
}

const onSubmitHandler = async (event) => {
  event.preventDefault()

  // Mark all fields as touched when form is submitted
  setTouched({
    name: state === 'Sign Up',
    email: true,
    password: true
  })

  // Validate form before submission
  if (!isFormValid()) {
    toast.error('Please fix the errors in the form')
    return
  }

  try {
    
    if (state === 'Sign Up') {
      
      const {data} = await axios.post(backendUrl +'/api/user/register', {name,password,email})
      if (data.success) {
        if (data.requiresVerification) {
          toast.success(data.message || 'Registration successful! Please check your email for the OTP code.')
          // Redirect to OTP verification page with email
          navigate(`/verify-otp?email=${encodeURIComponent(data.email || email)}`)
        } else {
          localStorage.setItem('token',data.token)
          setToken(data.token)
          toast.success('Account created successfully!')
        }
      } else{
        toast.error(data.message)
      }

    }else{

       const {data} = await axios.post(backendUrl +'/api/user/login', {password,email})
      if (data.success) {
        localStorage.setItem('token',data.token)
        setToken(data.token)
        toast.success('Login successful!')
      } else{
        if (data.requiresVerification) {
          toast.error(data.message)
          // Show option to resend verification email
          setState('Sign Up') // Switch to sign up to show resend option
        } else {
          toast.error(data.message)
        }
      }

    }

  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'An error occurred')
  }
}

useEffect(()=>{
  if (token) {
    navigate('/')
  }
},[token])

// Update state when URL parameter changes
useEffect(() => {
  const mode = searchParams.get('mode')
  if (mode === 'login') {
    setState('Login')
  } else if (mode === 'signup') {
    setState('Sign Up')
  }
}, [searchParams])

  // Reset form when switching between Sign Up and Login
  const handleStateChange = (newState) => {
    setState(newState)
    setTouched({ name: false, email: false, password: false })
    if (newState === 'Login') {
      setName('')
    }
    // Update URL to reflect the current mode
    const mode = newState === 'Login' ? 'login' : 'signup'
    navigate(`/Login?mode=${mode}`, { replace: true })
  }

  return (
   <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
    <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
      <p className='text-2xl font-semibold'>{state == 'Sign Up' ? "Create Account" : "Login"}</p>
      <p>Please {state == 'Sign Up' ? "sign up" : "login"} to book appointment</p>
      {
        state === "Sign Up" && (
          <div className='w-full'>
            <p>Full Name</p>
            <input 
              className={`border rounded w-full p-2 mt-1 ${
                touched.name && errors.name 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-zinc-300 focus:border-[#60A5FA] focus:ring-[#60A5FA]'
              } focus:outline-none focus:ring-1`}
              type="text" 
              onChange={(e)=>setName(e.target.value)} 
              onBlur={() => handleBlur('name')}
              value={name} 
              required 
            />
            {touched.name && errors.name && (
              <p className='text-red-500 text-xs mt-1'>{errors.name}</p>
            )}
          </div>
        )
      }
     
      <div className='w-full'>
        <p>Email</p>
        <input 
          className={`border rounded w-full p-2 mt-1 ${
            touched.email && errors.email 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-zinc-300 focus:border-[#60A5FA] focus:ring-[#60A5FA]'
          } focus:outline-none focus:ring-1`}
          type="email" 
          onChange={(e)=>setEmail(e.target.value)} 
          onBlur={() => handleBlur('email')}
          value={email} 
          required 
        />
        {touched.email && errors.email && (
          <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
        )}
      </div>
      <div className='w-full'>
        <p>Password</p>
        <input 
          className={`border rounded w-full p-2 mt-1 ${
            touched.password && errors.password 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-zinc-300 focus:border-[#60A5FA] focus:ring-[#60A5FA]'
          } focus:outline-none focus:ring-1`}
          type="password" 
          onChange={(e)=>setPassword(e.target.value)} 
          onBlur={() => handleBlur('password')}
          value={password} 
          required
        />
        {touched.password && errors.password && (
          <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
        )}
        {state === 'Sign Up' && !touched.password && (
          <p className='text-gray-400 text-xs mt-1'>Password must be at least 8 characters</p>
        )}
      </div>
      <button 
        type='submit' 
        className={`w-full py-2 rounded-md text-base transition-all ${
          isFormValid() 
            ? 'bg-[#60A5FA] text-white hover:bg-[#3B82F6]' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={!isFormValid()}
      >
        {state == 'Sign Up' ? "Create Account" : "Login"}
      </button>
      {
        state == "Sign Up"
        ? <p>Already have an account? <span onClick={()=>handleStateChange('Login')} className='text-[#60A5FA] underline cursor-pointer'> Login here</span></p>
        : <p>Create a new account? <span onClick={()=>handleStateChange('Sign Up')} className='text-[#60A5FA] underline cursor-pointer'>click here</span></p>
      }
    </div>

   </form>
  )
}

export default Login
