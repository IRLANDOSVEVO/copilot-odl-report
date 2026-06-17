import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { ChatPanel } from "@/components/ChatPanel";

export interface TrelloContext {
  boardId?: string;
  cardId?: string;
  userId?: string;
}

const PowerUp: NextPage = () => {
  const [trelloContext, setTrelloContext] = useState<TrelloContext | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dichiarare il tipo globale TrelloPowerUp
    declare global {
      interface Window {
        TrelloPowerUp: any;
      }
    }

    // Verificare se Trello Power-Up API è disponibile
    if (typeof window !== "undefined" && window.TrelloPowerUp) {
      try {
        // Inizializzare l'iframe con Trello Power-Up API
        const t = window.TrelloPowerUp.iframe();

        // Tentare di ottenere il contesto dalla pagina
        // get() ritorna una Promise
        t.get("member", "id").then((memberId: string | undefined) => {
          // Tentare di ottenere boardId
          t.get("board", "id").then((boardId: string | undefined) => {
            // Tentare di ottenere cardId (se si è in un contesto di scheda)
            t.get("card", "id").then((cardId: string | undefined) => {
              // Costruire il contesto
              const context: TrelloContext = {
                boardId,
                cardId,
                userId: memberId,
              };

              console.log("[PowerUp] Trello context loaded:", context);
              setTrelloContext(context);
              setLoading(false);
            });
          });
        });
      } catch (error) {
        console.warn(
          "[PowerUp] Trello Power-Up API non disponibile o errore nel caricamento contesto:",
          error
        );
        setLoading(false);
      }
    } else {
      // Se il Power-Up non è caricato (ad es. in dev mode senza Trello iframe)
      console.warn(
        "[PowerUp] window.TrelloPowerUp non disponibile. Modalità sviluppo?"
      );
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#F8F9FA",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
          <div style={{ color: "#626F86" }}>Caricamento del contesto Trello...</div>
        </div>
      </div>
    );
  }

  return <ChatPanel trelloContext={trelloContext} />;
};

export default PowerUp;