'use client';

import { createContext, useContext, useEffect } from 'react';

// Create a context for the auth functionality
const AuthContext = createContext();

// Define the AuthProvider component. This would provides functions necessary for the user login

function AuthProvider({ children }) {
  useEffect(() => {
    // Log for testing purposes. Remove before deploying to production.
    console.log('Inside AuthProvider');
  }, []);
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

// Custom hook to use the AuthContext in other components.
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Not inside the Provider');
  return context;
}

export { AuthProvider, useAuth };
