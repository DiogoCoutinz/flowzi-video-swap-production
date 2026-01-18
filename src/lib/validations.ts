import { z } from "zod";

// Image validation schema
export const imageValidationSchema = z.object({
  file: z.custom<File>((file) => file instanceof File, {
    message: "Ficheiro inválido",
  })
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "A imagem deve ter no máximo 10 MB",
  })
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    { message: "Formato inválido. Use JPG, PNG ou WEBP" }
  ),
});

// Video validation schema
export const videoValidationSchema = z.object({
  file: z.custom<File>((file) => file instanceof File, {
    message: "Ficheiro inválido",
  })
  .refine((file) => file.size <= 100 * 1024 * 1024, {
    message: "O vídeo deve ter no máximo 100 MB",
  })
  .refine(
    (file) => ['video/mp4', 'video/quicktime'].includes(file.type),
    { message: "Formato inválido. Use MP4 ou MOV" }
  ),
});

// Validate image dimensions and aspect ratio
export const validateImageDimensions = (
  width: number,
  height: number
): { valid: boolean; error?: string } => {
  const minDimension = Math.max(width, height);
  
  if (minDimension < 300) {
    return { valid: false, error: "O lado maior deve ter pelo menos 300px" };
  }

  // Calculate aspect ratio
  const aspectRatio = width / height;
  const minRatio = 2 / 5; // 0.4 (2:5)
  const maxRatio = 5 / 2; // 2.5 (5:2)

  if (aspectRatio < minRatio || aspectRatio > maxRatio) {
    return { 
      valid: false, 
      error: "Proporção inválida. Use entre 2:5 e 5:2" 
    };
  }

  return { valid: true };
};

// Validate video duration
export const validateVideoDuration = (
  duration: number,
  maxDuration: number = 12
): { valid: boolean; error?: string } => {
  if (duration > maxDuration) {
    return { 
      valid: false, 
      error: `O vídeo deve ter no máximo ${maxDuration} segundos` 
    };
  }
  return { valid: true };
};

// Helper to get image dimensions
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error("Não foi possível ler a imagem"));
    img.src = URL.createObjectURL(file);
  });
};

// Helper to get video dimensions
export const getVideoDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Timeout ao ler dimensões do vídeo"));
    }, 5000);

    const cleanup = () => {
      clearTimeout(timeout);
      video.onloadedmetadata = null;
      video.onerror = null;
      if (video.src) window.URL.revokeObjectURL(video.src);
    };

    video.onloadedmetadata = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      cleanup();
      if (width > 0 && height > 0) {
        resolve({ width, height });
      } else {
        reject(new Error("Vídeo com dimensões inválidas (0x0)"));
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Não foi possível ler as dimensões do vídeo"));
    };

    video.src = URL.createObjectURL(file);
  });
};

// Helper to get video duration
export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => reject(new Error("Não foi possível ler o vídeo"));
    video.src = URL.createObjectURL(file);
  });
};

// Comprehensive image validation
export const validateImage = async (file: File): Promise<{ valid: boolean; error?: string }> => {
  // Check file type and size
  const basicValidation = imageValidationSchema.safeParse({ file });
  if (!basicValidation.success) {
    return { valid: false, error: basicValidation.error.errors[0]?.message };
  }

  // Check dimensions
  try {
    const dimensions = await getImageDimensions(file);
    return validateImageDimensions(dimensions.width, dimensions.height);
  } catch {
    return { valid: false, error: "Não foi possível ler a imagem" };
  }
};

// Comprehensive video validation
export const validateVideo = async (
  file: File,
  maxDuration: number = 12
): Promise<{ valid: boolean; error?: string }> => {
  // Check file type and size
  const basicValidation = videoValidationSchema.safeParse({ file });
  if (!basicValidation.success) {
    return { valid: false, error: basicValidation.error.errors[0]?.message };
  }

  // Check duration and dimensions
  try {
    const [duration, dimensions] = await Promise.all([
      getVideoDuration(file),
      getVideoDimensions(file)
    ]);

    const durationValidation = validateVideoDuration(duration, maxDuration);
    if (!durationValidation.valid) return durationValidation;

    // Both dimensions must be at least 720
    if (dimensions.width < 720 || dimensions.height < 720) {
      return { 
        valid: false, 
        error: `Resolução muito baixa (${dimensions.width}x${dimensions.height}). Mínimo: 720x720` 
      };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: "Não foi possível ler o vídeo" };
  }
};
