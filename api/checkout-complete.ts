import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

// Helper for structured logging
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

    log("INFO", "Retrieving Stripe session", { verifyId, sessionId });
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    log("INFO", "Stripe session retrieved", { 
      verifyId, 
      sessionId,
      paymentStatus: session.payment_status,
      email: session.customer_email,
      userName: session.metadata?.userName,
      amountTotal: session.amount_total
    });

    if (session.payment_status !== "paid") {
      log("WARN", "Payment not confirmed", { verifyId, sessionId, paymentStatus: session.payment_status });
      return res.status(400).json({ error: "Pagamento não confirmado" });
    }

    log("INFO", "✅ Payment verified successfully", { 
      verifyId, 
      sessionId, 
      email: session.customer_email,
      userName: session.metadata?.userName
    });

    return res.status(200).json({
      success: true,
      email: session.customer_email,
      userName: session.metadata?.userName,
      photoUrl: session.metadata?.photoUrl,
      videoUrl: session.metadata?.videoUrl,
    });
  } catch (error) {
    log("ERROR", "Checkout verification error", { 
      verifyId, 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return res.status(500).json({ error: "Erro ao verificar pagamento" });
  }
}
