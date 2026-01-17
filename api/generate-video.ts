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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { photoUrl, videoUrl, email, userName } =
      req.body as GenerateVideoRequest;

    // Validation
    if (!photoUrl || !videoUrl || !email || !userName) {
      return res.status(400).json({
        error: "Dados em falta. Envia photoUrl, videoUrl, email e userName.",
      });
    }

    const KIE_AI_API_KEY = process.env.KIE_AI_API_KEY;
    if (!KIE_AI_API_KEY) {
      console.error("KIE_AI_API_KEY not configured");
      return res.status(500).json({
        error: "Configuração do servidor em falta. Contacta o suporte.",
      });
    }

    // Get the app URL for callback
    const APP_URL =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.APP_URL || "http://localhost:8080";

    // Encode user data in callback URL (works in serverless without external storage)
    const callbackParams = new URLSearchParams({
      email,
      userName,
    });
    const callbackUrl = `${APP_URL}/api/callback?${callbackParams.toString()}`;

    // Create task on Kie.ai
    const kieResponse = await fetch(
      "https://api.kie.ai/api/v1/jobs/createTask",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KIE_AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "kling-2.6/motion-control",
          callBackUrl: callbackUrl,
          input: {
            prompt: "The person is dancing smoothly with natural movements",
            input_urls: [photoUrl],
            video_urls: [videoUrl],
            character_orientation: "video",
            mode: "720p",
          },
        }),
      }
    );

    // Handle Kie.ai response
    if (!kieResponse.ok) {
      const status = kieResponse.status;
      console.error("Kie.ai error:", status, await kieResponse.text());

      if (status === 401) {
        return res.status(500).json({ error: "API key inválida" });
      }
      if (status === 400) {
        return res.status(400).json({ error: "Erro nos ficheiros enviados" });
      }
      return res.status(500).json({
        error: "Erro no servidor Kie.ai, tenta novamente",
      });
    }

    const kieData = (await kieResponse.json()) as KieAiCreateTaskResponse;

    if (kieData.code !== 0 || !kieData.data?.taskId) {
      console.error("Kie.ai unexpected response:", kieData);
      return res.status(500).json({
        error: kieData.message || "Resposta inesperada do Kie.ai",
      });
    }

    const taskId = kieData.data.taskId;
    console.log(`Task created: ${taskId} for ${email}`);

    return res.status(200).json({
      success: true,
      taskId,
      message: "Vídeo a ser processado. Receberás um email quando estiver pronto.",
    });
  } catch (error) {
    console.error("Generate video error:", error);
    return res.status(500).json({
      error: "Erro interno. Tenta novamente mais tarde.",
    });
  }
}
