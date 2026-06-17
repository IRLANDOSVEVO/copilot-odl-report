# Copilot ODL & Report – Trello Power-Up
Deploy test

Un Power-Up Trello professionale che integra un chatbot AI per:
- **Reportistica operativa** in tempo reale
- **Pianificazione ODL** (Ordini di Lavoro)
- **Gestione scadenze** con tracking ritardi
- **Analisi schede** e metriche di carico
- **Memoria evolutiva** basata su conversazioni

## 🚀 Stack Tecnico

- **Next.js 14** (Pages Router)
- **React 18** con TypeScript
- **API Routes** per il backend
- **OpenAI API** (o compatibile) per l'intelligenza artificiale
- **Trello API** per il contesto operativo
- Nessuna dipendenza UI esterna (solo CSS inline)

## 📋 Struttura del Progetto

```
copilot-odl-report/
├── public/
│   └── trello-manifest.json          # Manifest per Trello
├── src/
│   ├── pages/
│   │   ├── index.tsx                 # Landing page
│   │   ├── powerup.tsx               # Pagina iframe per Trello
│   │   ├── _document.tsx             # Documento HTML root
│   │   └── api/
│   │       └── chat.ts               # API endpoint POST /api/chat
│   ├── components/
│   │   ├── ChatPanel.tsx             # Pannello chat principale
│   │   └── MessageBubble.tsx         # Componente bubble messaggio
│   └── lib/
│       ├── memory.ts                 # Gestione memoria utente
│       └── trello.ts                 # Integrazione API Trello
├── package.json
├── next.config.mjs
├── tsconfig.json
├── .env.example
└── README.md
```

## 🔧 Setup Iniziale

### 1. Clone e installazione

```bash
git clone https://github.com/IRLANDOSVEVO/copilot-odl-report.git
cd copilot-odl-report
npm install
```

### 2. Configurazione variabili d'ambiente

Copiona `.env.example` in `.env.local` e compila:

```bash
cp .env.example .env.local
```

**Variabili richieste:**

```env
# OpenAI API
AI_API_KEY=sk-...your-openai-key...
AI_MODEL=gpt-4-mini  # o gpt-4, gpt-3.5-turbo, ecc.

# Trello API
TRELLO_KEY=your_trello_app_key_here
TRELLO_TOKEN=your_trello_token_here

# URL pubblico (per Vercel)
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### Come ottenere le credenziali:

**OpenAI:**
1. Vai su https://platform.openai.com/api-keys
2. Crea una nuova chiave API
3. Copia il valore in `AI_API_KEY`

**Trello:**
1. Vai su https://trello.com/app-key
2. Copia `Key` in `TRELLO_KEY`
3. Genera un token e copia in `TRELLO_TOKEN`
4. Concedi i permessi necessari (read/write)

### 3. Sviluppo locale

```bash
npm run dev
```

Visita http://localhost:3000

### 4. Build e deploy su Vercel

```bash
npm run build
npm start
```

Per deployare su Vercel:

```bash
vercel deploy
```

Oppure collegati direttamente dal GitHub a Vercel:
1. Accedi a https://vercel.com
2. Importa il repository
3. Configura le variabili d'ambiente in Vercel
4. Deploy automatico

## 🎯 Integrazione con Trello

Una volta deployato su Vercel, puoi registrare il Power-Up in Trello:

### 1. Aggiorna il manifest

Modifica `public/trello-manifest.json` e sostituisci `YOUR_DOMAIN` con il tuo URL Vercel:

```json
{
  "connectors": {
    "iframe": {
      "url": "https://copilot-odl-report.vercel.app/powerup"
    }
  }
}
```

### 2. Registra il Power-Up

1. Vai su https://trello.com/app/create
2. Carica il manifest da `https://copilot-odl-report.vercel.app/public/trello-manifest.json`
3. Oppure ospita il manifest e usa l'URL

### 3. Usa il Power-Up

- Apri una bacheca Trello
- Clicca su "Power-Ups" → "Personalizzati" → Seleziona "Copilot ODL & Report"
- Il Power-Up sarà disponibile nei pulsanti bacheca e scheda

## 🧠 Componenti Principali

### ChatPanel (`src/components/ChatPanel.tsx`)
Pannello chat stile Trello con:
- Header fisso con info contesto
- Area messaggi scrollabile
- Messaggi user/assistant con stili diversi
- Textarea e bottone invio
- Supporto Ctrl+Enter per inviare

### API Chat (`src/pages/api/chat.ts`)
Endpoint POST `/api/chat` che:
1. Valida il payload
2. Carica memoria utente
3. Recupera contesto Trello
4. Costruisce system prompt con contesto
5. Chiama OpenAI API
6. Salva il turno di conversazione
7. Ritorna la risposta

### Memory Module (`src/lib/memory.ts`)
Gestisce la memoria evolutiva:
- `loadUserMemory()`: Carica preferenze e pattern utente
- `saveConversationTurn()`: Salva ogni conversazione
- Attualmente usa stub, pronto per integrazione DB

### Trello Module (`src/lib/trello.ts`)
Integrazione API Trello:
- `buildTrelloContext()`: Carica contesto scheda/bacheca
- Calcola metriche (scadenze, ritardi, carico)
- Sintetizza riassunti operativi

## 📝 Comunicazione API

### Request `/api/chat`

```json
{
  "messages": [
    { "role": "user", "text": "Quante schede sono in ritardo?" },
    { "role": "assistant", "text": "..." }
  ],
  "boardId": "board123",
  "cardId": "card456",
  "userId": "user789"
}
```

### Response

```json
{
  "reply": "Attualmente hai 3 schede in ritardo. Le priorità sono..."
}
```

## 🔐 Sicurezza

- Le chiavi API sono lato server (in `process.env`)
- Il client non ha accesso alle credenziali Trello/OpenAI
- CORS è abilitato solo per Trello iframe

## 📦 Deployment su Vercel

### Configurazione automatica

Vercel rileva automaticamente che è un progetto Next.js.

### Variabili d'ambiente in Vercel

1. Vai al progetto in Vercel
2. Settings → Environment Variables
3. Aggiungi:
   - `AI_API_KEY`
   - `AI_MODEL`
   - `TRELLO_KEY`
   - `TRELLO_TOKEN`
   - `NEXT_PUBLIC_APP_URL`

### URL pubblico

Una volta deployato, il tuo Power-Up è disponibile a:
```
https://copilot-odl-report.vercel.app/powerup
```

## 🚀 Prossimi Step

### Integrazione Database

Attualmente `memory.ts` usa stub. Per produzione, integra:

**Opzione 1: Supabase (consigliato)**
```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(url, key);
const { data } = await supabase
  .from('conversation_turns')
  .select()
  .eq('user_id', userId);
```

**Opzione 2: Prisma + PostgreSQL**
```typescript
const turns = await prisma.conversationTurn.findMany({
  where: { userId }
});
```

### Migliorie Future

- [ ] Persistenza conversazioni su DB
- [ ] Dashboard di analytics per operatori
- [ ] Integrazione con calendario per scadenze
- [ ] AI-generated report giornalieri
- [ ] Notifiche push per ritardi
- [ ] Team workspace per cooperativa

## 🐛 Troubleshooting

### "AI service not configured"
→ Controlla che `AI_API_KEY` sia impostata in `.env.local` (dev) o in Vercel (prod)

### "Method not allowed"
→ Assicurati di fare richieste POST a `/api/chat`

### Trello context undefined
→ In dev locale il contesto Trello non è disponibile (ok in produzione quando caricato da Trello iframe)

### Errore CORS
→ Se il manifest non è raggiungibile, controlla:
- L'URL nel manifest sia corretto
- Il dominio Vercel sia raggiungibile pubblicamente

## 📞 Supporto

Per issues o domande:
- Apri una issue su GitHub
- Consulta la documentazione ufficiale di Trello Power-Up: https://developer.atlassian.com/cloud/trello/guides/power-ups/
- Leggi i docs OpenAI: https://platform.openai.com/docs

## 📄 Licenza

MIT License - Sei libero di usare questo progetto come base per i tuoi Power-Up.

---

**Made with ❤️ – Pronto al deploy su Vercel 🚀**
