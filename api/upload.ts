import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const body = req.body as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // Aqui podes validar se o utilizador pode fazer upload
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
          addRandomSuffix: true, // Gera nomes únicos para evitar conflitos
          tokenPayload: JSON.stringify({
            // Informação extra se quiseres
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Chamado quando o upload termina com sucesso
        console.log('Blob upload completed:', blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}
