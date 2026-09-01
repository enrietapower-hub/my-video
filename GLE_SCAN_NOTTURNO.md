# GLE — Scan notturno: perché non genera nuove bozze

> Da usare in Claude Code dentro il progetto GlobalLead Engine. Conferma in quale progetto sei.
> Prima INVESTIGA e riportami cosa trovi. Non modificare nulla prima del mio ok. STOP dopo ogni step.

## CONTESTO
Nel database (`impostazioni`):
```
scan_attivo = true
cron_orario = "0 3 * * *"   (ogni notte alle 3)
scan_notturno_preset = []   (VUOTO)
invio_auto_attivo = true
invio_limite_giornaliero = 15   (per casella, 2 caselle = 30/giorno reali — NON toccare)
followup_limite_giornaliero = 5
```
Ci sono **5.306 lead qualificati (score ≥50)** mai contattati e senza nessuna bozza generata
(tabella `messaggi` — zero righe per loro). Il sospetto è che il preset vuoto blocchi lo scan
notturno, ma non è confermato: potrebbe anche essere che lo scan notturno serva SOLO a cercare
lead NUOVI (scraping) e sia un processo diverso dalla generazione bozze sul backlog esistente.
Vanno capite entrambe le cose separatamente prima di toccare qualsiasi codice.

## STEP 1 — Ricognizione (STOP dopo, riportami tutto prima di procedere)
Trova nel codice il job schedulato sul `cron_orario` e rispondi a queste domande separate:

1. **Cosa fa oggi il job notturno quando `scan_notturno_preset` è vuoto?** Si ferma subito
   (skip), va in errore, o fa comunque qualcosa? Mostrami il punto esatto del codice.
2. **A cosa serve `scan_notturno_preset`?** È la lista di ricerche da fare per trovare lead NUOVI
   (es. categoria+città da cercare su Maps/scraping), o controlla anche altro (es. quali segmenti
   generare bozze)?
3. **Esiste, separatamente, un processo che genera bozze automatiche per i lead GIÀ presenti e
   qualificati ma senza messaggi?** Se sì, dov'è, e perché non sta processando i 5.306? Se non
   esiste, confermalo esplicitamente — non presumerlo.
4. Controlla se `scan_notturno_preset` aveva un valore in passato (log, storico, migrazioni) che
   possa spiegare perché ora è vuoto — svuotato per errore, o mai popolato dall'inizio?

Riportami le risposte alle 4 domande PRIMA di proporre qualsiasi fix.

## STEP 2 — Proposta di soluzione (STOP, aspetta il mio ok esplicito)
In base a cosa trovi allo STEP 1, preparati a UNA di queste due strade (o entrambe se servono
davvero due cose separate):

**Se il problema è solo il preset di ricerca nuovi lead vuoto:**
Proponimi una lista di preset (categoria + città/zona) basata SOLO su segmenti che già uso
attivamente (es. quelli visti nei dati: nutrizionista, estetista, centro estetico, veterinario,
fisioterapista, agenzia immobiliare, spa, coach — nelle zone italiane e svizzere già coperte).
Non inventare categorie o zone nuove di tua iniziativa: proponi, io scelgo/conferm.

**Se manca un processo di generazione bozze automatica sul backlog esistente (i 5.306):**
Proponimi come costruirlo: ogni notte prende N lead qualificati senza messaggi (ordinati per
score decrescente), genera la bozza standard del segmento giusto (riusando il generatore già
esistente per Cliniche/Fisio/Estetica/Enagic/Luxury/Velvet — MAI un generatore nuovo scollegato),
la manda in coda di approvazione su Telegram come le altre. Con un limite giornaliero prudente
(proponimi tu un numero ragionevole, es. 20-30 bozze/notte) — resta comunque tutto dietro
approvazione manuale, non si attiva l'invio automatico di bozze mai riviste da un umano.

Aspetta la mia conferma su quale delle due strade (o entrambe) prima di scrivere codice.

## STEP 3 — Implementazione (solo dopo il mio ok, STOP dopo)
Implementa solo quanto confermato. Non toccare `invio_limite_giornaliero`,
`followup_limite_giornaliero`, né la logica di invio automatico esistente (`invio_auto_attivo`) —
questa è una feature di GENERAZIONE bozze, non di invio.

## STEP 4 — Test (STOP dopo)
Fai girare il job manualmente (senza aspettare le 3 di notte) e mostrami: quante bozze nuove ha
generato, su quali lead, e che aspetto hanno 2-3 di esempio.

## REGOLE
- Nessun invio automatico di bozze mai approvate da un umano — restano "bozza" finché qualcuno
  (io o le setter) non le approva, come per tutti gli altri segmenti.
- Nessuna categoria/zona di ricerca inventata senza la mia conferma esplicita.
- Se lo scan notturno e la generazione bozze sul backlog risultano essere la stessa cosa/lo stesso
  problema, dimmelo chiaramente allo STEP 1 invece di trattarli come due fix separati.
