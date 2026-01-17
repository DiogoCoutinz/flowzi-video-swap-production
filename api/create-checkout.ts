import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

interface CheckoutRequest {
  email: string;
  userName: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { email, userName } = req.body as CheckoutRequest;

    if (!email || !userName) {
      return res.status(400).json({
        error: "Email e nome são obrigatórios",
      });
    }

    const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;
    if (!STRIPE_PRICE_ID) {
      console.error("STRIPE_PRICE_ID not configured");
      return res.status(500).json({
        error: "Configuração do servidor em falta",
      });
    }

    // Get the app URL for redirects
    const APP_URL = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.APP_URL || "http://localhost:8080";

    // Create Checkout Session with embedded mode and promotion codes enabled
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userName,
      },
      allow_promotion_codes: true, // Enable native Stripe promo code field
      return_url: `${APP_URL}/?checkout_session_id={CHECKOUT_SESSION_ID}`,
    });

    return res.status(200).json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Create checkout error:", error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({
        error: error.message,
      });
    }
    
    return res.status(500).json({
      error: "Erro ao criar sessão de pagamento",
    });
  }
}
