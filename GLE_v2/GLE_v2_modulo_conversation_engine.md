# GLE v2 — MODULO: Relational Intelligence + Conversation Engine
### Blocco da APPENDERE in fondo al prompt esistente di Claude Code (GlobalLead Engine)
*Non riscrive GLE: aggiunge un modulo. Mantieni tutto il resto invariato (Next.js, Supabase, Google Places, Anthropic API, n8n, sync Notion/Sheets, gate di approvazione).*

---

## CONTESTO PER CLAUDE CODE
GLE oggi TROVA e PUNTEGGIA lead (Google Places). Questo modulo aggiunge tre capacità, mantenendo la filosofia di GLE: **niente si invia senza la mia approvazione**.

1. **Arricchimento relazionale** del lead da fonti pubbliche.
2. **Scoring 2.0** che pesa i segnali di intento, non solo i difetti del sito.
3. **Conversation Engine**: l'AI redige il primo messaggio E gestisce l'intera conversazione fino alla call (Calendly), con ogni invio in coda di approvazione.

> REGOLA FERREA DI SICUREZZA (vincolante in tutto il modulo): nessun messaggio in uscita parte in automatico. Default = TUTTO va in "coda approvazione" e viene inviato solo dopo il mio OK (tap su Telegram). Implementa rate-limit a ritmo umano. Non salvare mai contenuti di messaggi PRIVATI di terzi: usa solo dati e segnali PUBBLICI. Scope = aziende e ruoli professionali (B2B), non profili di privati.

---

## 1. NUOVO MODELLO DATI (Supabase — aggiungi tabelle, non toccare le esistenti)

- `prospect_profile`: prospect_id (fk lead), full_name, role, company, company_size_est, industry, location, channel ('linkedin'|'instagram'|'email'|'telegram'), handle/url, source ('public_profile'|'manual_import'|'places'), enriched_at.
- `prospect_signals`: prospect_id, signal_type, value, weight, detected_at.
  - signal_type ammessi (solo da dati pubblici): `role_match`, `industry_match`, `company_size_fit`, `engages_competitor` (commenta/segue pubblicamente un competitor), `relevant_connection` (collegato/segue ruoli in target), `recent_activity` (post/attività recente sul tema), `bio_keyword` (parole chiave in bio/headline), `hiring_or_growth` (segnali pubblici di crescita).
- `conversations`: id, prospect_id, channel, status ('new'|'awaiting_approval'|'in_progress'|'booked'|'closed'|'stopped'), objective ('book_call'|'qualify'), created_at.
- `messages`: id, conversation_id, direction ('out'|'in'), body, state ('draft'|'approved'|'sent'|'received'|'skipped'|'edited'), proposed_at, sent_at.
- `approval_queue`: id, conversation_id, message_id, preview_text, suggested_action, created_at, decided_at, decision ('approve'|'edit'|'skip').

Genera migration SQL + types TypeScript.

---

## 2. ARRICCHIMENTO (enrichment) — solo fonti pubbliche
Crea un servizio `enrichProspect(prospect_id)` con architettura a **adapter per canale** (pluggable):
- Input: handle/URL pubblico O dati importati manualmente (CSV / lista che fornisco io).
- Estrae da dati PUBBLICI: ruolo/headline, azienda, settore, dimensione stimata, località, parole chiave bio.
- Deduce i `prospect_signals` SOLO da engagement/contenuti pubblici (commenti, tag, follow, post). **Mai** da messaggi privati (non esistono/non accessibili).
- Per LinkedIn/Instagram NON implementare scraping automatico massivo che violi i ToS: usa un adapter che (a) accetta import manuale/seed list, (b) opzionalmente si collega a un connettore/API ufficiale o a un servizio di enrichment di terzi via API key in `.env` (es. una chiave ENRICH_API_KEY se la fornisco), (c) se non disponibile, lascia i campi vuoti e segnala "da arricchire manualmente". Non bloccare la build.
- Scrivi un commento chiaro nel codice: "L'automazione diretta su LinkedIn/IG viola i ToS e rischia il ban: questo adapter è progettato per import + API ufficiali/approvazione umana."

---

## 3. SCORING 2.0 (RelScore)
Estendi lo scoring esistente con un `RelScore` 0–100 = somma pesata di:
- **Fit** (chi è): role_match, industry_match, company_size_fit.
- **Intent** (quanto è caldo ORA): engages_competitor, recent_activity, hiring_or_growth, bio_keyword.
- **Relazione**: relevant_connection.
Ogni segnale ha un peso configurabile in un file `scoring.config.ts` (così lo taro senza toccare il codice). Output: punteggio + 1 frase "perché ora" generata dall'AI (es. "Segue 2 competitor e ha pubblicato la settimana scorsa sul tema X"). Ordina la dashboard per RelScore decrescente. Mantieni anche il vecchio punteggio "qualità sito" come sotto-componente.

---

## 4. CONVERSATION ENGINE (il cuore del modulo)
Servizio `runConversation(prospect_id)` che usa Anthropic API:

**a. Primo messaggio.** Genera un'apertura personalizzata sui dati arricchiti (no template uguale per tutti). Esempio di stile (NON copiarlo, usalo come tono): apertura breve, riferimento concreto al suo profilo/attività, una domanda. Tono configurabile in `voice.config.ts` (il mio: diretto, caldo, professionale, niente "spam vendita").

**b. Multi-turn.** Quando arriva una risposta (`direction:'in'`), l'AI propone la replica successiva in base a:
- l'obiettivo (`book_call` → portare al mio link Calendly; oppure `qualify`),
- la cronologia della conversazione (passa SEMPRE tutta la history nel prompt),
- regole anti-spam: max 1 messaggio per turno, si ferma se la persona dice no / chiede stop (gestisci opt-out → status 'stopped').

**c. Obiettivo.** Spingere a una call conoscitiva via Calendly (usa la mia variabile CALENDLY_URL in `.env`) oppure qualificare in chat. Quando il prospect accetta/prenota → status 'booked' + notifica.

**d. GATE DI APPROVAZIONE (obbligatorio).** OGNI messaggio in uscita:
1. viene salvato come `messages.state='draft'` e messo in `approval_queue`;
2. mi arriva un'**anteprima su Telegram** (riusa il bot/preview già presente in GLE) con il testo proposto e i bottoni: ✅ Approva · ✏️ Modifica · ⏭️ Salta;
3. se Approvo → `state='approved'` poi `'sent'` e invio reale tramite l'adapter del canale;
4. se Modifico → mi fa inserire il testo e poi invia il mio;
5. se Salto → `state='skipped'`, conversazione in pausa.
Nessun invio senza passare da qui. (Esattamente come "send as manual message / human intervention".)

**e. Adapter di invio per canale** (`channelAdapters/`): `email` (già in GLE, riusalo), `telegram`, e stub `linkedin`/`instagram` che, se non c'è un canale ufficiale/approvato, NON inviano automaticamente ma mi preparano il messaggio pronto da incollare (modalità "assisted send"). Tutto dietro la stessa coda di approvazione.

---

## 5. GUARDRAIL / COMPLIANCE (implementa, non sono opzionali)
- **Kill switch** globale: variabile `OUTREACH_ENABLED` in `.env`; se false, il sistema arricchisce e punteggia ma NON propone invii.
- **Rate limit umano**: max N messaggi/giorno per canale (config), con jitter temporale; mai raffiche.
- **Opt-out**: se un prospect chiede di non essere contattato → flag `do_not_contact=true`, escluso per sempre.
- **Scope B2B**: enrichment e outreach solo verso aziende/ruoli professionali. Niente profilazione di privati.
- **Privacy**: non salvare contenuti privati di terzi; logga la fonte pubblica di ogni dato. Aggiungi una nota GDPR nel README (base giuridica = legittimo interesse B2B, diritto di opposizione, dati minimi).
- `.env` nel `.gitignore`. Nessuna chiave a schermo (mostra solo ultimi 4 caratteri).

---

## 6. DASHBOARD (aggiunte UI)
- Colonna **RelScore** + frase "perché ora" su ogni lead.
- Vista **Conversazioni**: lista per status (new / awaiting_approval / in_progress / booked).
- **Coda approvazione** in evidenza (badge col numero di messaggi da approvare), specchio di ciò che mi arriva su Telegram.
- Pulsante per lead: "Avvia conversazione (obiettivo: prenota call)".

---

## ORDINE DI BUILD
1. Migration + types (sez. 1). 2. Enrichment adapter + import manuale (sez. 2). 3. Scoring 2.0 (sez. 3). 4. Conversation Engine + gate Telegram (sez. 4). 5. Guardrail (sez. 5). 6. UI (sez. 6).
Lavora in autonomia fino al completamento; se manca una chiave/variabile usa placeholder in `.env.example`, segna ❌ e prosegui. Alla fine fammi un riepilogo di cosa serve da me (chiavi, CALENDLY_URL, eventuale ENRICH_API_KEY).
