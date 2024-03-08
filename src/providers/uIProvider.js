import { createContext, useContext, useState } from 'react';

const UIContext = createContext();

function UIProvider({ children }) {
  const [isSidebarOpen, setIsSideBarOpen] = useState(false);

  return (
    <UIContext.Provider value={{ isSidebarOpen, setIsSideBarOpen }}>
      {children}
    </UIContext.Provider>
  );
}

function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error('Not inside the Provider');
  return context;
}

export { UIProvider, useUI };
