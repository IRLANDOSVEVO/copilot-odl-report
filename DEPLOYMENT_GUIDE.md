# 🚀 Guida Completa al Deployment su Vercel

Questa guida ti porterà passo per passo a deployare il Copilot ODL & Report Power-Up su Vercel.

## Prerequisiti

- Accesso a GitHub (account creato)
- Account Vercel (creable gratuitamente)
- Credenziali OpenAI (API key)
- Credenziali Trello (Key e Token)

---

## Step 1: Preparazione Repository GitHub

### 1.1 Repository GitHub creato

Il repository `copilot-odl-report` è già stato creato e i file sono stati caricati.

### 1.2 Clona e prepara l'ambiente

```bash
git clone https://github.com/IRLANDOSVEVO/copilot-odl-report.git
cd copilot-odl-report
npm install
```

---

## Step 2: Setup Credenziali

### 2.1 OpenAI API Key

1. Vai su https://platform.openai.com/api-keys
2. Accedi con il tuo account OpenAI (crea uno se necessario)
3. Clicca "Create new secret key"
4. Copia il valore (es: `sk-proj-xxxxxx...`)
5. **Salva in luogo sicuro** - non sarà più visibile

### 2.2 Trello API Key e Token

1. Vai su https://trello.com/app-key
2. Accedi con il tuo account Trello
3. Copia il valore **Key** (es: `a1b2c3d4e5f6g7h8`)
4. Scorri in basso, clicca su "Token" link
5. Autorizzi l'applicazione
6. Copia il **Token** (es: `a1b2c3d4e5f6g7h8ijklmn...`)
7. Salva entrambi in luogo sicuro

---

## Step 3: Setup Locale (Facoltativo ma consigliato)

### 3.1 Testa localmente prima di deployare

```bash
# Crea .env.local
cp .env.example .env.local

# Modifica .env.local con le tue credenziali
# AI_API_KEY=sk-...
# AI_MODEL=gpt-4-mini
# TRELLO_KEY=...
# TRELLO_TOKEN=...
# NEXT_PUBLIC_APP_URL=http://localhost:3000

# Avvia dev server
npm run dev

# Visita http://localhost:3000
```

Se funziona localmente, sei pronto per il deploy!

---

## Step 4: Deploy su Vercel

### 4.1 Collega Vercel a GitHub

1. Vai su https://vercel.com
2. Clicca "Sign Up" (o "Sign In" se hai account)
3. Scegli "Continue with GitHub"
4. Autorizzi Vercel ad accedere ai tuoi repository
5. Dopo autorizzazione, sarai in Vercel dashboard

### 4.2 Importa il progetto

1. Nella dashboard Vercel, clicca "Add New..." → "Project"
2. Seleziona il repository `copilot-odl-report`
3. Clicca "Import"

### 4.3 Configura variabili d'ambiente

Nella pagina di configurazione del progetto:

1. Scorri a "Environment Variables"
2. Aggiungi le seguenti variabili:

| Nome | Valore | Note |
|------|--------|------|
| `AI_API_KEY` | `sk-proj-...` | La chiave OpenAI copiata |
| `AI_MODEL` | `gpt-4-mini` | Modello AI (default ok) |
| `TRELLO_KEY` | `a1b2c3d4...` | La key Trello copiata |
| `TRELLO_TOKEN` | `a1b2c3d4...` | Il token Trello copiato |
| `NEXT_PUBLIC_APP_URL` | Verrà compilato dopo | Vedi step 4.5 |

3. Per ogni variabile, clicca "Add" e inserisci nome e valore
4. Clicca "Deploy"

### 4.4 Aspetta il deployment

Vercel inizierà il build automaticamente. Dovresti vedere:
- ✅ Build in progress
- ✅ Deployment in progress
- ✅ Ready

Aspetta 3-5 minuti che completino tutti gli step.

### 4.5 Ottieni l'URL Vercel

Una volta deployato:
1. Nella dashboard, sotto il nome del progetto vedrai l'URL pubblico
   - Es: `https://copilot-odl-report.vercel.app`
2. Copia questo URL
3. Torna nelle "Environment Variables" di Vercel
4. Aggiorna `NEXT_PUBLIC_APP_URL` con questo valore
5. Salva e rideploy (Vercel rifarà il deploy automaticamente)

---

## Step 5: Configura il Manifest Trello

### 5.1 Aggiorna il manifest

Nel file `public/trello-manifest.json`, sostituisci `YOUR_DOMAIN` con il tuo URL Vercel:

**Prima:**
```json
{
  "connectors": {
    "iframe": {
      "url": "https://YOUR_DOMAIN.vercel.app/powerup"
    }
  }
}
```

**Dopo:**
```json
{
  "connectors": {
    "iframe": {
      "url": "https://copilot-odl-report.vercel.app/powerup"
    }
  }
}
```

### 5.2 Commit e push

```bash
git add public/trello-manifest.json
git commit -m "Update manifest with Vercel URL"
git push origin main
```

Vercel farà il deploy automatico del nuovo manifest.

---

## Step 6: Registra il Power-Up su Trello

### 6.1 Vai su Trello App Management

1. Vai su https://trello.com/app/create
2. Accedi con il tuo account Trello

### 6.2 Crea il Power-Up

1. Compila il form:
   - **Name:** "Copilot ODL & Report"
   - **Description:** "Chatbot AI per report, ODL e scadenze in Trello"
   - **Support Email:** La tua email
   - **Capabilities:** Seleziona almeno:
     - ✅ board-buttons
     - ✅ card-buttons
     - ✅ card-back-section
     - ✅ show-settings
   - **Iframe Connector URL:** `https://copilot-odl-report.vercel.app/powerup`

2. Clicca "Create Power-Up"
3. Ti verrà assegnato un **Power-Up ID** (salva questo)

### 6.3 Installa il Power-Up su una bacheca test

1. Apri una bacheca Trello
2. Clicca "Power-Ups" (in alto a destra)
3. Clicca "Custom"
4. Incolla l'ID del tuo Power-Up
5. Clicca "Attach"

Se tutto funziona, il Power-Up dovrebbe apparire come bottone nella bacheca!

---

## Step 7: Test della Funzionalità

### 7.1 Test basilari

1. In una bacheca dove hai installato il Power-Up
2. Clicca il bottone "Copilot ODL & Report" (dovrebbe aprire un iframe)
3. Scrivi un messaggio di prova: "Ciao, funzioni?"
4. L'assistente dovrebbe rispondere

### 7.2 Test avanzati

Prova comandi come:
- "Quante schede ci sono in questa bacheca?"
- "Quali schede sono in ritardo?"
- "Riassumi le mie schede"
- "Qual è la scadenza più prossima?"

---

## Troubleshooting

### Problema: "AI service not configured"

**Soluzione:**
- Verifica che `AI_API_KEY` sia configurata in Vercel
- Controlla che la chiave sia valida su https://platform.openai.com/api-keys
- Rideploy da Vercel

### Problema: Trello context undefined

**Soluzione:**
- Il contesto Trello è disponibile solo quando il Power-Up è caricato dentro Trello iframe
- In sviluppo locale (localhost), il contesto potrebbe non essere disponibile
- È normale e previsto

### Problema: "404 Not Found" su /powerup

**Soluzione:**
- Controlla che l'URL nel manifest sia corretto
- Accertati che il deployment su Vercel sia completato (check status)
- Prova a visitare `https://copilot-odl-report.vercel.app/powerup` direttamente

### Problema: Timeout nella risposta AI

**Soluzione:**
- Potrebbe essere un rate limit di OpenAI
- Controlla i log di Vercel: https://vercel.com/dashboard
- Verifica che `AI_API_KEY` abbia credito (https://platform.openai.com/account/usage/overview)

---

## Monitoraggio e Logs

### Visualizzare i logs in Vercel

1. Vai al progetto su Vercel
2. Clicca "Deployments"
3. Seleziona il deployment più recente
4. Clicca "Runtime Logs"

Qui vedrai tutti i console.log() e gli errori dal server.

### Debugging locale

Prima di deployare, testa localmente:

```bash
# Crea .env.local con le credenziali
cp .env.example .env.local

# Modifica .env.local con le tue chiavi

# Avvia dev server
npm run dev

# Visita http://localhost:3000
```

---

## Maintenance e Updates

### Aggiornare il Power-Up

Ogni volta che fai un push su GitHub:
1. Vercel automaticamente rideploy
2. Aspetta il completamento (green checkmark)
3. Il Power-Up si aggiorna automaticamente

### Rinnovare le credenziali

Se le credenziali scadono o cambi provider:
1. Vai in Vercel → Settings → Environment Variables
2. Aggiorna la variabile
3. Clicca "Redeploy"

### Monitorare l'utilizzo OpenAI

1. Vai su https://platform.openai.com/account/usage/overview
2. Controlla i costi e l'utilizzo API
3. Imposta limiti di spesa se necessario (Settings → Billing)

---

## Prossimi Step

Una volta deployato:
- ✅ Condividi il Power-Up con il team
- ✅ Configura le preferenze di memoria (integrare DB)
- ✅ Personalizza il system prompt per la tua cooperativa
- ✅ Monitora i logs e l'utilizzo

---

## Support

- 📖 Documentazione Trello Power-Up: https://developer.atlassian.com/cloud/trello/guides/power-ups/
- 🔧 Documentazione OpenAI: https://platform.openai.com/docs/guides/gpt
- 🚀 Documentazione Vercel: https://vercel.com/docs

**Sei pronto! Deploy il tuo Power-Up ora 🎉**
