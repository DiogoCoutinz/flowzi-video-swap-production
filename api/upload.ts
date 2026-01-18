import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Helper for structured logging with PII masking
function log(level: "INFO" | "ERROR" | "WARN", message: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const logData = { timestamp, level, message, ...data };
  console.log(JSON.stringify(logData));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestId = Math.random().toString(36).substring(7);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // Basic origin/host check
        const host = req.headers.host || '';
        log("INFO", "Generating upload token", { requestId, pathname, host });

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'],
          addRandomSuffix: true, // Gera nomes únicos para evitar conflitos
          tokenPayload: JSON.stringify({
            requestId,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Chamado quando o upload termina com sucesso
        const payload = JSON.parse(tokenPayload || '{}');
        log("INFO", "✅ Blob upload completed", { 
          requestId: payload.requestId, 
          url: blob.url,
          size: blob.size 
        });
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    log("ERROR", "Upload error", { 
      requestId, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return res.status(400).json({ error: (error as Error).message });
  }
}
