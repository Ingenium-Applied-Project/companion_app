'use client';

import { LocalStorageKeys } from '@/constants/constants';
import { storeData } from '@/utils/asyncStorage';
import { createContext, useContext, useEffect, useState } from 'react';

// Create a context for the app
const AppContext = createContext();

// Define the AppProvider component. This would provides functions necessary for the main functionality
function AppProvider({ children }) {
  const [currentApp, setCurrentApp] = useState('');

  //hero source image
  const [heroImage, setHeroImage] = useState(null);
  const [heroImageText, setHeroImageText] = useState('');

  //hero modified image and the filters
  const [modifiedHeroImage, setModifiedHeroImage] = useState({
    image: null,
    filters: {
      gradientStartHeight: 0.5,
      gradientEndHeight: 1,
      gradientStartColor: 'rgba(0,0,0,0)',
      gradientEndColor: 'rgba(0,0,0,1)',
      fillRectHeight: 0.8,
      exportQuality: 0.95,
      defaultExportFormat: 'image/jpeg',
    },
  });

  useEffect(() => {
    // Log for testing purposes. Remove before deploying to production.
    console.log('Inside AppProvider');
  }, []);

  useEffect(() => {
    console.log(
      'Hero image is changed. Apply filters and update the modified image'
    );
  }, [heroImage]);

  // returns app configuration based on given app name. Blank value would return current app config.
  const getAppConfiguration = (payload) => {
    const { app = '' } = payload;
  };

  // Hero Image functions - Start

  const readHeroImageFromLocalStorage = async () => {
    //TODO: read
  };

  const getHeroImageLocalStorageObject = (payload) => {
    const {
      sourceImage = null,
      modifiedImage = null,
      filters = null,
    } = payload;

    return { sourceImage, modifiedImage, filters };
  };

  // Uploaded hero image is stored in the context.
  // {image: e.target.files[0]}
  const setHeroSourceImage = async (payload) => {
    const { image = '' } = payload;
    if (!image) return;

    try {
      const sourceImage = URL.createObjectURL(image);

      try {
        const localStorageObject = getHeroImageLocalStorageObject({
          sourceImage,
          modifiedImage: modifiedHeroImage.image,
          filter: modifiedHeroImage.filter,
        });
        await storeData(LocalStorageKeys.HERO_IMAGE, localStorageObject);
      } catch (error) {
        console.error(
          'setHeroSourceImage problem at saving data into local storage',
          error
        );
      }

      setHeroImage(sourceImage);
    } catch (error) {
      return;
    }
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

  const downloadModifiedHeroImage = async () => {
    //TODO:
  };

  // Hero Image functions - End

  return (
    <AppContext.Provider
      value={{
        getAppConfiguration,
        heroImage,
        heroImageText,
        modifiedHeroImage,
        setHeroSourceImage,
        setHeroImageText,
        removeHeroSourceImage,
        applyFiltersToHeroImage,
      }}
    >
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
