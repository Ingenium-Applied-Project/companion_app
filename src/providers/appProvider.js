import { createContext, useContext } from 'react';

const AppContext = createContext();

function AppProvider({ children }) {
  const getAppConfiguration = (payload) => {
    const { app = '' } = payload;

    //TODO: Return the requested configuration or return null
    return null;
  };
  return (
    <AppContext.Provider value={{ getAppConfiguration }}>
      {children}
    </AppContext.Provider>
  );
}

function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('Not inside the Provider');
  return context;
}

export { AppProvider, useApp };
