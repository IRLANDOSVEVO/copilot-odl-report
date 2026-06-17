import React, { useRef, useEffect, useState, useCallback } from "react";
import { MessageBubble } from "./MessageBubble";

export interface TrelloContext {
  boardId?: string;
  cardId?: string;
  userId?: string;
}

export interface Message {
  role: "user" | "assistant";
  text: string;
}

export interface ChatPanelProps {
  trelloContext?: TrelloContext;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ trelloContext }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "👋 Benvenuto in Copilot ODL & Report!\n\nSono qui per aiutarti con:\n• Reportistica operativa\n• Pianificazione ODL\n• Gestione scadenze\n• Analisi delle schede\n\nCome posso assisterti?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll dei messaggi verso il fondo
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Funzione per inviare un messaggio
  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    // Aggiungere il messaggio dell'utente
    const userMessage: Message = {
      role: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Costruire il payload per l'API
      const payload = {
        messages: [...messages, userMessage],
        boardId: trelloContext?.boardId,
        cardId: trelloContext?.cardId,
        userId: trelloContext?.userId,
      };

      // Chiamare l'API /api/chat
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Aggiungere la risposta dell'assistente
      const assistantMessage: Message = {
        role: "assistant",
        text: data.reply || "Errore: risposta vuota.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Errore nella comunicazione con l'API:", error);

      const errorMessage: Message = {
        role: "assistant",
        text: `❌ Errore: ${error instanceof Error ? error.message : "Impossibile comunicare con l'assistente."}`,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      // Refocus sulla textarea dopo l'invio
      inputRef.current?.focus();
    }
  }, [input, messages, loading, trelloContext]);

  // Gestire l'invio con Ctrl+Enter o Cmd+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#FFFFFF",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #E7E8EA",
          backgroundColor: "#F8F9FA",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <h1
            style={{
              margin: "0",
              fontSize: "18px",
              fontWeight: "600",
              color: "#172B4D",
            }}
          >
            🤖 Copilot ODL & Report
          </h1>
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: "12px",
              color: "#626F86",
            }}
          >
            Assistente operativo professionale
          </p>
        </div>
        {trelloContext && (
          <div style={{ fontSize: "12px", color: "#626F86", textAlign: "right" }}>
            {trelloContext.cardId && <div>📌 Scheda: {trelloContext.cardId.slice(0, 8)}...</div>}
            {trelloContext.boardId && <div>📊 Bacheca: {trelloContext.boardId.slice(0, 8)}...</div>}
          </div>
        )}
      </div>

      {/* Area messaggi scrollabile */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} role={msg.role} text={msg.text} />
        ))}

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                backgroundColor: "#E7E8EA",
                color: "#172B4D",
                fontSize: "14px",
                fontStyle: "italic",
              }}
            >
              ⏳ Elaboro…
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer con textarea e bottone */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid #E7E8EA",
          backgroundColor: "#F8F9FA",
          display: "flex",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digita un messaggio... (Ctrl+Enter per inviare)"
          disabled={loading}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #DCDFE4",
            fontSize: "14px",
            fontFamily: "inherit",
            resize: "none",
            minHeight: "40px",
            maxHeight: "120px",
            outlineColor: "#0052CC",
            backgroundColor: loading ? "#F0F1F3" : "#FFFFFF",
            color: loading ? "#626F86" : "#172B4D",
            cursor: loading ? "not-allowed" : "text",
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor:
              loading || !input.trim() ? "#DCDFE4" : "#0052CC",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: "600",
            cursor:
              loading || !input.trim() ? "not-allowed" : "pointer",
            transition: "background-color 0.2s ease",
            whiteSpace: "nowrap",
            minWidth: "100px",
          }}
          onMouseEnter={(e) => {
            if (!loading && input.trim()) {
              e.currentTarget.style.backgroundColor = "#0039A6";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && input.trim()) {
              e.currentTarget.style.backgroundColor = "#0052CC";
            }
          }}
        >
          {loading ? "⏳" : "Invia"}
        </button>
      </div>
    </div>
  );
};