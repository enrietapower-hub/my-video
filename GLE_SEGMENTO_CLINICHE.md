# GLE — Nuovo segmento "Cliniche private" (DE/IT)

> Da usare in Claude Code dentro il progetto GlobalLead Engine. Conferma in quale progetto sei.
> Bug/feature additiva: non toccare i segmenti esistenti (Enagic, Luxury, Velvet). STOP dopo ogni step.

## OBIETTIVO
Aggiungere un nuovo segmento **"Cliniche private"** con **3 sotto-categorie** (ognuna con il suo
gancio specifico, perché il dolore reale è diverso):
- **Dentale/medico generico** — dolore: chiamate perse fuori orario
- **Fisioterapia** — dolore: richieste e spostamenti di appuntamenti ricorrenti che si perdono
- **Estetica/Dermatologia** — dolore: clienti che scrivono la sera/weekend e non ricevono risposta

Outreach WhatsApp/telefono in **tedesco** per i lead in Svizzera (Zurigo, Lucerna, zona
germanofona) e in **italiano** per i lead in Italia — lingua scelta in automatico dal paese/zona
del lead (colonna `paese` o `regione` già esistente).

## STEP 1 — Ricognizione (STOP dopo)
Trova dove sono definiti i segmenti esistenti (Enagic, Luxury, Velvet) e la mappa
mittente→firma/presentazione (da GLE_FIX_DANIELA_CRISTINA.md / GLE_OUTREACH_UPDATE.md se già
applicati). Dimmi dove si aggiunge un nuovo segmento e come si assegna un lead a un segmento, e se
i segmenti esistenti supportano già sotto-categorie o vanno modellate come segmenti separati.

## STEP 2 — Segmento "Cliniche private" con 3 sotto-categorie (STOP dopo)
Criterio di assegnazione per sotto-categoria (dalla categoria/keyword del lead):
- **dentale_medico**: studio medico / clinica / poliambulatorio / dentista / Arztpraxis / Zahnarzt
- **fisioterapia**: fisioterapista / Physiotherapie / Physio
- **estetica**: estetica / dermatologia / medicina estetica / Dermatologie / ästhetische Medizin

Lingua del messaggio (uguale per tutte le sotto-categorie):
- **paese/regione = Svizzera, Zurigo, Lucerna** (o cantoni germanofoni) → **tedesco**
- **paese/regione = Italia** → **italiano**
- altrimenti → fallback italiano

---

## Sotto-categoria: Dentale / Medico generico

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

---

## Sotto-categoria: Fisioterapia

### Script WhatsApp / primo contatto — Tedesco
```
Guten Tag [Name], mein Name ist Enrieta Fontana von EnrietaBiz.
Mir ist aufgefallen, dass Physiotherapie-Praxen oft viele Terminanfragen und Terminverschiebungen
gleichzeitig verwalten müssen — und wenn die Rezeption gerade mit einem Patienten beschäftigt
ist, geht die Anfrage oft verloren.
Wir haben eine KI-Rezeptionistin entwickelt, die Anfragen über WhatsApp entgegennimmt, Termine
direkt einträgt und auch Terminverschiebungen selbstständig regelt — rund um die Uhr.
Hätten Sie Interesse an einem kurzen, unverbindlichen Gespräch von 15 Minuten?
```

### Script WhatsApp / primo contatto — Italiano
```
Buongiorno [Nome], sono Enrieta Fontana di EnrietaBiz.
Ho notato che gli studi di fisioterapia gestiscono spesso tantissime richieste e spostamenti di
appuntamenti insieme — e se la reception è occupata con un paziente, la richiesta va persa.
Abbiamo sviluppato una receptionist AI che risponde su WhatsApp, fissa gli appuntamenti e gestisce
da sola anche gli spostamenti — 24 ore su 24.
Le andrebbe una call di 15 minuti, senza impegno?
```

### Traccia telefonica — Tedesco
```
Motivo: "Wir helfen Physio-Praxen, keine Terminanfragen mehr zu verpassen — auch wenn Sie gerade
mit einem Patienten beschäftigt sind."
Obiezione "Wir haben schon viele Stammpatienten" → "Genau deshalb — bei so vielen wiederkehrenden
Terminen hilft es, wenn Anfragen und Verschiebungen automatisch erfasst werden, ohne dass etwas
verloren geht."
```
### Traccia telefonica — Italiano
```
Motivo: "Aiutiamo gli studi di fisioterapia a non perdere più richieste di appuntamento — anche
quando siete impegnati con un paziente."
Obiezione "Abbiamo già tanti pazienti fissi" → "Proprio per questo — con così tanti appuntamenti
ricorrenti, aiuta avere richieste e spostamenti gestiti in automatico, senza che nulla si perda."
```

---

## Sotto-categoria: Estetica / Dermatologia

### Script WhatsApp / primo contatto — Tedesco
```
Guten Tag [Name], mein Name ist Enrieta Fontana von EnrietaBiz.
Mir ist aufgefallen, dass Patientinnen und Patienten bei ästhetischen Behandlungen oft abends
oder am Wochenende schreiben, wenn sie gerade Zeit haben — und wenn die Praxis dann nicht
antwortet, wenden sie sich oft an eine andere Klinik.
Wir haben eine KI-Rezeptionistin entwickelt, die auf WhatsApp rund um die Uhr antwortet, Fragen
zu Behandlungen beantwortet und Termine direkt einträgt.
Hätten Sie Interesse an einem kurzen, unverbindlichen Gespräch von 15 Minuten?
```

### Script WhatsApp / primo contatto — Italiano
```
Buongiorno [Nome], sono Enrieta Fontana di EnrietaBiz.
Ho notato che nei trattamenti estetici le clienti spesso scrivono la sera o nel weekend, quando
hanno un momento libero — e se lo studio non risponde subito, si rivolgono altrove.
Abbiamo sviluppato una receptionist AI che risponde su WhatsApp 24 ore su 24, risponde alle
domande sui trattamenti e fissa gli appuntamenti direttamente in agenda.
Le andrebbe una call di 15 minuti, senza impegno?
```

### Traccia telefonica — Tedesco
```
Motivo: "Wir helfen ästhetischen Praxen, keine Anfragen mehr zu verpassen — gerade abends und am
Wochenende, wenn Patientinnen am meisten schreiben."
Obiezione "Unsere Behandlungen erklären wir lieber persönlich" → "Verstehe ich völlig — die KI
übernimmt nur die ersten Fragen und die Terminvereinbarung, das persönliche Gespräch bleibt bei
Ihnen."
```
### Traccia telefonica — Italiano
```
Motivo: "Aiutiamo gli studi estetici a non perdere più richieste — soprattutto la sera e nel
weekend, quando le clienti scrivono di più."
Obiezione "Preferiamo spiegare i trattamenti di persona" → "Capisco perfettamente — l'AI gestisce
solo le prime domande e la prenotazione, il colloquio personale resta sempre vostro."
```

---

## Follow-up (identici per tutte e 3 le sotto-categorie)

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

## STEP 3 — Implementazione (STOP dopo)
1. Aggiungi il segmento "cliniche" con le sue 3 sotto-categorie (dentale_medico, fisioterapia,
   estetica) alla mappa segmenti, stesso pattern di Luxury/Velvet.
2. Aggiungi la selezione lingua (DE/IT) in base a paese/regione del lead — riusa un campo
   esistente, non inventarne uno nuovo se già c'è.
3. Il generatore di bozze deve usare i testi ESATTI della sotto-categoria giusta (non riscriverli
   né mischiarli tra sotto-categorie), scegliendo anche la lingua giusta. Placeholder
   [Name]/[Nome] va sostituito col nome del lead se disponibile, altrimenti "Guten
   Tag"/"Buongiorno" senza nome.
4. Follow-up 1 e 2 sono UNICI e condivisi da tutte e 3 le sotto-categorie (non serve
   differenziarli).
5. "Rigenera bozza" deve produrre questi testi per i lead del segmento cliniche, in base alla
   sotto-categoria assegnata.
6. Traccia telefonica: mettila SOLO come testo consultabile nella scheda lead (bottone "copia"),
   NON generarla/inviarla in automatico — è per chi chiama a mano.

## STEP 4 — Test (STOP dopo)
Genera 6 bozze di prova: per ciascuna delle 3 sotto-categorie (dentale_medico, fisioterapia,
estetica), un lead in Svizzera (deve uscire in tedesco) e un lead in Italia (deve uscire in
italiano). Mostrami tutte e 6. STOP.

## NOTE
- Non toccare segmenti/lead già esistenti.
- Se serve una colonna nuova (es. `lingua_segmento`), proponila prima, additiva.
- Nessun invio automatico di massa: resta tutto dietro "rigenera bozza" / invio manuale come gli
  altri segmenti.
