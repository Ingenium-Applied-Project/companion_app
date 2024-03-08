'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Create a context for the app
const AppContext = createContext();

// Define the AppProvider component. This would provides functions necessary for the main functionality
function AppProvider({ children }) {
  const [currentApp, setCurrentApp] = useState('');

  const [heroImage, setHeroImage] = useState(null);
  const [modifiedHeroImage, setModifiedHeroImage] = useState(null);
  const [heroImageUserFilters, setHeroImageUserFilters] = useState({});

  useEffect(() => {
    // Log for testing purposes. Remove before deploying to production.
    console.log('Inside AppProvider');
  }, []);

  // returns app configuration based on given app name. Blank value would return current app config.
  const getAppConfiguration = (payload) => {
    const { app = '' } = payload;
  };

  // Hero Image functions - Start
  // Uploaded hero image is stored in the context.
  const setHeroSourceImage = async (payload) => {
    // TODO:
    // 1. Set the state
    // 2. Save it to local storage
    // 3. Apply filters with the existing parameters
    // 4. Generate the modified image
  };

  // Removes the hero image that was previously uploaded
  const removeHeroSourceImage = async (payload) => {
    // TODO:
    // 1. Reset the state
    // 2. Reset the local storage
    // 3. Reset the modified image.
  };

  const applyFiltersToHeroImage = async (payload) => {
    // TODO:
    // 1. Apply filter to the hero image and replace the modified one
    // 2. Save the current filter settings in the local storage
  };

  // Hero Image functions - End

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
