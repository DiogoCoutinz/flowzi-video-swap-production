import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import posthog from 'posthog-js';

// Initialize PostHog
if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com',
    person_profiles: 'always', 
    capture_pageview: true,
    persistence: 'localStorage',
    autocapture: true,
  });
}

createRoot(document.getElementById("root")!).render(<App />);
