import React from "react";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#F8F9FA",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#0052CC",
            margin: "0 0 16px 0",
          }}
        >
          🤖 Copilot ODL & Report
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#172B4D",
            lineHeight: "1.6",
            margin: "0 0 24px 0",
          }}
        >
          Trello Power-Up professionale per:
        </p>

        <ul
          style={{
            fontSize: "15px",
            color: "#172B4D",
            lineHeight: "1.8",
            textAlign: "left",
            display: "inline-block",
            listStyleType: "none",
            padding: "0",
            margin: "0 0 24px 0",
          }}
        >
          <li>✅ Chatbot AI integrato nella bacheca</li>
          <li>📊 Reportistica operativa</li>
          <li>🎯 Pianificazione ODL</li>
          <li>⏰ Gestione scadenze</li>
          <li>📈 Analisi delle schede</li>
          <li>🧠 Memoria evolutiva da conversazioni</li>
        </ul>

        <div
          style={{
            backgroundColor: "#DFFCF0",
            border: "1px solid #216E4E",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#216E4E",
              margin: "0",
              fontWeight: "600",
            }}
          >
            ✨ Installazione come Power-Up Trello
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#216E4E",
              margin: "8px 0 0 0",
            }}
          >
            Usa <code style={{ backgroundColor: "#F0F0F0", padding: "2px 6px", borderRadius: "3px" }}>/powerup</code> come URL iframe nel manifest
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#F0F3FF",
            border: "1px solid #0052CC",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "13px",
            color: "#0052CC",
            lineHeight: "1.5",
          }}
        >
          <strong>Configurazione richiesta:</strong>
          <br />
          Imposta le variabili d'ambiente:
          <br />
          <code style={{ display: "block", marginTop: "8px", color: "#172B4D" }}>
            AI_API_KEY, AI_MODEL
            <br />
            TRELLO_KEY, TRELLO_TOKEN
          </code>
        </div>

        <p
          style={{
            fontSize: "12px",
            color: "#626F86",
            margin: "24px 0 0 0",
          }}
        >
          Deployato su Vercel • Made with ❤️
        </p>
      </div>
    </div>
  );
};

export default Home;