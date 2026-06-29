# PIANO FOLLOW-UP — GlobalLead Engine

> ISTRUZIONI PER CLAUDE CODE: implementa la sequenza di follow-up descritta qui sotto.
> Progetto: GlobalLead Engine (cartella .agents/lead-engine, Supabase hmvoljehdquikawksklf — NON GrowthOS).
> Conferma in quale progetto sei. Procedi a piccoli passi, fermandoti a ogni STOP.

## STEP 1 — Diagnosi (STOP dopo)
Dimmi come faccio a sapere quali lead hanno RISPOSTO (le risposte arrivano nella mia
email, non nell'app). Se non c'è un modo automatico, proponi il più semplice (es. un
bottone "ha risposto" oppure lettura da Gmail) — perché i follow-up NON devono partire
a chi ha già risposto o si è disiscritto. Mostrami anche quanti lead sono oggi
"aperto-non-risposto". STOP.

## STEP 2 — Logica (STOP dopo)
- FU1: dopo 3 giorni dall'apertura senza risposta
- FU2: dopo altri 4 giorni
- FU3: dopo altri 5 giorni
- Dopo FU3 senza risposta → stato `non_risposto` (NON cancellare: i lead vanno riusati in futuro)
- Stati gestiti: nuovo / contattato / aperto / in_followup / risposto / non_risposto / disiscritto / bounce
- ANTI-SPAM obbligatorio: limite giornaliero basso (configurabile), pausa/randomizzazione
  tra invii, link di disiscrizione in ogni email, STOP immediato se il lead risponde o disiscrive.
Mostrami la logica. STOP.

## STEP 3 — Testi (tono informale "tu") (STOP dopo)

### Follow-up 1 — Oggetto: "Ti è arrivato il mio messaggio?"
Ciao [Nome], ti avevo scritto qualche giorno fa — volevo solo assicurarmi che non si
fosse perso tra le email 🙂 Hai avuto modo di dargli un'occhiata? Se è un periodo no,
dimmelo pure, nessun problema.

### Follow-up 2 — Oggetto: "Te lo faccio vedere, non solo dire"
Ciao [Nome], torno un attimo perché credo ti sia più utile vedere cosa intendo.
Ho creato ALMAIRA, un assistente AI che risponde ai messaggi dei tuoi clienti e fissa
gli appuntamenti al posto tuo, 24 ore su 24 — anche quando sei impegnata o chiusa.
Per un'attività come la tua significa zero richieste perse e meno tempo al telefono.
Un esempio di strumento interattivo che costruisco 👉 {{ESEMPIO_LINK}}
Se ti va, in 15 minuti ti mostro ALMAIRA applicata alla TUA attività: [CALENDLY]

P.S. Ti chiederai come sono arrivata proprio a te: questa email è la prova 🙂 Uso un mio
software che trova le aziende giuste per settore e zona, ovunque. Vuoi provarlo gratis
sulla tua zona? 👉 https://enrietabiz.com/scansiona

### Follow-up 3 — Oggetto: "Ultimo messaggio, promesso 🙂"
Ciao [Nome], questo è il mio ultimo messaggio — non voglio disturbarti. Se più avanti
vorrai automatizzare appuntamenti e risposte con ALMAIRA, sai dove trovarmi.
Ti auguro il meglio! 🌿

P.S. Intanto, se ti va, prova gratis a vedere quante attività nella tua zona stanno
perdendo clienti 👉 https://enrietabiz.com/scansiona

### {{ESEMPIO_LINK}} dinamico per CATEGORIA del lead (default = automazione-quiz)
- coach, life/business coach, psicologo, yoga, pilates, personal trainer
  → https://femme-forward-quizlucidita.netlify.app
- centro estetico, estetista, spa, parrucchiere, nail
  → https://wonders-team-carolina-test.netlify.app
- tutto il resto (default)
  → https://automazione-quiz.netlify.app

Per [CALENDLY]: usa la variabile CALENDLY_URL se esiste, altrimenti lascia un placeholder
e segnalamelo. Mostrami i 3 testi finali con i link inseriti. STOP.

## STEP 4 — Test (STOP dopo)
Prova su 2-3 lead di test (niente invio reale di massa). STOP.

## STEP 5 — Attiva (STOP dopo)
Attiva sulla coda reale partendo con POCHI invii al giorno. STOP.

> Nota: non aumentare il volume totale di email adesso. Prima solo i follow-up.
