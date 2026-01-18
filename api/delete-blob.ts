import { del } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    const authHeader = req.headers.authorization;
    const DELETE_TOKEN = process.env.DELETE_TOKEN;

    if (DELETE_TOKEN && authHeader !== `Bearer ${DELETE_TOKEN}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    await del(url);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Delete failed' });
  }
}
