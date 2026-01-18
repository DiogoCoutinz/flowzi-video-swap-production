import { v2 as cloudinary } from 'cloudinary';
import type { VercelRequest, VercelResponse } from '@vercel/node';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  maxDuration: 60, // Aumenta timeout para 60 segundos (limite da Vercel Pro/Hobby)
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: 'videoUrl is required' });
    }

    console.log("[Flowzi] Converting MOV to MP4 via Cloudinary:", videoUrl);

    // Upload from URL and force H.264 MP4 conversion
    const result = await cloudinary.uploader.upload(videoUrl, {
      resource_type: 'video',
      format: 'mp4',
      transformation: [
        { video_codec: 'h264' }
      ]
    });

    console.log("[Flowzi] Conversion complete:", result.secure_url);

    return res.status(200).json({ 
      success: true, 
      url: result.secure_url 
    });

  } catch (error) {
    console.error('[Flowzi] Conversion error:', error);
    return res.status(500).json({ 
      error: 'Failed to convert video', 
      details: (error as Error).message 
    });
  }
}
