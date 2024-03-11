'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

// Define the UIProvider component. This would provides functions necessary for the  functionality
function UIProvider({ children }) {
  useEffect(() => {
    // Log for testing purposes. Remove before deploying to production.
    console.log('Inside UIProvider');
  }, []);

  // mobile-view, is the menu open or closed?
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <UIContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {children}
    </UIContext.Provider>
  );
}

// Custom hook to use the UIContext in other components.
function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error('Not inside the Provider');
  return context;
}

export { UIProvider, useUI };
