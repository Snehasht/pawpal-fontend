import React from 'react'
import { Route,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Pets from './pages/Pets'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './pages/Appointment'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'
import VerifyEmail from './pages/VerifyEmail'
import OTPVerification from './pages/OTPVerification'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <NavBar />
      <Routes>
<Route path='/' element={<Home />} /> 
<Route path='/pets' element={<Pets />} />
<Route path='/pets/:Breed' element={<Pets />} />
<Route path='/login' element={<Login />} />
<Route path='/about' element={<About />} />
<Route path='/contact' element={<Contact />} />
<Route path='/myprofile' element={<MyProfile />} />
<Route path='/myappointment' element={<MyAppointment />} />
<Route path='/appointment/:petId' element={<Appointment />} />
<Route path='/payment/success' element={<PaymentSuccess />} />
<Route path='/payment/failure' element={<PaymentFailure />} />
<Route path='/verify-email' element={<VerifyEmail />} />
<Route path='/verify-otp' element={<OTPVerification />} />

      </Routes>
      <Footer />
    </div>
    
  )
}

export default App
