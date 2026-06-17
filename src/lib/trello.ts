/**
 * Trello API Integration Module
 *
 * Gestisce l'integrazione con l'API Trello per:
 * - Caricamento dati schede
 * - Estrazione informazioni ODL, scadenze, ritardi
 * - Costruzione del contesto operativo
 */

export interface TrelloContextInput {
  boardId?: string;
  cardId?: string;
}

export interface TrelloContext {
  summary: string;
  odlSummary: string;
}

/**
 * Costruisce il contesto Trello per l'AI
 * Richiama l'API Trello per ottenere dati schede, calcola metriche
 *
 * @param input Contiene boardId e/o cardId
 * @returns Oggetto con summary e odlSummary, o null se API non configurata
 */
export async function buildTrelloContext(
  input: TrelloContextInput
): Promise<TrelloContext | null> {
  const { boardId, cardId } = input;

  const trelloKey = process.env.TRELLO_KEY;
  const trelloToken = process.env.TRELLO_TOKEN;

  // Verificare che le credenziali siano configurate
  if (!trelloKey || !trelloToken) {
    console.warn(
      "[Trello] TRELLO_KEY o TRELLO_TOKEN non configurati. Skipping Trello context."
    );
    return null;
  }

  try {
    // Caso 1: Se cardId è disponibile, carica i dati della scheda specifica
    if (cardId) {
      return await loadCardContext(cardId, trelloKey, trelloToken);
    }

    // Caso 2: Se solo boardId è disponibile, carica il contesto della bacheca
    if (boardId) {
      return await loadBoardContext(boardId, trelloKey, trelloToken);
    }

    return null;
  } catch (error) {
    console.error("[Trello] Errore nel caricamento contesto:", error);
    return null;
  }
}

/**
 * Carica il contesto di una singola scheda
 */
async function loadCardContext(
  cardId: string,
  trelloKey: string,
  trelloToken: string
): Promise<TrelloContext | null> {
  const url = `https://api.trello.com/1/cards/${cardId}?key=${trelloKey}&token=${trelloToken}&fields=name,desc,due,idList,labels,url`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[Trello] HTTP ${response.status} fetching card ${cardId}`);
      return null;
    }

    const card = await response.json();

    // Construire summary della scheda
    const dueDate = card.due ? new Date(card.due) : null;
    const isOverdue = dueDate && dueDate < new Date();
    const daysUntilDue = dueDate
      ? Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    const dueStatus =
      !dueDate ? "senza scadenza" : isOverdue ? `IN RITARDO (${Math.abs(daysUntilDue ?? 0)} giorni)` : `scade tra ${daysUntilDue} giorni`;

    const labelsStr =
      card.labels && card.labels.length > 0
        ? card.labels.map((l: any) => l.name).join(", ")
        : "nessuna etichetta";

    const summary = `Scheda: "${card.name}" | Lista: ${card.idList} | Scadenza: ${dueStatus} | Etichette: ${labelsStr}`;
    const odlSummary = `Descrizione: ${card.desc || "(vuota)"} | Link: ${card.url}`;

    return { summary, odlSummary };
  } catch (error) {
    console.error(`[Trello] Errore nel caricamento scheda ${cardId}:`, error);
    return null;
  }
}

/**
 * Carica il contesto della bacheca (metriche aggregate)
 */
async function loadBoardContext(
  boardId: string,
  trelloKey: string,
  trelloToken: string
): Promise<TrelloContext | null> {
  const url = `https://api.trello.com/1/boards/${boardId}/cards?key=${trelloKey}&token=${trelloToken}&fields=name,due,idList,labels`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[Trello] HTTP ${response.status} fetching board ${boardId}`);
      return null;
    }

    const cards = await response.json();

    // Calcolare metriche
    const now = new Date();
    let totalCards = cards.length;
    let cardsWithDue = 0;
    let overdueCards = 0;
    let dueThisWeek = 0;

    cards.forEach((card: any) => {
      if (card.due) {
        cardsWithDue++;
        const dueDate = new Date(card.due);
        if (dueDate < now) {
          overdueCards++;
        }
        const daysUntilDue = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilDue <= 7 && daysUntilDue > 0) {
          dueThisWeek++;
        }
      }
    });

    const summary = `Bacheca: ${totalCards} schede | ${cardsWithDue} con scadenza | ${overdueCards} IN RITARDO | ${dueThisWeek} scadono questa settimana`;
    const odlSummary = `Carico di lavoro: ${overdueCards} ritardi critici. Priorità: risolvere ritardi, gestire scadenze settimanali.`;

    return { summary, odlSummary };
  } catch (error) {
    console.error(`[Trello] Errore nel caricamento bacheca ${boardId}:`, error);
    return null;
  }
}
