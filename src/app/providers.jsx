'use client';

import { AppProvider } from '@/providers/appProvider';
import { AuthProvider } from '@/providers/authProvider';
import { UIProvider } from '@/providers/uiProvider';

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <UIProvider>
        <AppProvider>{children}</AppProvider>
      </UIProvider>
    </AuthProvider>
  );
};

export default Providers;
