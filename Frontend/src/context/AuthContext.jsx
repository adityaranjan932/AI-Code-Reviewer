// Frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
// import axios from 'axios'; // Remove direct axios import
import { apiConnector } from '../services/apiConnector'; // Import apiConnector
import { toast } from 'react-toastify'; // Import toast

const AuthContext = createContext();

// Remove axiosInstance creation here, it will be used from apiConnector.js
// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:3000', // Your backend base URL
//   withCredentials: true, // Crucial for sending/receiving cookies
// });


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  // const [authModalReason, setAuthModalReason] = useState(''); // Remove reason if only for limit

  // Remove anonymous review count functions
  // const getAnonymousReviewCount = useCallback(() => { ... });
  // const incrementAnonymousReviewCount = useCallback(() => { ... });
  // const resetAnonymousReviewCount = useCallback(() => { ... });

  const openAuthModal = useCallback(() => { // Remove reason parameter
    // setAuthModalReason(reason);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    // setAuthModalReason('');
  }, []);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      // This endpoint will verify the cookie and return user data
      // const response = await axiosInstance.get('/api/auth/me'); // Old way
      const response = await apiConnector('GET', '/api/auth/me'); // New way
      if (response.data.status === 'success') {
        setUser(response.data.data.user);
      } else {
        // No active session or an error occurred
        setUser(null);
      }
    } catch (error) {
      // Likely a 401 if no session, or network error
      setUser(null);
      console.log('No active session or error fetching user:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await apiConnector('POST', '/api/auth/login', { email, password });
      if (response.data.status === 'success') {
        setUser(response.data.data.user);
        // resetAnonymousReviewCount(); // Remove reset
        closeAuthModal();
        toast.success("Logged in successfully!"); 
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(errorMessage); 
      return { success: false, message: errorMessage };
    }
    toast.error('Login failed'); 
    return { success: false, message: 'Login failed' }; 
  };

  const signup = async (firstName, lastName, email, password) => {
    try {
      const response = await apiConnector('POST', '/api/auth/signup', { firstName, lastName, email, password });
      if (response.data.status === 'success') {
        setUser(response.data.data.user);
        // resetAnonymousReviewCount(); // Remove reset
        closeAuthModal();
        toast.success("Signed up successfully!"); 
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      console.error("Signup failed:", error.response?.data || error.message);
      toast.error(errorMessage); 
      return { success: false, message: errorMessage };
    }
    toast.error('Signup failed'); 
     return { success: false, message: 'Signup failed' }; 
  };

  const logout = async () => {
    try {
      // await axiosInstance.get('/api/auth/logout'); // Old way
      await apiConnector('GET', '/api/auth/logout'); // New way
      setUser(null);
      toast.info("Logged out successfully."); 
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear user state on frontend even if backend call fails
      setUser(null);
      toast.error("Logout failed on server, logged out locally."); 
    }
  };

  const selectHistoryItem = useCallback((item) => {
    setSelectedHistoryItem({
      code: item.prompt,
      review: item.reviewContent,
      language: item.language,
      id: item._id || Date.now(), // Use history item's ID or a timestamp
    });
  }, []);

  const clearSelectedHistoryItem = useCallback(() => {
    setSelectedHistoryItem(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      selectedHistoryItem,
      selectHistoryItem,
      clearSelectedHistoryItem,
      fetchUser,
      authModalOpen,
      // authModalReason, // Remove reason
      openAuthModal,
      closeAuthModal
      // getAnonymousReviewCount, // Remove review count functions
      // incrementAnonymousReviewCount
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
