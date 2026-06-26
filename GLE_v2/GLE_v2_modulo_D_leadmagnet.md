# GLE v2 — MODULO D: Lead Magnet "Scansiona la tua zona"
### Blocco da APPENDERE in fondo al prompt esistente di GlobalLead Engine
*Aggiunge l'endpoint pubblico che alimenta la landing `scansiona-la-tua-zona.html`. Riusa il motore GLE che già esiste (Google Places + scoring), non lo riscrive.*

---

## CONTESTO PER CLAUDE CODE
Devo trasformare GLE in un lead magnet: una persona inserisce **città + tipo di attività + email** su una landing, il sistema **scansiona quella zona in tempo reale** (versione ridotta del motore GLE) e le mostra un'**anteprima** dei 5 lead più "caldi" (nome mascherato + punteggio + cosa gli manca). L'email entra nella mia lista. Io ricevo una notifica. La lista completa con nomi/contatti la consegno io dopo, alla call.

> Scopo doppio: (1) acquisire email/contatti caldi, (2) dimostrare il motore. È marketing E prodotto.

---

## 1. ENDPOINT PUBBLICO `POST /api/scan`
- Input JSON: `{ city, category, email }`.
- Validazione: email valida; city/category non vuoti; **rate-limit per IP** (es. 5/ora) e honeypot anti-bot.
- Flusso:
  1. Salva il **subscriber** (vedi §3) PRIMA di scansionare (così non perdo il contatto anche se la scansione è lenta).
  2. Esegui una **scansione leggera** (vedi §2): Google Places per `category` in `city`, prendi ~20-40 risultati.
  3. Per i top risultati calcola il punteggio col **motore di scoring già esistente** (qualità sito, booking, recensioni, social) + arricchimento veloce.
  4. Restituisci SOLO un'anteprima: `{ total, leads: [ {name, score, signals[]} x5 ] }` con `name` **mascherato** (es. "Salone •••••• — Lugano"). NON restituire mai contatti/nomi completi in questo endpoint pubblico.
  5. Salva la scansione completa (nomi reali inclusi) lato server, legata al subscriber, per quando farò la call.
- CORS: consenti solo il dominio della landing (Netlify) + localhost in dev.
- Chiave Google Places SOLO lato server (mai nel frontend).

Output atteso dal frontend (già pronto): `{ total:number, leads:[{name:string, score:number, signals:string[]}] }`.

---

## 2. SCANSIONE LEGGERA (versione "lite" del motore)
Riusa la pipeline GLE ma limitata e veloce (deve rispondere in pochi secondi):
- Google Places Text Search: `"{category} a {city}"` → lista business.
- Per i primi N (config, es. 25): calcola `score` con la logica esistente. Per i top 5 genera 1-3 `signals` leggibili dal pubblico (es. "Nessun sito web", "Nessuna prenotazione online", "Recensioni alte, zero follow-up", "Instagram inattivo").
- `total` = numero di aziende trovate nella zona.
- Caching: se la stessa city+category è stata scansionata di recente (es. < 24h), riusa i risultati per risparmiare chiamate API.
- Budget: limita le chiamate Places per richiesta (config `SCAN_MAX_PLACES`) per non far esplodere i costi.

---

## 3. CATTURA CONTATTO + NOTIFICHE
- Tabella `lead_magnet_subscribers`: id, email, city, category, created_at, ip, source ('scan_landing'), full_scan_id (fk alla scansione completa salvata).
- Invia l'email del report tramite **Resend** (riusa la mia RESEND_API_KEY in `.env`): oggetto tipo "Il tuo report: N aziende in {city}"; corpo con l'anteprima dei 5 (mascherati) + CTA a prenotare la call (CALENDLY_URL).
- **Notifica a me su Telegram** (riusa il bot/preview già in GLE): "Nuovo lead magnet 🔔 {email} — {category} a {city} — {total} aziende trovate". Così posso ricontattare a caldo.
- Aggiungi opzione per sync del subscriber su Notion/Google Sheets (riusa il sync già presente in GLE).

---

## 4. GUARDRAIL / COMPLIANCE
- **Mai** esporre nomi/contatti completi delle aziende nell'endpoint pubblico: solo anteprima mascherata. (I nomi completi li consegno io, è il mio valore.)
- Consenso: la landing dichiara già il trattamento GDPR; salva `consent_at` con il subscriber.
- Dati di AZIENDE pubblici (Places). Niente dati personali di privati. Nota GDPR nel README.
- Rate-limit + honeypot contro abusi/scraping del mio stesso endpoint.
- `.env` in `.gitignore`; Places/Resend key solo server-side.

---

## 5. COLLEGAMENTO ALLA LANDING
La landing `scansiona-la-tua-zona.html` chiama `CONFIG.GLE_API_URL` con `POST {city,category,email}` e si aspetta `{total, leads:[{name,score,signals}]}`. Quando l'endpoint è pronto:
- imposta `GLE_API_URL` nella landing all'URL del tuo `/api/scan`,
- imposta `CALENDLY_URL`,
- la landing esce dalla modalità DEMO in automatico.

---

## ORDINE DI BUILD
1. Tabelle (subscribers + scan salvata). 2. `/api/scan` con validazione + rate-limit. 3. Scansione lite riusando scoring esistente + masking. 4. Resend + notifica Telegram + sync. 5. CORS + test con la landing.
Lavora in autonomia; placeholder in `.env.example` (GOOGLE_PLACES_KEY, RESEND_API_KEY, TELEGRAM_*, CALENDLY_URL); riepiloga alla fine cosa serve da me.
