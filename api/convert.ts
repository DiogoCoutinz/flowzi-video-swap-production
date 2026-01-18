import { v2 as cloudinary } from 'cloudinary';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  maxDuration: 60,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { videoUrl } = req.body;

  // Configuração com .trim() para evitar erros de espaços ao copiar/colar
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true
  });

  try {
    if (!videoUrl) {
      return res.status(400).json({ error: 'URL do vídeo em falta' });
    }

    if (!cloud_name || !api_key || !api_secret) {
      return res.status(500).json({ error: 'Configuração do Cloudinary incompleta na Vercel' });
    }

    console.log("[Flowzi] A converter via Cloudinary:", { cloud_name, videoUrl });

    const result = await cloudinary.uploader.upload(videoUrl, {
      resource_type: 'video',
      folder: 'flowzi_conversions',
      format: 'mp4',
      video_codec: 'h264',
      quality: 'auto:best',
      transformation: [
        // Esta transformação garante que se o vídeo for vertical (como 576x1024), 
        // ele é redimensionado para ter pelo menos 720px de largura mantendo a proporção.
        // O "if" do Cloudinary é potente: se a largura for menor que 720, escala para 720.
        { if: "w_lt_720", width: 720, crop: "scale" },
        // Se após isso a altura ainda for menor que 720 (vídeos muito largos), escala a altura.
        { if: "h_lt_720", height: 720, crop: "scale" }
      ]
    });

    return res.status(200).json({ 
      success: true, 
      url: result.secure_url 
    });

  } catch (error: any) {
    console.error('[Flowzi] Erro Cloudinary:', error);
    return res.status(500).json({ 
      error: 'Falha na conversão', 
      details: error.message,
      cloudinary_error: error
    });
  }
}
