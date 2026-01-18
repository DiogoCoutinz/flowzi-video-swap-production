import { del } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Helper for structured logging with PII masking
function log(level: "INFO" | "ERROR" | "WARN", message: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const logData = { timestamp, level, message, ...data };
  console.log(JSON.stringify(logData));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const requestId = Math.random().toString(36).substring(7);

  try {
    const { url } = req.body;
    const authHeader = req.headers.authorization;
    const DELETE_TOKEN = process.env.DELETE_TOKEN;

    // MANDATORY SECURITY CHECK: Token must be configured AND match
    if (!DELETE_TOKEN) {
      log("ERROR", "DELETE_TOKEN not configured on server", { requestId });
      return res.status(500).json({ error: 'Erro de configuração do servidor' });
    }

    if (authHeader !== `Bearer ${DELETE_TOKEN}`) {
      log("WARN", "Unauthorized delete attempt", { requestId, url });
      return res.status(401).json({ error: 'Não autorizado' });
    }

    if (!url) {
      return res.status(400).json({ error: 'URL é obrigatória' });
    }

    log("INFO", "Deleting blob", { requestId, url });
    await del(url);
    log("INFO", "✅ Blob deleted successfully", { requestId });

    return res.status(200).json({ success: true });
  } catch (error) {
    log("ERROR", "Delete error", { 
      requestId, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return res.status(500).json({ error: 'Falha ao apagar ficheiro' });
  }
}
