/**
 * Memory Module - Gestione memoria evolutiva basata su conversazioni
 *
 * Questo modulo gestisce:
 * - Salvataggio di turni di conversazione
 * - Caricamento di preferenze e pattern utente
 *
 * NOTA: Implementazione attuale usa stub con dati placeholder.
 * In produzione, integrare con:
 * - Supabase (consigliato)
 * - Postgres con Prisma
 * - MongoDB
 * - Firebase Firestore
 */

export interface UserMemory {
  preferencesSummary: string;
  recentPatterns: string;
}

export interface ConversationTurn {
  userId?: string;
  boardId?: string;
  cardId?: string;
  userText: string;
  assistantText: string;
  timestamp?: Date;
}

/**
 * Carica la memoria (preferenze e pattern) di un utente
 * @param userId ID dell'utente Trello
 * @returns Oggetto con preferenze e pattern, o null se non trovato
 */
export async function loadUserMemory(userId?: string): Promise<UserMemory | null> {
  if (!userId) {
    return null;
  }

  // STUB: In produzione, query database con Supabase/Prisma
  // Esempio (Supabase):
  // const { data, error } = await supabase
  //   .from('user_memories')
  //   .select('preferences_summary, recent_patterns')
  //   .eq('user_id', userId)
  //   .single();

  // Placeholder sensato per sviluppo
  const stubMemories: Record<string, UserMemory> = {
    default: {
      preferencesSummary:
        "L'utente preferisce report sintetici con focus su ODL in ritardo e scadenze critiche.",
      recentPatterns:
        "Chiede frequentemente lo stato di consegna, ritardi e previsioni di completamento.",
    },
  };

  // Ritorna memoria stub
  return stubMemories.default;
}

/**
 * Salva un turno di conversazione per l'evoluzione della memoria
 * @param input Dati del turno di conversazione
 */
export async function saveConversationTurn(input: ConversationTurn): Promise<void> {
  const { userId, boardId, cardId, assistantText } = input;

  // STUB: In produzione, salvare su database
  // Esempio (Supabase):
  // const { error } = await supabase.from('conversation_turns').insert({
  //   user_id: userId,
  //   board_id: boardId,
  //   card_id: cardId,
  //   user_text: userText,
  //   assistant_text: assistantText,
  //   created_at: new Date().toISOString(),
  // });
  // if (error) console.error('Failed to save conversation turn:', error);

  // Log di sviluppo
  console.log(
    `[Memory] Conversazione salvata - User: ${userId}, Board: ${boardId}, Card: ${cardId}`
  );

  // Logica futura:
  // 1. Aggregare turni per periodo (giornaliero/settimanale)
  // 2. Estrarre pattern con NLP (Trello freq, preferenze formato)
  // 3. Aggiornare user_memories con insights
}

/**
 * Estrae preferenze consolidate da turni di conversazione recenti
 * NOTA: Funzione placeholder per uso futuro con DB vero
 */
export async function extractUserPreferences(userId?: string): Promise<string> {
  if (!userId) {
    return "";
  }

  // STUB: In produzione, analizzare gli ultimi N turni e generare summary
  // Esempio:
  // const { data: turns } = await supabase
  //   .from('conversation_turns')
  //   .select('user_text, assistant_text')
  //   .eq('user_id', userId)
  //   .order('created_at', { ascending: false })
  //   .limit(50);
  //
  // // Analizzare pattern nei messaggi dell'utente
  // const preferences = analyzePatterns(turns);
  // return preferences;

  return "Nessuna preferenza storica disponibile.";
}
