// API client for Flowzi backend

const API_BASE = import.meta.env.PROD 
  ? "" // Same origin in production
  : ""; // Dev uses Vite proxy or same origin

export interface CheckoutRequest {
  email: string;
  userName: string;
}

export interface CheckoutResponse {
  clientSecret: string;
  sessionId: string;
  error?: string;
}

export interface CheckoutCompleteResponse {
  success: boolean;
  email: string;
  userName: string;
  error?: string;
}

export interface GenerateVideoRequest {
  photoUrl: string;
  videoUrl: string;
  email: string;
  userName: string;
}

export interface GenerateVideoResponse {
  success: boolean;
  taskId: string;
  message: string;
  error?: string;
}

export interface CheckVideoResponse {
  taskId: string;
  state: "pending" | "processing" | "success" | "fail";
  stateMessage: string;
  videoUrl?: string;
  error?: string;
}

/**
 * Create Stripe Checkout session for embedded payment
 */
export async function createCheckoutSession(
  data: CheckoutRequest
): Promise<CheckoutResponse> {
  const response = await fetch(`${API_BASE}/api/create-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let result;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    result = await response.json();
  } else {
    const text = await response.text();
    console.error("Server returned non-JSON response:", text);
    throw new Error(`Erro no servidor (${response.status}). Verifica as logs na Vercel.`);
  }

  if (!response.ok) {
    throw new Error(result.error || "Erro ao criar sessão de pagamento");
  }

  return result;
}

/**
 * Verify checkout payment was successful
 */
export async function verifyCheckout(
  sessionId: string
): Promise<CheckoutCompleteResponse> {
  const response = await fetch(`${API_BASE}/api/checkout-complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Erro ao verificar pagamento");
  }

  return result;
}

/**
 * Start video generation on Kie.ai (call AFTER payment confirmed)
 */
export async function generateVideo(
  data: GenerateVideoRequest
): Promise<GenerateVideoResponse> {
  const response = await fetch(`${API_BASE}/api/generate-video`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Erro ao iniciar geração do vídeo");
  }

  return result;
}

/**
 * Check video generation status
 */
export async function checkVideoStatus(
  taskId: string
): Promise<CheckVideoResponse> {
  const response = await fetch(`${API_BASE}/api/check-video?taskId=${taskId}`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Erro ao verificar estado do vídeo");
  }

  return result;
}

import { upload } from '@vercel/blob/client';

/**
 * Upload file directly to Vercel Blob from the client (browser)
 * This avoids the 4.5MB limit of server-side uploads.
 */
export async function uploadFile(file: File): Promise<string> {
  const blob = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
  });

  return blob.url;
}

/**
 * Poll for video status with exponential backoff
 */
export function pollVideoStatus(
  taskId: string,
  onUpdate: (status: CheckVideoResponse) => void,
  options: {
    maxAttempts?: number;
    initialInterval?: number;
    maxInterval?: number;
  } = {}
): { stop: () => void } {
  const {
    maxAttempts = 20, // 10 minutes with 30s intervals
    initialInterval = 30000, // 30 seconds
    maxInterval = 60000, // 1 minute max
  } = options;

  let attempts = 0;
  let interval = initialInterval;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;

  const poll = async () => {
    if (stopped) return;

    try {
      const status = await checkVideoStatus(taskId);
      onUpdate(status);

      if (status.state === "success" || status.state === "fail") {
        // Done - stop polling
        return;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        onUpdate({
          taskId,
          state: "pending",
          stateMessage: "A demorar mais que o esperado. Vais receber por email quando estiver pronto.",
        });
        return;
      }

      // Exponential backoff (up to max)
      interval = Math.min(interval * 1.2, maxInterval);
      timeoutId = setTimeout(poll, interval);
    } catch (error) {
      console.error("Poll error:", error);
      // Continue polling on error
      attempts++;
      if (attempts < maxAttempts) {
        timeoutId = setTimeout(poll, interval);
      }
    }
  };

  // Start polling
  timeoutId = setTimeout(poll, initialInterval);

  return {
    stop: () => {
      stopped = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    },
  };
}
