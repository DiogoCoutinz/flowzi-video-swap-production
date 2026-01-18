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

  // 1. Configuração do Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  try {
    if (!videoUrl) {
      return res.status(400).json({ error: 'URL do vídeo em falta' });
    }

    console.log("[Flowzi] Cloudinary Config:", {
      cloud: process.env.CLOUDINARY_CLOUD_NAME,
      key: process.env.CLOUDINARY_API_KEY ? "CONFIGURADA ✅" : "FALTA ❌",
      secret: process.env.CLOUDINARY_API_SECRET ? "CONFIGURADA ✅" : "FALTA ❌"
    });

    console.log("[Flowzi] A tentar converter vídeo de:", videoUrl);

    // 2. Upload para Cloudinary com conversão forçada para MP4 H.264
    const result = await cloudinary.uploader.upload(videoUrl, {
      resource_type: 'video',
      folder: 'flowzi_conversions',
      format: 'mp4',
      video_codec: 'h264', // Codec que o Kie.ai exige
      bit_rate: '2m',
      quality: 'auto'
    });

    console.log("[Flowzi] Conversão OK:", result.secure_url);

    return res.status(200).json({ 
      success: true, 
      url: result.secure_url 
    });

  } catch (error: any) {
    console.error('[Flowzi] Erro no Cloudinary:', error);
    
    // Devolvemos o erro detalhado para o frontend nos mostrar no console
    return res.status(500).json({ 
      error: 'Falha na conversão Cloudinary', 
      details: error.message || 'Erro desconhecido',
      cloudinary_error: error
    });
  }
}
