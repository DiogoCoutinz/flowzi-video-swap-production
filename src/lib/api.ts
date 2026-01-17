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

  const result = await response.json();

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

/**
 * Upload file to get URL
 * 
 * ⚠️ PRODUCTION WARNING: This uses base64 data URLs which:
 * - Will fail for large videos (100MB = ~133MB base64)
 * - Will hit request body limits
 * 
 * For production, implement upload to S3/Cloudflare R2:
 * 1. Get presigned URL from backend
 * 2. Upload directly to S3 from browser
 * 3. Return the S3 URL
 */
export async function uploadFile(file: File): Promise<string> {
  // For files > 5MB, warn in console
  if (file.size > 5 * 1024 * 1024) {
    console.warn(`Large file upload (${(file.size / 1024 / 1024).toFixed(1)}MB) - consider implementing S3 upload`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => reject(new Error("Erro ao ler ficheiro"));
    reader.readAsDataURL(file);
  });
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
