import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { ChatPanel } from "@/components/ChatPanel";

// ✅ QUI (FUORI dal componente)
declare global {
  interface Window {
    TrelloPowerUp: any;
  }
}

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
    // ✅ niente declare global qui

    if (typeof window !== "undefined" && window.TrelloPowerUp) {
      try {
        const t = window.TrelloPowerUp.iframe();

        t.get("member", "id").then((memberId: string | undefined) => {
          t.get("board", "id").then((boardId: string | undefined) => {
            t.get("card", "id").then((cardId: string | undefined) => {
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
          "[PowerUp] Trello Power-Up API non disponibile:",
          error
        );
        setLoading(false);
      }
    } else {
      console.warn(
        "[PowerUp] window.TrelloPowerUp non disponibile (dev mode)"
      );
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  if (typeof window !== "undefined") {
    const script = document.createElement("script");
    script.src = "https://p.trellocdn.com/power-up.min.js";
    script.async = true;

    script.onload = () => {
      const TrelloPowerUp = window.TrelloPowerUp;

      if (TrelloPowerUp) {
        TrelloPowerUp.initialize({

          "card-buttons": function () {
            return [{
              text: "Copilot ODL",
              callback: function (t: any) {
                return t.popup({
                  title: "Copilot ODL",
                  url: "/powerup",
                  height: 600
                });
              }
            }];
          },

          "board-buttons": function () {
            return [{
              text: "Copilot ODL",
              callback: function (t: any) {
                return t.popup({
                  title: "Copilot ODL",
                  url: "/powerup",
                  height: 700
                });
              }
            }];
          }

        });
      }
    };

    document.body.appendChild(script);
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
        }}
      >
        <div>Caricamento...</div>
      </div>
    );
  }

  return <ChatPanel trelloContext={trelloContext} />;
};

export default PowerUp;
``
