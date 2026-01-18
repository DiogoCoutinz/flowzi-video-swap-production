import { v2 as cloudinary } from 'cloudinary';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  maxDuration: 60,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Configuração interna para garantir que lê as variáveis da Vercel
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: 'videoUrl is required' });
    }

    // Validação de segurança para variáveis
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      console.error("[Flowzi] ERRO: Variáveis do Cloudinary em falta no ambiente Vercel!");
      return res.status(500).json({ error: 'Servidor não configurado (Cloudinary ENV missing)' });
    }

    console.log("[Flowzi] Iniciando conversão Cloudinary para:", videoUrl);

    // Upload a partir da URL do Vercel Blob
    const result = await cloudinary.uploader.upload(videoUrl, {
      resource_type: 'video',
      folder: 'flowzi_conversions',
      format: 'mp4',
      transformation: [
        { codec: 'h264', bit_rate: '2m' }, // Garante formato compatível com Kie.ai
        { quality: 'auto' }
      ]
    });

    console.log("[Flowzi] Conversão terminada com sucesso:", result.secure_url);

    return res.status(200).json({ 
      success: true, 
      url: result.secure_url 
    });

  } catch (error) {
    const err = error as any;
    console.error('[Flowzi] Erro fatal no Cloudinary:', {
      message: err.message,
      http_code: err.http_code,
      name: err.name
    });
    
    return res.status(500).json({ 
      error: 'Falha na conversão', 
      details: err.message 
    });
  }
}
