import type { NextApiRequest, NextApiResponse } from "next";
import { buildTrelloContext } from "@/lib/trello";
import { loadUserMemory, saveConversationTurn } from "@/lib/memory";

export interface Message {
  role: "user" | "assistant";
  text: string;
}

export interface ChatRequestBody {
  messages: Message[];
  boardId?: string;
  cardId?: string;
  userId?: string;
}

export interface ChatResponseBody {
  reply?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponseBody>
) {
  // Verificare il metodo HTTP
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse e validazione del payload
    const { messages, boardId, cardId, userId } = req.body as ChatRequestBody;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ error: "messages array is required and must not be empty" });
    }

    // Estrarre l'ultimo messaggio dell'utente
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "user") {
      return res.status(400).json({ error: "Last message must be from user" });
    }

    const userText = lastMessage.text.trim();

    // Verificare che AI_API_KEY sia configurato
    const aiApiKey = process.env.AI_API_KEY;
    if (!aiApiKey) {
      console.error("[Chat API] AI_API_KEY non configurato");
      return res.status(500).json({
        error: "AI service not configured. Set AI_API_KEY environment variable.",
      });
    }

    // 1. Caricamento memoria utente
    const userMemory = await loadUserMemory(userId);

    // 2. Costruzione contesto Trello
    const trelloContext = await buildTrelloContext({ boardId, cardId });

    // 3. Costruzione system prompt
    let systemPrompt =
      "Sei un assistente operativo professionale per una cooperativa. Lavori dentro Trello, ti occupi di ODL, scadenze, report e pianificazione. Rispondi in modo sintetico, strutturato e orientato all'azione.";

    // Aggiungere contesto Trello al system prompt
    if (trelloContext) {
      systemPrompt += `\n\n### CONTESTO OPERATIVO TRELLO:\n${trelloContext.summary}\nODL: ${trelloContext.odlSummary}`;
    }

    // Aggiungere memoria utente al system prompt
    if (userMemory) {
      systemPrompt += `\n\n### PREFERENZE UTENTE:\n${userMemory.preferencesSummary}\nPattern recenti: ${userMemory.recentPatterns}`;
    }

    // 4. Preparare messaggi per l'AI
    // Convertire i messaggi al formato OpenAI
    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.text,
      })),
    ];

    // 5. Chiamare l'API AI (OpenAI compatible)
    const aiModel = process.env.AI_MODEL || "gpt-4o-mini";
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiApiKey}`,
      },
      body: JSON.stringify({
        model: aiModel,
        messages: aiMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!aiResponse.ok) {
      const errorBody = await aiResponse.text();
      console.error(
        `[Chat API] AI API error ${aiResponse.status}:`,
        errorBody
      );
      return res
        .status(500)
        .json({ error: "Failed to get response from AI service" });
    }

    const aiData = await aiResponse.json();

    // Estrarre la risposta dal modello
    const aiReply =
      aiData.choices?.[0]?.message?.content?.trim() ||
      "Errore: nessuna risposta dal modello.";

    // 6. Salvare il turno di conversazione
    await saveConversationTurn({
      userId,
      boardId,
      cardId,
      userText,
      assistantText: aiReply,
    });

    // 7. Ritornare la risposta
    return res.status(200).json({ reply: aiReply });
  } catch (error) {
    console.error("[Chat API] Unexpected error:", error);
    return res.status(500).json({
      error: "Internal server error. Please check logs.",
    });
  }
}
