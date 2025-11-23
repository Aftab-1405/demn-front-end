import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Setup React Query v5 with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000, // Data stays fresh for 1 minute
      gcTime: 10 * 60 * 1000, // React Query v5: renamed from cacheTime - garbage collect after 10 minutes
      refetchOnWindowFocus: false, // Don't refetch when user returns to tab (prevents flickering)
      refetchOnMount: true, // Refetch when component mounts if data is stale
      retry: 1, // Only retry once on failure
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// Register service worker for PWA functionality
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('[PWA] Service Worker registered successfully');
  },
  onUpdate: () => {
    console.log('[PWA] New version available');
  },
});