import type { VercelRequest, VercelResponse } from "@vercel/node";

interface KieAiRecordInfoResponse {
  code: number;
  message: string;
  data: {
    taskId: string;
    state: "pending" | "processing" | "success" | "fail";
    resultUrls?: string[];
    errorMsg?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { taskId } = req.query;

    if (!taskId || typeof taskId !== "string") {
      return res.status(400).json({ error: "taskId em falta" });
    }

    const KIE_AI_API_KEY = process.env.KIE_AI_API_KEY;
    if (!KIE_AI_API_KEY) {
      console.error("KIE_AI_API_KEY not configured");
      return res.status(500).json({
        error: "Configuração do servidor em falta",
      });
    }

    // Call Kie.ai recordInfo endpoint
    const kieResponse = await fetch(
      `https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${KIE_AI_API_KEY}`,
        },
      }
    );

    if (!kieResponse.ok) {
      const status = kieResponse.status;
      console.error("Kie.ai recordInfo error:", status);

      if (status === 401) {
        return res.status(500).json({ error: "API key inválida" });
      }
      if (status === 404) {
        return res.status(404).json({ error: "Task não encontrada" });
      }
      return res.status(500).json({
        error: "Erro ao verificar estado do vídeo",
      });
    }

    const kieData = (await kieResponse.json()) as KieAiRecordInfoResponse;

    if (kieData.code !== 0) {
      console.error("Kie.ai recordInfo unexpected response:", kieData);
      return res.status(500).json({
        error: kieData.message || "Erro ao verificar estado",
      });
    }

    const { state, resultUrls, errorMsg } = kieData.data;

    // Map state to Portuguese
    const stateMessages: Record<string, string> = {
      pending: "Na fila de processamento...",
      processing: "A processar o teu vídeo...",
      success: "Vídeo pronto!",
      fail: "Ocorreu um erro no processamento",
    };

    return res.status(200).json({
      taskId,
      state,
      stateMessage: stateMessages[state] || state,
      videoUrl: state === "success" ? resultUrls?.[0] : undefined,
      error: state === "fail" ? errorMsg : undefined,
    });
  } catch (error) {
    console.error("Check video error:", error);
    return res.status(500).json({
      error: "Erro interno. Tenta novamente.",
    });
  }
}
