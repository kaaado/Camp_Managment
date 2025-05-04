// context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import Cookie from 'cookie-universal';

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const cookies = Cookie();

  // Sanitize user data before storing (remove sensitive fields like password)
  const sanitizeUser = (userData) => {
    if (!userData) return null;
    const { password, ...safeUserData } = userData;
    return safeUserData;
  };

  // Function to fetch user data from cookies
  const fetchUser = () => {
    try {
      const token = cookies.get('camp');
      const userData = cookies.get('user');
      
      if (!token || !userData) {
        setUserState(null);
      } else {
        setUserState(sanitizeUser(userData));
      }
    } catch (error) {
      console.error('Error fetching user from cookies:', error);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  };

  // Set user data in both state and cookies
  const setUser = (userData) => {
    const sanitizedData = sanitizeUser(userData);
    setUserState(sanitizedData);
    
    // Set cookie with expiration (e.g., 7 days)
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    
    cookies.set('user', sanitizedData, { path: '/', expires });
  };

  // Logout function
  const logout = () => {
    cookies.remove('camp');
    cookies.remove('user');
    setUserState(null);
  };

  // Check authentication status
  const isAuthenticated = () => {
    return !!user && !!cookies.get('camp');
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.type === role;
  };

  // Fetch user on initial load
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      logout, 
      fetchUser,
      setUser,
      isAuthenticated,
      hasRole
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);