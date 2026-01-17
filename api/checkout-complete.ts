import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID em falta" });
    }

    // Retrieve the session to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Pagamento não confirmado" });
    }

    // Return success - frontend will handle Kie.ai submission
    return res.status(200).json({
      success: true,
      email: session.customer_email,
      userName: session.metadata?.userName,
    });
  } catch (error) {
    console.error("Checkout complete error:", error);
    return res.status(500).json({
      error: "Erro ao verificar pagamento",
    });
  }
}
