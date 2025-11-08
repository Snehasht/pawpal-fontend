import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import {AppContext} from '../context/AppContextProvider';

const NavBar = () => {

    const navigate = useNavigate();

    const {token, setToken, userData, setUserData} = useContext(AppContext)

    const [showMenu, setShowMenu] = useState(false)

    const logout = () => {
        // Clear token
        setToken(null)
        localStorage.removeItem('token')
        // Clear user data immediately
        setUserData({})
        // Navigate to home page
        navigate('/')
        // Close profile menu if open
        setShowProfileMenu(false)
    }
    // 💡 NEW STATE: Control the profile dropdown visibility
    const [showProfileMenu, setShowProfileMenu] = useState(false) 
    
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img onClick={()=>navigate('/')} className='cursor-pointer' src={assets.Logo} alt="" />
        <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
            <li className='py-1' >
                HOME
            </li>
            <hr className='border-none outline-none h-0.5  bg-[#60A5FA] w-3/5 m-auto '/>
        </NavLink>
        <NavLink to='/pets'>
        <li className='py-1' >
                ALL PETS
            </li>
            <hr className='border-none outline-none h-0.5  bg-[#60A5FA] w-3/5 m-auto '/>
        </NavLink>
        <NavLink to='about'>
        <li className='py-1' >
                ABOUT
            </li>
            <hr className='border-none outline-none h-0.5 bg-[#60A5FA] w-3/5 m-auto '/>
        </NavLink>
        <NavLink to='contact'>
        <li className='py-1' >
                CONTACT
            </li>
            <hr className='border-none outline-none h-0.5  bg-[#60A5FA] w-3/5 m-auto '/>
        </NavLink>
        </ul>
      <div className='flex items-center gap-4'>
        {
            token && userData
            ?<div 
                // 💡 FIX: Toggle dropdown menu on click for touchscreens
                onClick={() => setShowProfileMenu(!showProfileMenu)} 
                className='flex items-center gap-2 cursor-pointer relative'
            >
                <img className='w-8 rounded-full' src={userData.image} alt="" />
                <img className='w-2.5' src={assets.dropdown} alt="" />
                
                {/* 💡 FIX: Control visibility using state, increased z-index */}
                <div className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-30 ${showProfileMenu ? 'block' : 'hidden'}`}>
                    <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                        {/* Ensure menu closes after navigation/action */}
                        <p onClick={() => navigate('MyProfile') //setShowProfileMenu(false);}
                        }className='hover:text-black cursor-pointer'>My Profile</p>
                        <p onClick={() => navigate('MyAppointment')// setShowProfileMenu(false);}
                       } className='hover:text-black cursor-pointer'>Appointment</p>
                        <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                    </div>
                </div>
            </div>
            : <div className='flex items-center gap-3 hidden md:flex'>
                <button onClick={()=>navigate('/Login?mode=login')} className='border border-[#60A5FA] text-[#60A5FA] px-8 py-3 rounded-full font-light hover:bg-[#60A5FA] hover:text-white transition-all duration-300' >Login</button>
                <button onClick={()=>navigate('/Login?mode=signup')} className='bg-[#60A5FA] text-white px-8 py-3 rounded-full font-light hover:opacity-90 transition-all duration-300' >Create Account</button>
              </div>
        }
        <img onClick={()=>setShowMenu(true)} className='w-6 md:hidden' src={assets.menu} alt="" />
        {/*----mobile menu ------ */}
        <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all `}>
            <div className='flex items-center justify-between px-5 py-6'>
                <img className='w-36' src={assets.Logo} alt="" />
                <img className='w-7' onClick={()=>setShowMenu(false)} src={assets.cross} alt="" />
            </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink  onClick={()=> setShowMenu(false)} to='/'> <p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
            <NavLink  onClick={()=> setShowMenu(false)} to='/pets'><p className='px-4 py-2 rounded inline-block'>ALL PETS</p></NavLink>
            <NavLink  onClick={()=> setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
            <NavLink  onClick={()=> setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
          </ul>
          {!token && (
            <div className='flex flex-col items-center gap-3 mt-5 px-5'>
              <button onClick={()=> {navigate('/Login?mode=login'); setShowMenu(false);}} className='w-full border border-[#60A5FA] text-[#60A5FA] px-8 py-3 rounded-full font-light hover:bg-[#60A5FA] hover:text-white transition-all duration-300' >Login</button>
              <button onClick={()=> {navigate('/Login?mode=signup'); setShowMenu(false);}} className='w-full bg-[#60A5FA] text-white px-8 py-3 rounded-full font-light hover:opacity-90 transition-all duration-300' >Create Account</button>
            </div>
          )}
        </div>
       
      </div>
    </div>
  )
}

export default NavBar