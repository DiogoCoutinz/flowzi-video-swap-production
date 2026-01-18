import posthog from 'posthog-js';

/**
 * Global event tracking utility for GA and PostHog
 */

declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set',
      eventName: string,
      eventParams?: Record<string, any>
    ) => void;
  }
}

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  // 1. Track in Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    const gaId = import.meta.env.VITE_GA_ID;
    window.gtag('event', eventName, {
      ...params,
      send_to: gaId
    });
  }

  // 2. Track in PostHog
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(eventName, params);
  }

  // Fallback/Debug
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${eventName}`, params);
  }
};

export const identifyUser = (email: string, name?: string) => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.identify(email, {
      email,
      name,
    });
  }
};
