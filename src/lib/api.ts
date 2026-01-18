// API client for Flowzi backend

const API_BASE = import.meta.env.PROD 
  ? "" // Same origin in production
  : ""; // Dev uses Vite proxy or same origin

export interface CheckoutRequest {
  email: string;
  userName: string;
  photoUrl?: string;
  videoUrl?: string;
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
  photoUrl?: string;
  videoUrl?: string;
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
 * Convert video to MP4 using Cloudinary API
 */
export async function convertVideo(videoUrl: string): Promise<string> {
  const response = await fetch('/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ videoUrl }),
  });

  const result = await response.json();
  if (!response.ok) {
    console.error("[Flowzi] Erro detalhado da conversão:", result);
    throw new Error(result.details || result.error || 'Erro na conversão do vídeo');
  }
  return result.url;
}

