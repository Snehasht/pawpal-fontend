import React, { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  const currencySymbol = 'Rs';
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';   // ✅ FIXED with fallback

  const [pets, setPets] = useState([]);
  // Get token from localStorage, ensure it's a valid string
  const getToken = () => {
    const storedToken = localStorage.getItem('token');
    return storedToken && storedToken !== 'false' && storedToken !== 'null' ? storedToken : null;
  };
  const [token, setToken] = useState(getToken());
  const [userData, setUserData] = useState({});

  const getPetsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/pet/list');
      if (data.success) {
        setPets(data.pets);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
        headers: { token }
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    pets,getPetsData,
    currencySymbol,
    token, setToken,
    backendUrl,
    userData, setUserData,
    loadUserProfileData
  };

  useEffect(() => {
    getPetsData();
    
    // Refresh pet data every 5 seconds to get real-time updates
    const interval = setInterval(() => {
      getPetsData();
    }, 5000); // Refresh every 5 seconds
    
    // Also refresh when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        getPetsData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData({});
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
