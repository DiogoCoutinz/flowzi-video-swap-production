import type { VercelRequest, VercelResponse } from "@vercel/node";

interface KieAiCallback {
  taskId: string;
  state: "pending" | "processing" | "success" | "fail";
  resultJson?: string;
  errorMsg?: string;
}

interface KieAiResult {
  resultUrls?: string[];
}

function generateSuccessEmailHtml(userName: string, videoUrl: string): string {
  const year = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', -apple-system, sans-serif; background: #0f172a; color: #f1f5f9; margin: 0; padding: 40px 20px; }
    .container { max-width: 500px; margin: 0 auto; background: linear-gradient(145deg, #1e293b, #0f172a); border-radius: 16px; padding: 40px; border: 1px solid #334155; }
    h1 { color: #3b82f6; margin: 0 0 20px; font-size: 24px; }
    p { line-height: 1.6; color: #94a3b8; margin: 0 0 20px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #3b82f6, #a855f7); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <h1>O teu vídeo está pronto! 🎉</h1>
    <p>Olá ${userName},</p>
    <p>O teu vídeo Flowzi foi processado com sucesso! Clica no botão abaixo para ver e fazer download.</p>
    <a href="${videoUrl}" class="btn">Ver Vídeo</a>
    <p>O link é válido por 7 dias.</p>
    <div class="footer">
      <p>Obrigado por usares o Flowzi!</p>
      <p>© ${year} Flowzi. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>`;
}

function generateFailureEmailHtml(userName: string): string {
  const year = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', -apple-system, sans-serif; background: #0f172a; color: #f1f5f9; margin: 0; padding: 40px 20px; }
    .container { max-width: 500px; margin: 0 auto; background: linear-gradient(145deg, #1e293b, #0f172a); border-radius: 16px; padding: 40px; border: 1px solid #334155; }
    h1 { color: #ef4444; margin: 0 0 20px; font-size: 24px; }
    p { line-height: 1.6; color: #94a3b8; margin: 0 0 20px; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Ups, algo correu mal 😔</h1>
    <p>Olá ${userName},</p>
    <p>Infelizmente houve um problema a processar o teu vídeo. Não te preocupes - vamos reembolsar o teu pagamento automaticamente.</p>
    <p>Se quiseres, podes tentar novamente com uma foto ou vídeo diferente.</p>
    <div class="footer">
      <p>Precisas de ajuda? Contacta-nos em flowzi.geral@gmail.com</p>
      <p>© ${year} Flowzi. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>`;
}

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Flowzi <geral@flowzi.pt>",
        to: [to],
        reply_to: "flowzi.geral@gmail.com",
        subject,
        html,
      }),
    });

    if (!response.ok) {
      console.error("Resend error:", await response.text());
      return false;
    }

    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Send email error:", error);
    return false;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // Get user data from query params (passed via callback URL)
    const email = req.query.email as string;
    const userName = req.query.userName as string;

    if (!email || !userName) {
      console.error("Missing email or userName in callback URL");
      return res.status(200).json({ received: true, error: "Missing user data" });
    }

    const callback = req.body as KieAiCallback;
    const { taskId, state, resultJson, errorMsg } = callback;

    console.log(`Callback received for task ${taskId}: ${state} (user: ${email})`);

    if (!taskId) {
      return res.status(400).json({ error: "taskId em falta" });
    }

    if (state === "success" && resultJson) {
      try {
        const result = JSON.parse(resultJson) as KieAiResult;
        const videoUrl = result.resultUrls?.[0];

        if (videoUrl) {
          // Send success email
          const html = generateSuccessEmailHtml(userName, videoUrl);
          await sendEmail(email, "O teu vídeo Flowzi está pronto! 🎉", html);
          console.log(`Video ready for ${email}: ${videoUrl}`);
        }
      } catch (parseError) {
        console.error("Error parsing resultJson:", parseError);
      }
    } else if (state === "fail") {
      console.error(`Task ${taskId} failed: ${errorMsg}`);
      
      // Send failure email
      const html = generateFailureEmailHtml(userName);
      await sendEmail(email, "Problema com o teu vídeo Flowzi", html);
    }

    // Always return 200 to acknowledge receipt
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Callback error:", error);
    // Still return 200 to prevent retries
    return res.status(200).json({ received: true, error: "Internal error" });
  }
}
