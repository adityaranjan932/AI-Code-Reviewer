// Frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configure axios to send cookies with requests
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Your backend base URL
  withCredentials: true, // Crucial for sending/receiving cookies
});


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading until initial check is done

  // Function to fetch user data (e.g., on initial load or after login)
  // This is a placeholder - ideally, you'd have a '/me' endpoint
  // protected by the 'protect' middleware in the backend.
  // For now, we'll rely on login/signup setting the user.
  const fetchUser = useCallback(async () => {
     // In a real app, you might have an endpoint like '/api/auth/me'
     // to verify the cookie and get user data on page load.
     // For simplicity here, we assume if login/signup was successful,
     // the user state is set.
     // You could add a check here: if a cookie exists, try to verify it
     setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      if (response.data.status === 'success') {
        setUser(response.data.data.user);
        return { success: true };
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
    return { success: false, message: 'Login failed' }; // Default failure
  };

  const signup = async (firstName, lastName, email, password) => { // Add firstName, lastName
     // Note: Backend currently logs user in immediately after signup
    try {
      // Include firstName and lastName in the request body
      const response = await axiosInstance.post('/api/auth/signup', { firstName, lastName, email, password });
      if (response.data.status === 'success') {
        setUser(response.data.data.user); // Set user state after successful signup/login
        return { success: true };
      }
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
     return { success: false, message: 'Signup failed' }; // Default failure
  };

  const logout = async () => {
    try {
      await axiosInstance.get('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear user state on frontend even if backend call fails
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
