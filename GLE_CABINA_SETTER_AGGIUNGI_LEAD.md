# GLE — Cabina Setter: "Cerca / Aggiungi lead manuale"

> Da usare in Claude Code dentro il progetto GlobalLead Engine. Conferma in quale progetto sei.
> Feature additiva sulla cabina setter esistente. STOP dopo ogni step.

## PERCHÉ SERVE (contesto reale)
Una setter (Daniela) ha ricevuto 21 nominativi da richiamare (lead che avevano riaperto le email
più volte senza mai essere ricontattati). Voleva cercarli e assegnarli a sé nella cabina setter
per monitorarli, ma non esisteva un modo per farlo da sola — ho dovuto cercarli e riassegnarli
io a mano via database. Serve una funzione self-service.

## OBIETTIVO
Nella sezione "Cabina Setter" (dove ogni setter vede i lead assegnati a `assegnato_a` = suo
nome), aggiungere un pulsante **"+ Cerca / Aggiungi lead"** con due modalità:

### Modalità A — Cerca tra i lead esistenti
Un campo di ricerca (per nome attività, telefono o email) che cerca nella tabella `leads`
esistente. Risultati mostrati con: nome, categoria, città, telefono, email, **a chi è
attualmente assegnato** (importante: deve essere visibile prima di prendere il lead, per
trasparenza col team). Bottone "Assegna a me" su ogni risultato che aggiorna `assegnato_a` al
nome della setter loggata.

**Attenzione UX importante**: se il lead è già assegnato a un'altra persona, mostra un avviso
tipo "Attualmente assegnato a [Nome] — prenderlo lo toglierà dalla sua cabina" e chiedi conferma
prima di procedere. Non permettere il furto silenzioso di lead tra colleghe.

### Modalità B — Aggiungi manualmente (lead nuovo, non ancora in GLE)
Se la ricerca in Modalità A non trova nulla, form minimo per creare un nuovo lead:
- `nome_attivita` (obbligatorio)
- `telefono`, `email`, `citta`, `categoria`, `note_setter` (tutti opzionali)
- `assegnato_a` = automaticamente la setter loggata
- `stato` = 'nuovo' (default esistente)
- `stato_setter` = 'da_contattare' (default esistente)
- `progetto` = quello di default già in uso per i lead manuali (verifica quale valore usano
  già i lead creati a mano esistenti, es. "Daniele", "Daniela Prosperi", "Max SaventFlags" —
  guarda il loro campo `progetto` per capire lo standard attuale, se ce l'hanno)

## STEP 1 — Ricognizione (STOP dopo)
Trova dove nel codice è la sezione "Cabina Setter" (probabilmente filtra `leads` per
`assegnato_a`). Guarda come sono strutturati i 3 lead creati manualmente in passato (Daniele,
Daniela Prosperi, Max SaventFlags: hanno solo nome_attivita e assegnato_a, tutto il resto null)
per capire lo standard minimo già in uso. Dimmi dove si aggiunge il nuovo pulsante e componente.

## STEP 2 — Ricerca (Modalità A) (STOP dopo)
Implementa il campo di ricerca + risultati + bottone "Assegna a me" con l'avviso di conferma se
già assegnato ad altri. Usa una query case-insensitive su `nome_attivita`, `telefono`, `email`
(ILIKE o simile). Testa cercando "Oriente Beauty" (deve trovarlo, è già assegnato a Daniela) e
verifica che l'avviso "già assegnato" NON appaia per lead assegnati alla setter stessa.

## STEP 3 — Aggiunta manuale (Modalità B) (STOP dopo)
Implementa il form minimo. Solo `nome_attivita` obbligatorio. Dopo il salvataggio il lead deve
comparire subito nella cabina della setter che l'ha creato. Testa creando un lead di prova
(poi lo cancelliamo).

## STEP 4 — Test finale (STOP dopo)
1. Cerca un nome esistente non assegnato a te → verifica che compaia senza avvisi bloccanti.
2. Cerca un nome assegnato a un'altra setter → verifica che appaia l'avviso di conferma.
3. Crea un lead nuovo via Modalità B → verifica che compaia nella cabina.
4. Cancella il lead di prova creato per il test.
Mostrami screenshot o conferma di ognuno dei 4 test. STOP.

## REGOLE
- Non toccare la logica esistente di assegnazione automatica dei lead da scraping/scan.
- Non permettere la ricerca/assegnazione a chi non è loggato come setter (stessa autenticazione
  già in uso per la cabina).
- Nessuna notifica automatica alla setter "derubata" per ora — è una funzione manuale, la
  trasparenza la dà l'avviso a schermo prima della conferma, non serve altro per questa v1.
