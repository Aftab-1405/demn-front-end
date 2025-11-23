/**
 * Service Worker Registration for D.E.M.N PWA
 * This file handles the registration and lifecycle of the service worker
 * Updated for Vite - Vite PWA plugin handles automatic registration
 */

// Removed unused isLocalhost variable

export function register(config) {
  // Vite PWA plugin handles service worker registration automatically
  // This function is kept for backward compatibility and custom callbacks
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const publicUrl = new URL(baseUrl, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      // Vite PWA plugin will register the service worker
      // But we can still listen for updates
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          if (config && config.onSuccess) {
            config.onSuccess(registration);
          }
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  if (config && config.onUpdate) {
                    config.onUpdate(registration);
                  }
                }
              });
            }
          });
        });
      }
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('[PWA] Service Worker unregistration failed:', error);
      });
  }
}

/**
 * Show a notification when a new version is available
 * Currently unused - kept for future implementation
 */
// eslint-disable-next-line no-unused-vars
function showUpdateNotification(registration) {
  const shouldShowPrompt = window.confirm(
    'A new version of D.E.M.N is available! Click OK to update.'
  );

  if (shouldShowPrompt) {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('[PWA] This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;

    // Check if already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      return existingSubscription;
    }

    // Subscribe to push notifications
    // Note: You'll need to replace this with your actual VAPID public key
    const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY_HERE';
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    console.log('[PWA] Push notification subscription successful');
    return subscription;
  } catch (error) {
    console.error('[PWA] Failed to subscribe to push notifications:', error);
    return null;
  }
}

/**
 * Utility function to convert VAPID key
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if app is running as PWA
 */
export function isPWA() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

/**
 * Prompt user to install PWA
 */
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('[PWA] Install prompt available');
});

export function showInstallPrompt() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  } else {
    console.log('[PWA] Install prompt not available');
  }
}

export function canInstallPWA() {
  return deferredPrompt !== null;
}
