# GLE v2 — MODULO C: Filtro "Cliente Ideale per Licenza GLE"
### Blocco da APPENDERE in fondo al prompt esistente di GlobalLead Engine
*Aggiunge un modulo. Idea: usare GLE stesso per trovare le aziende a cui VENDERE la licenza di GLE. Il software trova i suoi clienti.*

---

## CONTESTO PER CLAUDE CODE
GLE ha due linee di business distinte, NON confonderle:
- **Linea 1** = lead in abbonamento (trovo lead per il cliente).
- **Linea 2** = **licenza d'uso di GLE** (il cliente usa il motore, ospitato sul mio VPS, accesso revocabile se non paga).
Questo modulo serve alla **Linea 2**: tra tutte le aziende che GLE già trova/arricchisce, identifica i **candidati ideali a comprare la LICENZA**.

> Nota di linguaggio (importante): si dice **"licenza d'uso"** / "noleggio software" / "abbonamento", MAI "comodato" (= prestito gratuito). Usa "licenza" ovunque.

---

## 1. CHI È IL CLIENTE IDEALE PER LA LICENZA (ICP Linea 2)
Profili per cui "trovare clienti" è il problema #1 quotidiano → comprano il motore:
- Agenzie / freelance di marketing e social (rivendono lead ai loro clienti)
- Call center / teleselling (vivono di liste e contatti)
- Setter / closer / venditori a provvigione
- Reti vendita / PMI con forza commerciale propria
- Agenzie immobiliari con team commerciale

---

## 2. NUOVO MODELLO DATI (Supabase — aggiungi)
- Aggiungi al lead: `is_licensee_candidate` (bool), `licensee_score` (0–100), `licensee_reason` (text), `licensee_segment` (enum dei profili sopra).

---

## 3. SERVIZIO `scoreLicensee(lead_id)` — LicenseeScore 0–100
Calcola da dati PUBBLICI già raccolti (Places + enrichment Modulo B), pesi configurabili in `licensee.config.ts`:
- **Categoria/settore** corrisponde a un ICP Linea 2 (agenzia, call center, marketing, vendite, immobiliare con rete) → peso alto.
- **Parole chiave** in nome/sito/bio: "agenzia", "lead", "marketing", "social media", "vendite", "teleselling", "call center", "consulenza commerciale".
- **Segnali di forza commerciale**: team/venditori citati, annunci pubblici di ricerca venditori/setter, più sedi.
- **Dipendenza da nuovi clienti**: business basato su acquisizione continua.
Output: punteggio + `licensee_segment` + 1 frase `licensee_reason` generata dall'AI ("Agenzia social con team vendite: vive di acquisizione → ottimo candidato licenza GLE").
Imposta `is_licensee_candidate=true` sopra una soglia configurabile.

---

## 4. DASHBOARD — nuova vista "Clienti LICENZA GLE"
- Segmento/tab dedicato che mostra SOLO i `is_licensee_candidate=true`, ordinati per `licensee_score`.
- Colonne: azienda · segmento · LicenseeScore · motivo · azione ("Avvia conversazione licenza").
- Tieni questa vista SEPARATA dai lead "Linea 1" (clienti dei miei servizi), per non mischiare i due listini.

---

## 5. AGGANCIO AL CONVERSATION ENGINE (Modulo A)
Se è installato il Modulo A: per un `licensee_candidate`, l'obiettivo conversazione diventa **vendere la licenza** (non i miei servizi). Usa un `voice/objective` dedicato: tono peer-to-peer ("aiuto chi come te vive di acquisizione clienti a smettere di cercarli a mano"), CTA a una demo in cui mostro **solo l'output dei lead, mai il motore** (protezione IP). Sempre con gate di approvazione.

---

## 6. GUARDRAIL
- Dati aziendali pubblici, scope B2B, niente persone fisiche.
- In demo/licenza: mostra l'output, non il funzionamento interno; clausola di non-replica prima di ogni accesso; accesso revocabile (hosting sul mio VPS, mai consegna del codice).
- `.env` in `.gitignore`.

---

## ORDINE DI BUILD
1. Campi licensee sul lead (migration). 2. `scoreLicensee` + config pesi. 3. Vista dashboard "Clienti LICENZA GLE". 4. (Se c'è il Modulo A) objective "vendi licenza". 
Lavora in autonomia; riepiloga alla fine cosa serve da me.
