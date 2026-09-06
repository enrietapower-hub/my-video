# GLE — Cosa fa davvero il sistema Reputazione/Recensioni (mai esplorato finora)

> Da usare in Claude Code dentro il progetto GlobalLead Engine. Conferma in quale progetto sei.
> Prima INVESTIGA e riportami cosa trovi. Non modificare nulla prima del mio ok. STOP dopo ogni step.

## CONTESTO
Durante un fix di sicurezza precedente (RLS su Supabase) sono emerse, tra le tabelle già protette
correttamente nel database, cinque tabelle mai discusse finora in nessun prompt GLE:
```
reputation_sources
reviews
review_analyses
reputation_snapshots
reputation_audits
```

**Aggiornamento — verificato già via query dirette sul database (non serve rifare questa parte):**
Non è scaffolding morto. È un generatore di **audit reputazione automatico, già funzionante e
testato su dati veri**:
- 6 `reputation_sources` collegate a 6 lead reali e diversi per settore (autoscuola, 2 cliniche
  veterinarie, palestra, parrucchiere, centro commerciale), fonte Google via provider "serper".
- 120 recensioni reali scaricate (`reviews`), **tutte** analizzate dall'AI (`review_analyses`):
  sentiment, temi, urgenza, risposta suggerita.
- 6 `reputation_snapshots` con rating medio, totale recensioni, recensioni ultimi 90gg, tasso di
  risposta del gestore.
- 6 `reputation_audits` completi: punteggio 0-100, temi critici/positivi estratti, **PDF già
  generato** (`pdf_path` valorizzato per tutti e 6, es.
  `reputation/9fe31e59-.../2026-08-25-1787654249542.pdf`).
- **Ma `sent_at` e `opened_at` sono NULL su tutti e 6** — nessun audit è mai stato inviato a
  nessun lead.
- Il lavoro è distribuito su due sessioni distinte (3 agosto, poi 25-26 agosto 2026), non un test
  isolato — poi si è fermato del tutto per oltre 10 giorni.
- Esempio concreto (Fit Express Rimini): rating 3.5, 348 recensioni, tasso di risposta 10%, **10
  recensioni negative senza risposta**, temi critici "Atteggiamento del personale"/"Sauna"/
  "Accoglienza clienti", score 34/100 — è esattamente il tipo di dato reale che serve per un audit
  "porta d'ingresso" di alto livello, molto più ricco dei semplici `sito_obsoleto`/`ha_booking`
  usati in `GLE_AUDIT_AUTOMATICO.md`.

Quindi la domanda non è più "cosa fa", ma: **perché si è fermato dopo il 26 agosto, e come si
collega (o si integra) con l'audit automatico già in coda?**

## STEP 1 — Cosa manca per renderlo vivo (STOP dopo, riportami tutto prima di procedere)
Il database è già verificato (vedi sopra) — concentrati sul codice:

1. **Trova lo script/funzione** che genera source → reviews → analyses → snapshot → audit PDF.
   È un job manuale (lanciato a mano due volte), un cron mai attivato, o un endpoint mai collegato
   a un bottone nell'interfaccia?
2. **Perché si è fermato il 26 agosto?** Cerca errori, TODO, commenti, o un limite tecnico (rate
   limit del provider "serper", costo per chiamata, credenziali scadute) che possa spiegarlo.
3. **Come si arriva ai 6 lead scelti**: c'è un criterio (categoria, score, settore) o sono stati
   scelti a mano per testare il sistema su tipologie diverse?
4. **Invio**: esiste già del codice per "inviare" l'audit (email, WhatsApp, link con tracking per
   popolare `opened_at`), anche se mai usato? O manca completamente il passo di invio?
5. **Relazione con l'audit automatico esistente** (`GLE_AUDIT_AUTOMATICO.md`, ancora in coda, basato
   su `sito_obsoleto`/`ha_booking`): sono due sistemi paralleli scollegati, o quello nuovo può/deve
   sostituire quello più semplice come "porta d'ingresso" quando il lead ha recensioni Google
   sufficienti a fare un audit reputazione vero?

Non proporre nulla allo STEP 2 finché non hai risposto a queste 5 domande con dati reali dal
codice.

## STEP 2 — Proposta (STOP, aspetta il mio ok esplicito)
In base a cosa trovi, preparati a UNA di queste strade (o dimmi se ne vedi un'altra più sensata):

**Se il sistema è già collegato ai lead e monitora la loro reputazione nel tempo:**
Proponimi come usarlo per arricchire quello che già esiste:
- Un nuovo gancio per l'outreach/audit automatico: "le vostre recensioni sono calate da X a Y nelle
  ultime settimane" (SOLO se il dato è reale e storico, mai un calo inventato).
- Eventualmente una card nella scheda lead che mostra il trend recensioni, se già raccolto.

**Se il sistema è pensato per i CLIENTI di EnrietaBiz (non i lead) — un servizio di reputation
management vero e proprio:**
Proponimi se e come completarlo come un prodotto/servizio a sé (prezzo, target, cosa mostra al
cliente) — confrontandolo con l'offerta attuale nel listino (RicevAI, Web App, GLE, RicevAI
Ospitalità) per capire se ha senso aggiungerlo o se è meglio lasciarlo da parte.

**Se il sistema è morto/abbandonato e non vale la pena completarlo:**
Dimmelo chiaramente e basta — non forzare un utilizzo se i dati/il codice mostrano che è stato
interrotto per un motivo valido (es. una fonte dati che non funziona più, un'API cambiata).

Aspetta la mia conferma su quale strada prima di scrivere codice.

## STEP 3 — Implementazione (solo dopo il mio ok, STOP dopo)
Implementa solo quanto confermato allo STEP 2. Se tocchi il generatore di bozze o l'audit
automatico esistenti, non riscriverli: aggiungi solo il nuovo gancio/dato, riusando la logica già
in piedi (stesso principio di tutti gli altri prompt GLE — mai due sistemi paralleli scollegati).

## STEP 4 — Test (STOP dopo)
Mostrami un esempio reale (2-3 lead o clienti veri) di come appare il nuovo dato/gancio, prima e
dopo. Se il dato storico non è ancora sufficiente per essere affidabile (es. una sola rilevazione),
dimmelo — meglio aspettare di avere più storico che mostrare un trend basato su un solo punto dato.

## REGOLE
- Non inventare andamenti, numeri o testo di recensioni: solo dati realmente presenti nelle
  tabelle `reputation_*`.
- Non presumere lo scopo del sistema prima di averlo verificato nel codice — è la ragione stessa di
  questo prompt.
- Se scopri che il sistema tratta dati sensibili (es. recensioni di clienti reali con nomi/email)
  gestiti in modo diverso da come pensavi, fermati e segnalamelo prima di proporre qualsiasi uso.
- Nessuna funzione di scraping/raccolta nuova non richiesta: questo prompt è di scoperta, non di
  costruzione di una nuova fonte dati.
