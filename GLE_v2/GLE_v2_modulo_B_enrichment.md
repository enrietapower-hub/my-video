# GLE v2 — MODULO B: Enrichment / Profilazione Azienda
### Blocco da APPENDERE in fondo al prompt esistente di GlobalLead Engine
*Aggiunge un modulo. Non riscrive GLE. Complementare al Modulo A (Conversation Engine): qui arricchiamo l'AZIENDA, là il CONTATTO.*

---

## CONTESTO PER CLAUDE CODE
Oggi GLE trova aziende (Google Places) e le punteggia sulla qualità del sito. Questo modulo **arricchisce ogni azienda** con un profilo firmografico, così lo scoring diventa più intelligente e il messaggio più mirato.

> REGOLE DI SICUREZZA (vincolanti): solo dati di AZIENDE da fonti PUBBLICHE (sito vetrina, profili social pubblici, recensioni pubbliche, Google Places). Dimensione SEMPRE a FASCE, mai fatturati esatti o dati di persone fisiche. Niente profilazione di privati (GDPR). Se un dato non è certo, lascialo vuoto e segna "da verificare", non inventare.

---

## 1. NUOVO MODELLO DATI (Supabase — aggiungi, non toccare l'esistente)
- `lead_enrichment`: lead_id (fk), settore, cosa_fa (1 frase), fascia_dimensione ('micro 1-9'|'piccola 10-49'|'media 50-249'|'grande 250+'|'n/d'), ha_sito (bool), qualita_sito_note, ha_ecommerce (bool), ha_booking (bool), canali_social (jsonb: instagram/facebook/linkedin/tiktok url), recensioni_medie (num), n_recensioni (int), annunci_attivi (bool, se rilevabile pubblicamente), zona, lingua_sito, enriched_at, fonte (jsonb con URL pubblici usati).
- `enrichment_queue`: lead_id, status ('queued'|'done'|'failed'|'skipped'), queued_at, done_at. (Mostra in dashboard un contatore tipo "N leads in coda di arricchimento".)

Genera migration SQL + types TS.

---

## 2. SERVIZIO `enrichLead(lead_id)`
Architettura ad **adapter** (pluggable), in quest'ordine, fermandosi appena ha abbastanza dati:
1. **Google Places details** (già integrato): categoria, recensioni, sito, telefono, indirizzo → settore + zona + recensioni.
2. **Sito web pubblico dell'azienda** (la loro vetrina, è lecito leggerla): estrai cosa_fa (1 frase), presenza booking/e-commerce, link social, lingua. Rispetta robots.txt e un rate-limit gentile.
3. **Social pubblici**: solo dati pubblici della *pagina aziendale* (bio, link). Niente scraping di persone o follower.
4. **Fascia dimensione**: stimala da segnali pubblici (n° sedi, team page, "chi siamo", n° recensioni) e assegna una FASCIA. Mai numeri di fatturato.
5. (Opzionale) **API enrichment di terzi** se fornisco `ENRICH_API_KEY` in `.env`; se assente, salta e prosegui.
Se l'arricchimento fallisce → status 'failed', non bloccare la pipeline.

Esegui l'enrichment in batch dalla `enrichment_queue` (es. via scheduler n8n esistente), così di notte i lead trovati vengono anche arricchiti.

---

## 3. INTEGRAZIONE CON LO SCORING + RACCOMANDAZIONE SERVIZIO
- Alimenta lo scoring esistente con i nuovi campi: es. **manca sito** → +punti "serve sito"; **no booking ma molte recensioni** → +punti "serve sistema prenotazioni / ALMAIRA"; **e-commerce attivo** → +punti "serve automazione/SEO".
- Estendi/conferma la logica di **raccomandazione servizio EnrietaBiz** già presente: in base al profilo arricchito, suggerisci il servizio giusto (sito, landing booking, ALMAIRA, SEO, GLE) + 1 frase di motivazione generata dall'AI ("ha 200 recensioni a 4.8 ma nessun sistema di prenotazione online → candidata ad ALMAIRA").
- Mostra in dashboard, per ogni lead: settore · fascia · servizio consigliato · motivo.

---

## 4. GUARDRAIL
- Scope = aziende. Niente dati personali di privati. Fasce, non numeri esatti.
- Logga sempre la FONTE pubblica di ogni dato (campo `fonte`).
- Nota GDPR nel README: dati aziendali pubblici, base = legittimo interesse B2B, diritto di rettifica/opposizione, dati minimi.
- `.env` in `.gitignore`; nessuna chiave a schermo (solo ultimi 4 char).

---

## ORDINE DI BUILD
1. Migration + types. 2. `enrichLead` con adapter Places→Sito→Social→Fascia. 3. Batch da coda via scheduler. 4. Integrazione scoring + raccomandazione servizio. 5. UI (colonne settore/fascia/servizio + contatore coda). 
Lavora in autonomia; placeholder in `.env.example` se manca una chiave; riepiloga alla fine cosa serve da me.
