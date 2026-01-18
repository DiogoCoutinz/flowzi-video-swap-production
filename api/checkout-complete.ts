import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

// Helper for masking sensitive data in logs
function mask(str?: string) {
  if (!str) return "N/A";
  if (str.includes('@')) return str.replace(/(.{2})(.*)(?=@)/, "$1***"); // Email: di***@gmail.com
  return str.substring(0, 2) + "***"; // Name: Di***
}

function log(level: "INFO" | "ERROR" | "WARN", message: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const logData = { timestamp, level, message, ...data };
  console.log(JSON.stringify(logData));
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const verifyId = Math.random().toString(36).substring(7);
  
  log("INFO", "Checkout verification request", { verifyId, method: req.method });

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      log("ERROR", "Missing sessionId", { verifyId });
      return res.status(400).json({ error: "Session ID em falta" });
    }

    log("INFO", "Retrieving Stripe session", { verifyId });
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    log("INFO", "Stripe session retrieved", { 
      verifyId, 
      paymentStatus: session.payment_status,
      email: mask(session.customer_email || undefined),
    });

    if (session.payment_status !== "paid") {
      log("WARN", "Payment not confirmed", { verifyId, paymentStatus: session.payment_status });
      return res.status(400).json({ error: "Pagamento não confirmado" });
    }

    // --- GET DATA FROM METADATA ---
    let videoUrl = session.metadata?.videoUrl || "";
    const photoUrl = session.metadata?.photoUrl || "";
    const blobVideoUrl = videoUrl; // Original blob URL for deletion later

    // --- AUTO-CONVERT MOV TO MP4 IF NEEDED ---
    if (videoUrl.toLowerCase().includes('.mov')) {
      log("INFO", "MOV detected, converting via Cloudinary...", { verifyId });
      try {
        // We call our own convert API. In production VERCEL_URL is available.
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers.host;
        const convertUrl = `${protocol}://${host}/api/convert`;
        
        const convertRes = await fetch(convertUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoUrl })
        });
        
        if (convertRes.ok) {
          const convertData = await convertRes.json();
          videoUrl = convertData.url;
          log("INFO", "Conversion successful", { verifyId });
        } else {
          log("ERROR", "Conversion failed", { verifyId, status: convertRes.status });
        }
      } catch (convErr) {
        log("ERROR", "Conversion exception", { 
          verifyId, 
          error: convErr instanceof Error ? convErr.message : String(convErr) 
        });
      }
    }

    // --- FORWARD TO N8N FROM BACKEND (SECURITY) ---
    // This URL is now hidden from the client browser
    const n8nUrl = "https://n8n.diogocoutinho.cloud/webhook/videosaas";
    
    log("INFO", "Forwarding to n8n processor", { verifyId });

    try {
      const n8nResponse = await fetch(n8nUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photoUrl,
          videoUrl,      // MP4 URL (converted or original)
          blobVideoUrl,  // Original Blob URL for cleanup
          email: session.customer_email,
          userName: session.metadata?.userName,
          sessionId: session.id,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!n8nResponse.ok) {
        log("ERROR", "n8n communication failed", { verifyId, status: n8nResponse.status });
      } else {
        log("INFO", "✅ n8n processing triggered successfully", { verifyId });
      }
    } catch (n8nError) {
      log("ERROR", "Error calling n8n", { 
        verifyId, 
        error: n8nError instanceof Error ? n8nError.message : String(n8nError) 
      });
    }

    return res.status(200).json({
      success: true,
      email: session.customer_email,
      userName: session.metadata?.userName,
      photoUrl,
      videoUrl,
    });
  } catch (error) {
    log("ERROR", "Checkout verification error", { 
      verifyId, 
      error: error instanceof Error ? error.message : String(error)
    });
    return res.status(500).json({ error: "Erro ao verificar pagamento" });
  }
}
