import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import posthog from 'posthog-js';

// Initialize PostHog
const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

if (typeof window !== 'undefined' && posthogKey) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    person_profiles: 'always', 
    capture_pageview: true,
    persistence: 'localStorage',
    autocapture: true,
  });
} else if (import.meta.env.DEV) {
  console.warn("PostHog key missing in .env");
}

createRoot(document.getElementById("root")!).render(<App />);
