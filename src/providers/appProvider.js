'use client';

import { HeroImageDefaultsCASM, LocalStorageKeys } from '@/constants/constants';
import config from '@/museumConfig';
import { retrieveData, storeData } from '@/utils/asyncStorage';
import { isBlobURL } from '@/utils/utils';
import { produce } from 'immer';
import { createContext, useContext, useEffect, useState } from 'react';

// Create a context for the app
const AppContext = createContext();

// Define the AppProvider component. This would provides functions necessary for the main functionality
function AppProvider({ children }) {
  const [currentApp, setCurrentApp] = useState('');

  //hero source image
  const [heroImage, setHeroImage] = useState(null); //original image
  const [heroImageText, setHeroImageText] = useState(''); // user's text (overlay)
  const [modifiedHeroImage, setModifiedHeroImage] = useState(); //modified image
  const [heroImageFilters, setHeroImageFilters] = useState(
    HeroImageDefaultsCASM
  );
  const [heroImageOriginalName, setHeroImageOriginalName] = useState('');

  useEffect(() => {}, []);

  /**
    When the hero image, or the filters is changed (e.g. user upload),
     the modified image is re-generated automatically.
   */
  useEffect(() => {
    const modifyHeroImage = async () => {
      await applyFiltersToHeroImage();
    };
    modifyHeroImage();
  }, [heroImage, heroImageFilters]);

  // returns app configuration based on given app name. Blank value would return current app config.
  const getAppConfiguration = (payload) => {
    const { app = 'CASM' } = payload;
    return config[app] || null;
  };

  // Hero Image functions - Start

  const readHeroImageFromLocalStorage = async () => {
    // TODO: Do not implement this. There is a complexity with local storage and images
    // eslint-disable-next-line no-constant-condition
    if (1 === 2) {
      try {
        const savedData = await retrieveData(LocalStorageKeys.HERO_IMAGE);
        console.warn('here', savedData);
        if (savedData) {
          const { sourceImage, filters, title = '' } = savedData;
          if (isBlobURL(sourceImage)) {
            setHeroImage(sourceImage);
          } else {
            setHeroImage(null);
          }
          setHeroImageFilters(filters);
          setHeroImageText(title);
        } else {
          setHeroImage(null);
          setHeroImageFilters(null);
          setHeroImageText('');
        }
      } catch (error) {
        setHeroImage(null);
        setModifiedHeroImage(null);
        setHeroImageText('');
        console.error(
          error || 'Error in readHeroImageFromLocalStorage function'
        );
      }
    }
  };

  const getHeroImageLocalStorageObject = (payload) => {
    const { sourceImage = null, filters = null } = payload;

    const returnObj = {
      sourceImage: sourceImage,
      filters: filters,
    };

    return returnObj;
  };

  // Uploaded hero image is stored in the context.
  // {image: e.target.files[0]}
  const setHeroSourceImage = async (payload) => {
    const { image = null } = payload;

    if (!image) return;
    let sourceImage = null;

    try {
      sourceImage = URL.createObjectURL(image);
      setHeroImage(sourceImage);
      setHeroImageOriginalName(image.name);
    } catch (error) {
      console.error(error);
    }

    try {
      if (sourceImage) {
        const localStorageObject = getHeroImageLocalStorageObject({
          sourceImage: sourceImage,
          // modifiedImage: modifiedHeroImage,
          filters: heroImageFilters,
        });
        await storeData(LocalStorageKeys.HERO_IMAGE, localStorageObject);
      }
    } catch (error) {
      console.error(
        'setHeroSourceImage problem at saving data into local storage',
        error
      );
    }
  };

  // Removes the hero image that was previously uploaded
  const removeHeroSourceImage = async (payload) => {
    setHeroImage(null);
    setHeroImageOriginalName('');
  };

  const updateHeroFilterValue = async (payload) => {
    const { name = '', value = 0 } = payload;

    const newFilters = produce(heroImageFilters, (draft) => {
      switch (name.toLowerCase()) {
        case 'gradientStartHeight'.toLowerCase():
          draft.gradientStartHeight = value / 100;
          break;
        case 'gradientEndHeight'.toLowerCase():
          draft.gradientEndHeight = value / 100 || 0;
          break;
        case 'gradientStartColor'.toLowerCase():
          draft.gradientStartColor = value || 'rgba(0,0,0,0.4)';
          break;
        case 'gradientEndColor'.toLowerCase():
          draft.gradientEndColor = value || 'rgba(0,0,0,1)';
          break;
        case 'fillRectHeight'.toLowerCase():
          draft.fillRectHeight = value / 100 || 0;
          break;
        case 'exportQuality'.toLowerCase():
          console.log('value', value);
          draft.exportQuality = parseInt(value); // 0..3
          break;
        default:
          break;
      }
    });

    setHeroImageFilters(newFilters);
  };

  const applyFiltersToHeroImage = async (payload) => {
    // always use the
    // TODO:
    // 1. Apply filter to the hero image and replace the modified one
    // 2. Save the current filter settings in the local storage

    if (!heroImage) {
      setModifiedHeroImage(null);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = heroImage;

    image.onload = () => {
      const height = image.height;
      const width = image.width;
      canvas.width = width;
      canvas.height = height;

      // Draw the original image
      ctx.drawImage(image, 0, 0, width, height);

      // Adjust gradient to cover the last 35% of the image height

      const gradientStart = height * heroImageFilters.gradientStartHeight;
      const gradientEnd = height * (heroImageFilters.gradientEndHeight || 1.0);

      // Create a gradient
      const gradient = ctx.createLinearGradient(
        0,
        gradientStart,
        0,
        gradientEnd
      );

      // gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(0, heroImageFilters.gradientStartColor);
      gradient.addColorStop(1, heroImageFilters.gradientEndColor);

      ctx.fillStyle = gradient;
      ctx.fillRect(
        0,
        gradientStart,
        width,
        height * (heroImageFilters.fillRectHeight || 1)
      ); // Fill the last 35%

      let quality = 0.95;

      switch (heroImageFilters.exportQuality) {
        case 0:
          quality = 0.33; //low
          break;
        case 1:
          quality = 0.7; // medium
          break;
        case 2:
          quality = 0.95; //high
          break;

        case 3:
          quality = 1; //highest
          break;

        default:
          quality = 0.95;
          break;
      }

      console.log('current quality', quality);

      // Convert canvas to image source
      const fileExtension = heroImage
        .split('.')
        .pop()
        .split('?')[0]
        .toLowerCase(); // Handles URLs with parameters and ensures lowercase
      let imageFormat;
      switch (fileExtension) {
        case 'png':
          imageFormat = 'image/png';
          break;
        case 'jpeg':
        case 'jpg':
          imageFormat = 'image/jpeg';
          break;
        case 'webp':
          imageFormat = 'image/webp';
          break;
        default:
          imageFormat = heroImageFilters.defaultExportFormat; // Fallback to JPEG if the format is not recognized
      }
      const modifiedSrc = canvas.toDataURL(imageFormat, quality);
      setModifiedHeroImage(modifiedSrc);
    };
  };

  const downloadModifiedHeroImage = async () => {
    // Create a temporary anchor (a) element

    if (!modifiedHeroImage || !heroImageOriginalName) return;
    // Extract the file name and extension
    const fileNameParts = heroImageOriginalName.split('.');
    const extension = fileNameParts.pop();
    const fileNameWithoutExtension = fileNameParts.join('.');
    const newFileName = `${fileNameWithoutExtension}-gradient.${extension}`;

    // Set the download attributes
    const element = document.createElement('a');
    element.setAttribute('href', modifiedHeroImage);
    element.setAttribute('download', newFileName);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Hero Image functions - End

  // System health check - Start

  const startSystemHealthCheck = async (payload) => {
    try {
      const response = await fetch('/api/healthCheck');
      if (!response.ok) {
        throw new Error('Failed to fetch health check. ', response.status);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  // System health check - End

  return (
    <AppContext.Provider
      value={{
        getAppConfiguration,
        heroImage, // Original hero image
        heroImageText, // Overlay text on the modified image
        modifiedHeroImage, // Modified version of the hero image (with gradient on it)
        heroImageFilters, // applied image filters on the hero image (TODO: Remove later)
        updateHeroFilterValue, // A utility function to update the hero image filters.
        setHeroSourceImage, // Called from the HeroImage component to set the hero image
        setHeroImageText, // Called from the Hero image component to set the heroImageText
        removeHeroSourceImage, // When user deletes the hero image
        downloadModifiedHeroImage, // When user clicks on "Download" button on the modified hero image

        startSystemHealthCheck, // Runs system health check
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
