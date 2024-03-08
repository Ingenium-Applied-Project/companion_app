'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Create a context for the app
const AppContext = createContext();

// Define the AppProvider component. This would provides functions necessary for the main functionality
function AppProvider({ children }) {
  const [currentApp, setCurrentApp] = useState('');

  useEffect(() => {
    // Log for testing purposes. Remove before deploying to production.
    console.log('Inside AppProvider');
  }, []);

  // returns app configuration based on given app name. Blank value would return current app config.
  const getAppConfiguration = (payload) => {
    const { app = '' } = payload;
  };

  return (
    <AppContext.Provider value={{ getAppConfiguration }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the AppContext in other components.
function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('Not inside the Provider');
  return context;
}

export { AppProvider, useApp };
