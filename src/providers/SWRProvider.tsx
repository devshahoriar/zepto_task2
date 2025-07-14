import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';

interface SWRProviderProps {
  children: ReactNode;
}

// Global SWR configuration
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  dedupingInterval: 5000, // Cache for 5 seconds by default
  refreshInterval: 0, // Disable automatic polling
  shouldRetryOnError: true,
  onError: (error: Error) => {
    console.error('SWR Error:', error);
  },
};

export const SWRProvider = ({ children }: SWRProviderProps) => {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  );
};
