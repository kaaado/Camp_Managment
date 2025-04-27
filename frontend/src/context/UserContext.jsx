// context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import Cookie from 'cookie-universal';

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
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
        setUser(null);
      } else {
        setUser(sanitizeUser(userData));
      }
    } catch (error) {
      console.error('Error fetching user from cookies:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  // Logout function
  const logout = () => {
    cookies.remove('camp');
    cookies.remove('user');
    setUser(null);
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
      isAuthenticated,
      hasRole
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);