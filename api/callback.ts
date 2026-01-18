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

// Helper for structured logging with PII masking
function log(level: "INFO" | "ERROR" | "WARN", message: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  
  // Create a safe copy of data for logging
  const safeData = data ? { ...data } : {};
  if (safeData.email) safeData.email = (safeData.email as string).replace(/(.{2})(.*)(?=@)/, "$1***");
  if (safeData.userName) safeData.userName = (safeData.userName as string).substring(0, 2) + "***";

  const logData = { timestamp, level, message, ...safeData };
  console.log(JSON.stringify(logData));
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
    log("ERROR", "RESEND_API_KEY not configured");
    return false;
  }

  try {
    log("INFO", "Sending email via Resend", { to, subject });
    
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

    const responseText = await response.text();
    
    if (!response.ok) {
      log("ERROR", "Resend API error", { to, status: response.status, response: responseText });
      return false;
    }

    log("INFO", "✅ Email sent successfully", { to, subject, response: responseText });
    return true;
  } catch (error) {
    log("ERROR", "Send email exception", { 
      to, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return false;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const callbackId = Math.random().toString(36).substring(7);
  
  log("INFO", "🔔 Callback received from Kie.ai", { 
    callbackId, 
    method: req.method,
    query: req.query,
    bodyKeys: Object.keys(req.body || {})
  });

  // Only allow POST
  if (req.method !== "POST") {
    log("WARN", "Method not allowed", { callbackId, method: req.method });
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // Get user data from query params (passed via callback URL)
    const email = req.query.email as string;
    const userName = req.query.userName as string;

    if (!email || !userName) {
      log("ERROR", "Missing email or userName in callback URL", { callbackId, query: req.query });
      return res.status(200).json({ received: true, error: "Missing user data" });
    }

    const callback = req.body as KieAiCallback;
    const { taskId, state, resultJson, errorMsg } = callback;

    log("INFO", "📋 Callback data parsed", { 
      callbackId,
      taskId, 
      state, 
      email, 
      userName,
      hasResultJson: !!resultJson,
      errorMsg: errorMsg || null
    });

    if (!taskId) {
      log("ERROR", "Missing taskId in callback", { callbackId });
      return res.status(400).json({ error: "taskId em falta" });
    }

    if (state === "success" && resultJson) {
      log("INFO", "✅ Task completed successfully, parsing result", { callbackId, taskId });
      
      try {
        const result = JSON.parse(resultJson) as KieAiResult;
        const videoUrl = result.resultUrls?.[0];

        log("INFO", "Video URL extracted", { callbackId, taskId, videoUrl: videoUrl || "NOT_FOUND", allUrls: result.resultUrls });

        if (videoUrl) {
          // Send success email
          const html = generateSuccessEmailHtml(userName, videoUrl);
          const emailSent = await sendEmail(email, "O teu vídeo Flowzi está pronto! 🎉", html);
          
          log("INFO", "📧 Success email sent", { 
            callbackId, 
            taskId, 
            email, 
            emailSent,
            videoUrl 
          });
        } else {
          log("ERROR", "No video URL in result", { callbackId, taskId, result });
        }
      } catch (parseError) {
        log("ERROR", "Error parsing resultJson", { 
          callbackId, 
          taskId, 
          error: parseError instanceof Error ? parseError.message : String(parseError),
          resultJson: resultJson?.substring(0, 500)
        });
      }
    } else if (state === "fail") {
      log("ERROR", "❌ Task failed", { callbackId, taskId, errorMsg });
      
      // Send failure email
      const html = generateFailureEmailHtml(userName);
      const emailSent = await sendEmail(email, "Problema com o teu vídeo Flowzi", html);
      
      log("INFO", "📧 Failure email sent", { callbackId, taskId, email, emailSent });
    } else if (state === "pending" || state === "processing") {
      log("INFO", "⏳ Task still in progress", { callbackId, taskId, state });
    }

    // Always return 200 to acknowledge receipt
    log("INFO", "Callback processed successfully", { callbackId, taskId, state });
    return res.status(200).json({ received: true, state });
  } catch (error) {
    log("ERROR", "Callback handler error", { 
      callbackId, 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    // Still return 200 to prevent retries
    return res.status(200).json({ received: true, error: "Internal error" });
  }
}
