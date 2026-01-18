/**
 * Google Analytics event tracking utility
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
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  } else {
    console.warn(`GA tag not found. Event ${eventName} not tracked.`, params);
  }
};
