import { createContext, useContext } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Not inside the Provider');
  return context;
}

export { AuthProvider, useAuth };
