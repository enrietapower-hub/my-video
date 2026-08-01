# GLE — Nuovo segmento "Cliniche private" (DE/IT)

> Da usare in Claude Code dentro il progetto GlobalLead Engine. Conferma in quale progetto sei.
> Bug/feature additiva: non toccare i segmenti esistenti (Enagic, Luxury, Velvet). STOP dopo ogni step.

## OBIETTIVO
Aggiungere un nuovo segmento **"Cliniche private"** (studi medici, cliniche, poliambulatori) con
outreach WhatsApp/telefono in **tedesco** per i lead in Svizzera (Zurigo, Lucerna, zona
germanofona) e in **italiano** per i lead in Italia — lingua scelta in automatico dal paese/zona
del lead (colonna `paese` o `regione` già esistente).

## STEP 1 — Ricognizione (STOP dopo)
Trova dove sono definiti i segmenti esistenti (Enagic, Luxury, Velvet) e la mappa
mittente→firma/presentazione (da GLE_FIX_DANIELA_CRISTINA.md / GLE_OUTREACH_UPDATE.md se già
applicati). Dimmi dove si aggiunge un nuovo segmento e come si assegna un lead a un segmento.

## STEP 2 — Segmento "Cliniche private" (STOP dopo)
Criterio di assegnazione: categoria lead = studio medico / clinica / poliambulatorio / dentista
(o simili). Lingua del messaggio:
- **paese/regione = Svizzera, Zurigo, Lucerna** (o cantoni germanofoni) → **tedesco**
- **paese/regione = Italia** → **italiano**
- altrimenti → fallback italiano

### Script WhatsApp / primo contatto — Tedesco
```
Guten Tag [Name], mein Name ist Enrieta Fontana von EnrietaBiz.
Mir ist aufgefallen, dass viele private Kliniken Anrufe verpassen, wenn die Rezeption besetzt
ist oder außerhalb der Öffnungszeiten — und Patientinnen und Patienten wandern dann oft zur
nächsten Praxis ab.
Wir haben eine KI-Rezeptionistin entwickelt, die Anfragen und Terminwünsche über WhatsApp rund
um die Uhr entgegennimmt und direkt in den Kalender einträgt.
Hätten Sie Interesse an einem kurzen, unverbindlichen Gespräch von 15 Minuten, um zu sehen, ob
das für Ihre Praxis Sinn ergibt?
```

### Script WhatsApp / primo contatto — Italiano
```
Buongiorno [Nome], sono Enrieta Fontana di EnrietaBiz.
Ho notato che molte cliniche private perdono chiamate quando la reception è occupata o fuori
orario — e spesso il paziente si rivolge altrove.
Abbiamo sviluppato una receptionist AI che risponde su WhatsApp 24 ore su 24, gestisce le
richieste e fissa gli appuntamenti direttamente in agenda.
Le andrebbe una call di 15 minuti, senza impegno, per vedere se può avere senso per il vostro
studio?
```

### Follow-up 1 (dopo qualche giorno) — Tedesco
```
Guten Tag [Name], ich wollte kurz nachfragen, ob meine Nachricht angekommen ist — falls es
gerade ungünstig ist, sagen Sie es mir einfach, kein Problem 🙂
```
### Follow-up 1 — Italiano
```
Buongiorno [Nome], volevo solo assicurarmi che il mio messaggio non si fosse perso — se è un
periodo intenso, mi dica pure con calma, nessun problema 🙂
```

### Follow-up 2 (ultimo messaggio) — Tedesco
```
Guten Tag [Name], das ist meine letzte Nachricht dazu, ich möchte nicht aufdringlich sein.
Falls Sie später doch Interesse haben, eine KI-Rezeptionistin für Ihre Praxis einzuführen,
melden Sie sich gerne. Alles Gute! 🌿
```
### Follow-up 2 — Italiano
```
Buongiorno [Nome], le scrivo un'ultima volta, non voglio essere invadente. Se in futuro vorrà
valutare una receptionist AI per lo studio, mi trova qui. Le auguro il meglio! 🌿
```

### Traccia telefonica — Tedesco (per chi chiama, non generata automaticamente)
```
Apertura: "Guten Tag, mein Name ist Enrieta Fontana von EnrietaBiz. Haben Sie kurz eine Minute?"
Motivo: "Wir helfen privaten Kliniken, keine Anrufe mehr zu verpassen — mit einer
KI-Rezeptionistin auf WhatsApp, die Termine direkt einträgt."
Proposta: "Hätten Sie Interesse an einem kurzen Gespräch von 15 Minuten, unverbindlich?"
Obiezione "Wir haben schon eine Rezeption" → "Genau deshalb — es ersetzt niemanden, es fängt
nur die Anrufe auf, die heute verloren gehen."
```
### Traccia telefonica — Italiano
```
Apertura: "Buongiorno, sono Enrieta Fontana di EnrietaBiz. Ha un minuto?"
Motivo: "Aiutiamo le cliniche private a non perdere più chiamate — con una receptionist AI su
WhatsApp che fissa gli appuntamenti da sola."
Proposta: "Le andrebbe una call di 15 minuti, senza impegno?"
Obiezione "Abbiamo già la reception" → "Proprio per questo — non sostituisce nessuno, recupera
solo le chiamate che oggi si perdono."
```

## STEP 3 — Implementazione (STOP dopo)
1. Aggiungi il segmento "cliniche" alla mappa segmenti (stesso pattern di Luxury/Velvet).
2. Aggiungi la selezione lingua (DE/IT) in base a paese/regione del lead — riusa un campo
   esistente, non inventarne uno nuovo se già c'è.
3. Il generatore di bozze/follow-up deve usare questi testi ESATTI (non riscriverli), scegliendo
   la lingua giusta. Placeholder [Name]/[Nome] va sostituito col nome del lead se disponibile,
   altrimenti "Guten Tag"/"Buongiorno" senza nome.
4. "Rigenera bozza" deve produrre questi testi per i lead del segmento cliniche.
5. Traccia telefonica: mettila SOLO come testo consultabile nella scheda lead (bottone "copia"),
   NON generarla/inviarla in automatico — è per chi chiama a mano.

## STEP 4 — Test (STOP dopo)
Genera una bozza per un lead clinica in Svizzera (deve uscire in tedesco) e uno in Italia (deve
uscire in italiano). Mostrami entrambe. STOP.

## NOTE
- Non toccare segmenti/lead già esistenti.
- Se serve una colonna nuova (es. `lingua_segmento`), proponila prima, additiva.
- Nessun invio automatico di massa: resta tutto dietro "rigenera bozza" / invio manuale come gli
  altri segmenti.
