# GLE — Pipeline prenotazioni call (Calendly → CRM)

> Da usare in Claude Code dentro il progetto GlobalLead Engine. Conferma in quale progetto sei.
> Prima INVESTIGA e riportami cosa trovi. Non modificare nulla prima del mio ok. STOP dopo ogni step.

## CONTESTO
Un lead (Benevent Planner) ha prenotato una call conoscitiva tramite Calendly. Sono andato a
cercarla nel CRM per prepararmi alla call e non ho trovato nessuna traccia: nessuna pipeline, nessuna
vista di "chi ha prenotato la call". Ho controllato il database direttamente e i campi che dovrebbero
tracciare questo (`leads.gia_prenotazioni`, `leads.prenotato_il`) esistono già nello schema ma sono
`false`/`null` su **tutte e 17.792** le righe della tabella `leads` — zero eccezioni. Nessun lead ha
mai avuto questo campo popolato, quindi non è un problema di "non lo trovo nell'interfaccia": il dato
non c'è mai stato scritto da nessuna parte.

Ho corretto a mano il singolo record di Benevent Planner (via SQL diretto, con nota) solo per non
perdere quell'informazione nel frattempo. Ma il problema vero è sistemico: non esiste oggi nessun
meccanismo automatico che colleghi una prenotazione Calendly a un lead nel CRM. Questo file serve a
capire perché e a costruire il fix definitivo.

## STEP 1 — Ricognizione (STOP dopo, riportami tutto prima di procedere)
Rispondi a queste domande separate, con riferimenti precisi al codice/config trovati:

1. **Esiste già, da qualche parte nel codebase, un'integrazione con Calendly** (webhook endpoint,
   API polling, Zapier/automazione esterna collegata)? Cerca menzioni di "calendly" nel codice, nelle
   env var, nelle migrazioni, nella cartella delle integrazioni. Se esiste, mostrami dove e in che
   stato è (attiva ma non scrive su `leads`? mai completata? codice morto?).
2. **A cosa servono oggi `gia_prenotazioni` e `prenotato_il`** nello schema — chi li legge? C'è una
   UI (dashboard, scheda lead, cabina setter) che già mostra questi campi ma semplicemente non riceve
   mai il dato, o non sono referenziati da nessuna parte nel frontend?
3. **Come viene oggi comunicata una prenotazione Calendly al team** — solo email di conferma
   (come nel caso di Benevent), o c'è un altro canale (Telegram, notifica) già collegato a qualcosa?
4. **Il link Calendly usato con i lead è unico/tracciabile per lead**, o è un link generico uguale
   per tutti (es. stesso link "Enrietabiz Calendly" mandato a chiunque)? Questo è importante: se il
   link è generico, Calendly di per sé non sa "quale lead del CRM" ha prenotato — va capito come si
   può fare il match (email? nome attività nel campo "note" della prenotazione? UTM/parametro custom
   nel link?).

Riportami le risposte alle 4 domande PRIMA di proporre qualsiasi fix.

## STEP 2 — Proposta di soluzione (STOP, aspetta il mio ok esplicito)
In base a cosa trovi allo STEP 1, proponimi un disegno concreto. Punti che deve coprire la proposta:

1. **Come si riceve l'evento di prenotazione**: verosimilmente un webhook Calendly
   (`invitee.created`) che arriva a un endpoint nel backend GLE. Se questo endpoint non esiste,
   proponi come costruirlo (route, verifica firma webhook Calendly, formato payload).
2. **Come si fa il match prenotazione → lead esistente**: proponimi la logica di matching (es. per
   email dell'invitato, o telefono, o nome attività scritto in un campo custom del form Calendly) e
   cosa succede se NON trova un match (es. l'email della prenotazione è diversa da quella nel CRM,
   come nel caso reale di Benevent dove martinabenevent@gmail.com non era l'email già in
   `leads`) — non deve MAI creare un duplicato silenzioso o perdere la prenotazione: proponimi una
   coda "da abbinare manualmente" per i casi senza match automatico sicuro.
3. **Cosa scrive nel CRM quando trova un match**: aggiorna `gia_prenotazioni=true`,
   `prenotato_il=<data/ora dalla prenotazione>`, e aggiunge una nota con i dettagli (nome chi ha
   prenotato, email, eventuale messaggio/topic della richiesta) — stesso pattern che ho usato a mano
   per Benevent.
4. **Vista "Call prenotate" nel CRM/cabina setter**: proponimi dove aggiungere una vista/filtro che
   mostri tutti i lead con `gia_prenotazioni=true` ordinati per `prenotato_il` più vicino, così questa
   diventa una vera pipeline visibile e non un campo sepolto nel DB.
5. **Notifica al team**: quando arriva una nuova prenotazione con match trovato, proponimi se/come
   avvisare (es. messaggio Telegram alla setter assegnata al lead, o a me) — non inventare canali che
   non esistono già nel progetto, riusa quelli presenti (vedi come funziona già l'invio delle bozze
   in coda di approvazione).

Aspetta la mia conferma esplicita sul disegno prima di scrivere codice.

## STEP 3 — Implementazione (solo dopo il mio ok, STOP dopo)
Implementa solo quanto confermato allo STEP 2. Non toccare `invio_limite_giornaliero`,
`invio_auto_attivo`, né la logica di invio/generazione bozze esistente — questa è una feature di
INGESTION di eventi Calendly, separata da tutto il resto.

## STEP 4 — Test (STOP dopo)
Verifica end-to-end senza inventare dati finti su lead reali:
1. Se Calendly ha un modo di inviare un evento di test al webhook, usalo e mostrami il risultato
   (il lead giusto si aggiorna? la nota è corretta?).
2. Altrimenti, simula un payload realistico (con dati chiaramente marcati come test, es. email
   `test@example.com`, MAI usando dati di un lead vero per il test) e mostrami cosa succede sia nel
   caso di match trovato che nel caso di nessun match.
3. Mostrami come appare la nuova vista "Call prenotate" con almeno il record di Benevent Planner
   dentro (quello già corretto a mano).

## REGOLE
- Non inventare campi, tabelle o integrazioni che non esistono già senza la mia conferma esplicita
  allo STEP 2.
- Nessun collegamento automatico che possa creare un lead duplicato o sovrascrivere dati esistenti di
  un lead reale senza un match affidabile — nel dubbio, coda manuale, mai un update silenzioso su un
  match incerto.
- Non toccare invio automatico di messaggi/bozze esistente: questo file riguarda SOLO l'ingestion
  delle prenotazioni e la loro visibilità nel CRM.
- Se durante lo STEP 1 scopri che esiste già un'integrazione Calendly incompleta o rotta, dimmelo
  chiaramente invece di presumere che vada costruita da zero.
