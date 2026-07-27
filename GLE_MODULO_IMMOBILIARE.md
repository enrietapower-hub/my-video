# GLE — MODULO IMMOBILIARE (sezione vera in dashboard, con scraping)

> Da usare in Claude Code dentro il progetto **GlobalLead Engine** (lead-engine sul VPS/PC).
> Conferma in quale progetto sei. Procedi a piccoli passi, STOP dopo ogni step.
> Se nella cartella c'è `demo-immobiliare.html`, usalo come RIFERIMENTO GRAFICO per la UI
> (stessi pannelli: funnel, score, card immobili, incroci) — ma qui i dati sono VERI, non mock.

## OBIETTIVO DI BUSINESS
Voglio propormi alle agenzie immobiliari così: "Mi dai una ZONA precisa (città/quartiere,
o indirizzo + raggio km) e ti trovo io terreni edificabili, immobili di privati, aste e
occasioni — senza che tu faccia sforzi". GLE deve quindi avere una sezione **Immobiliare**
che cerca, salva, punteggia e mette in pipeline questi risultati.

## COSA COSTRUIRE

### A) Nuova sezione "Immobiliare" nella dashboard GLE
Voci: **Ricerche** (ricerche salvate per zona), **Risultati** (annunci/terreni trovati),
**Pipeline** (stati: nuovo → interessante → contattato → in trattativa → chiuso/scartato),
**Incroci** (richiesta cliente ↔ risultati in archivio).

### B) Ricerca per zona (il cuore)
Una "Ricerca salvata" ha: tipo (terreno edificabile / immobile residenziale / asta /
appalto-opportunità), zona (comune/quartiere O indirizzo + raggio km), budget min/max,
mq min, note. Ogni ricerca gira periodicamente (cron o manuale con bottone "Aggiorna ora")
e aggiunge SOLO risultati nuovi (dedup su link/id annuncio).

### C) Fonti dati — IMPORTANTE, sii onesto su cosa è fattibile
Prima di scrivere codice, per OGNI fonte dimmi se è fattibile tecnicamente e come:
1. **subito.it** (immobili + terreni): valuta scraping leggero delle pagine di ricerca
   pubbliche con rate-limit basso e User-Agent onesto. Dimmi i rischi (blocchi, ToS).
2. **Aste giudiziarie**: usa il **Portale delle Vendite Pubbliche**
   (pvp.giustizia.it / portalevenditepubbliche.giustizia.it) — è PUBBLICO e istituzionale,
   perfetto per aste per zona. Priorità ALTA: è la fonte più pulita e nessun competitor la usa bene.
3. **Appalti/opportunità pubbliche**: valuta ANAC / bandi comunali (albo pretorio) se
   esiste un modo semplice per zona; se è complicato, dimmelo e lo rimandiamo.
4. **Facebook Marketplace**: dimmi chiaramente se è praticabile (login richiesto, ToS,
   blocchi). Se è troppo fragile o rischioso NON farlo: meglio poche fonti stabili.
5. **Immobiliare.it / Idealista / Casa.it**: verifica se hanno feed/API o se lo scraping è
   vietato/bloccato; in dubbio, escludili e dimmelo.
REGOLA: partiamo con le 1-2 fonti PIÙ STABILI (consiglio: PVP aste + subito.it), le altre dopo.

### D) Scoring AI dei risultati
Per ogni risultato: punteggio 0-10 basato su prezzo/mq vs media zona, completezza annuncio,
tipologia venditore (privato > agenzia), freschezza annuncio. Mostra il "perché" del punteggio
in una riga. Riusa il motore di scoring che GLE ha già, adattato.

### E) Schema dati (additivo, non toccare le tabelle esistenti)
Nuove tabelle Supabase (proponi tu i nomi/colonne e fammele approvare prima di crearle):
- `ricerche_immobiliari` (tipo, zona, raggio, budget, mq, attiva, cliente_id opzionale)
- `risultati_immobiliari` (ricerca_id, titolo, fonte, link, prezzo, mq, zona, lat/lng se c'è,
  score, motivo_score, stato pipeline, trovato_il, contattato_il, note)
Dedup per link. RLS/service_role come il resto dell'app (tutto server-side).

### F) Incroci (per vendere il servizio alle agenzie)
Form: budget max, zona, mq min, tipo → elenco risultati in archivio ordinati per
compatibilità %. (Come la demo grafica, ma sui dati veri.)

### G) Aggancio ai servizi EnrietaBiz già esistenti
- Bottone "Genera messaggio" su ogni risultato: bozza WhatsApp/email per contattare il
  venditore/inserzionista (riusa il generatore bozze GLE, tono corto e umano).
- I risultati "interessanti" possono entrare nel flusso outreach standard (corsie setter).

## STEP DI LAVORO (con STOP)
1. **STOP 1 — Fattibilità fonti**: analizza le fonti (punto C) e dimmi per ciascuna:
   fattibile sì/no, come, rischi. Proponi le 2 con cui partire. ASPETTA il mio ok.
2. **STOP 2 — Schema**: proponi tabelle + migrazione. ASPETTA ok.
3. **STOP 3 — Backend**: ricerca salvata + fetch fonte 1 (aste PVP) + dedup + scoring.
   Test su una zona vera (es. "Como" o un indirizzo + 10km). Mostrami 10 risultati veri.
4. **STOP 4 — Fonte 2** (subito.it terreni+immobili) con rate-limit gentile. Test.
5. **STOP 5 — UI**: sezione Immobiliare nella dashboard (Ricerche/Risultati/Pipeline/Incroci),
   stile coerente con l'app (riferimento grafico: demo-immobiliare.html se presente).
6. **STOP 6 — Bozze messaggi** + collegamento outreach. Test finale con me.

## PALETTI
- Scraping SEMPRE gentile: pochi request, pause random, cache, mai hammering. Se una fonte
  blocca, ci si ferma e si segnala — niente aggiro-blocchi aggressivo.
- Niente dati inventati: se un campo non c'è nell'annuncio, resta vuoto.
- Non toccare pipeline/outreach esistenti se non nel punto G.
- Ogni modifica a Supabase: prima me la mostri, poi la applichi.
