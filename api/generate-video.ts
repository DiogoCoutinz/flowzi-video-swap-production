import type { VercelRequest, VercelResponse } from "@vercel/node";

interface KieAiCreateTaskResponse {
  code: number;
  message: string;
  data: {
    taskId: string;
  };
}

interface GenerateVideoRequest {
  photoUrl: string;
  videoUrl: string;
  email: string;
  userName: string;
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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const requestId = Math.random().toString(36).substring(7);
  
  log("INFO", "Generate video request received", { requestId, method: req.method });

  // Only allow POST
  if (req.method !== "POST") {
    log("WARN", "Method not allowed", { requestId, method: req.method });
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { photoUrl, videoUrl, email, userName } = req.body as GenerateVideoRequest;

    log("INFO", "Request data parsed", { 
      requestId, 
      email, 
      userName,
      hasPhoto: !!photoUrl,
      hasVideo: !!videoUrl,
      photoSize: photoUrl?.length || 0,
      videoSize: videoUrl?.length || 0
    });

    // Validation
    if (!photoUrl || !videoUrl || !email || !userName) {
      log("ERROR", "Missing required fields", { requestId, email, hasPhoto: !!photoUrl, hasVideo: !!videoUrl });
      return res.status(400).json({
        error: "Dados em falta. Envia photoUrl, videoUrl, email e userName.",
      });
    }

    const KIE_AI_API_KEY = process.env.KIE_AI_API_KEY;
    if (!KIE_AI_API_KEY) {
      log("ERROR", "KIE_AI_API_KEY not configured", { requestId });
      return res.status(500).json({
        error: "Configuração do servidor em falta. Contacta o suporte.",
      });
    }

    // Get the app URL for callback
    const APP_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.APP_URL || "http://localhost:8080";

    // Encode user data in callback URL
    const callbackParams = new URLSearchParams({ email, userName });
    const callbackUrl = `${APP_URL}/api/callback?${callbackParams.toString()}`;

    log("INFO", "Calling Kie.ai API", { requestId, email, callbackUrl, appUrl: APP_URL });

    // Create task on Kie.ai
    const kieRequestBody = {
      model: "kling-2.6/motion-control",
      callBackUrl: callbackUrl,
      input: {
        prompt: "The person is dancing smoothly with natural movements",
        input_urls: [photoUrl],
        video_urls: [videoUrl],
        character_orientation: "video",
        mode: "720p",
      },
    };

    const kieResponse = await fetch(
      "https://api.kie.ai/api/v1/jobs/createTask",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KIE_AI_API_KEY}`,
        },
        body: JSON.stringify(kieRequestBody),
      }
    );

    const kieResponseText = await kieResponse.text();
    
    log("INFO", "Kie.ai response received", { 
      requestId, 
      status: kieResponse.status, 
      ok: kieResponse.ok,
      responseLength: kieResponseText.length
    });

    // Handle Kie.ai response
    if (!kieResponse.ok) {
      log("ERROR", "Kie.ai API error", { 
        requestId, 
        status: kieResponse.status, 
        response: kieResponseText.substring(0, 500)
      });

      if (kieResponse.status === 401) {
        return res.status(500).json({ error: "API key inválida" });
      }
      if (kieResponse.status === 400) {
        return res.status(400).json({ error: "Erro nos ficheiros enviados" });
      }
      return res.status(500).json({
        error: "Erro no servidor Kie.ai, tenta novamente",
      });
    }

    let kieData: KieAiCreateTaskResponse;
    try {
      kieData = JSON.parse(kieResponseText);
    } catch (parseError) {
      log("ERROR", "Failed to parse Kie.ai response", { requestId, response: kieResponseText.substring(0, 500) });
      return res.status(500).json({ error: "Resposta inválida do Kie.ai" });
    }

    if (kieData.code !== 0 || !kieData.data?.taskId) {
      log("ERROR", "Kie.ai unexpected response code", { requestId, kieData });
      return res.status(500).json({
        error: kieData.message || "Resposta inesperada do Kie.ai",
      });
    }

    const taskId = kieData.data.taskId;
    
    log("INFO", "✅ Task created successfully", { 
      requestId, 
      taskId, 
      email, 
      userName,
      callbackUrl
    });

    return res.status(200).json({
      success: true,
      taskId,
      message: "Vídeo a ser processado. Receberás um email quando estiver pronto.",
    });
  } catch (error) {
    log("ERROR", "Generate video error", { 
      requestId, 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return res.status(500).json({
      error: "Erro interno. Tenta novamente mais tarde.",
    });
  }
}
