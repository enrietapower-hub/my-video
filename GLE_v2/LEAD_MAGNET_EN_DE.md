# LEAD MAGNET — Versione INGLESE + TEDESCO (doppione di /scansiona)

> ISTRUZIONI PER CLAUDE CODE.
> Progetto: **enrietabiz-site** (il sito Next.js con il dominio enrietabiz.com) —
> NON GrowthOS, NON lead-engine. Conferma in quale progetto sei prima di iniziare.
> Lavora su un **branch git** nuovo, mostrami le modifiche PRIMA di applicarle,
> e fermati a ogni STOP. **Niente deploy, niente invii** finché non confermo io.

## Obiettivo
Esiste già il lead magnet in italiano: la landing pubblica `/scansiona` + l'endpoint
`/api/scan` (scan "lite" Google Places + scoring + anteprima 5 lead mascherati + cattura
email, con modalità DEMO quando manca `GOOGLE_PLACES_API_KEY`).
Voglio lo **stesso identico lead magnet anche in INGLESE e in TEDESCO** — un doppione,
stessa grafica e stesso motore, solo testi tradotti.

---

## STEP 0 — Ricognizione (STOP dopo)
Prima di scrivere codice:
1. Trova e mostrami i file dell'attuale lead magnet italiano: la pagina `/scansiona`
   (es. `src/app/scansiona/page.tsx` e suoi componenti) e l'endpoint `src/app/api/scan/route.ts`.
2. Dimmi tutte le **stringhe di testo** mostrate all'utente (titolo/hero, etichette del form,
   bottone, testo dell'anteprima mascherata es. "Nessun sito web", messaggi di errore,
   nota GDPR/privacy, testo di conferma email).
3. Dimmi se `/api/scan` restituisce stringhe già pronte (es. i "segnali" tipo
   "Nessun sito web", "Poche recensioni") o solo codici/dati — così capiamo cosa va tradotto
   lato server.
Poi STOP e aspetta il mio ok.

---

## STEP 1 — Struttura URL (path-based) (STOP dopo)
Crea due nuove landing **identiche** all'italiana ma tradotte, con URL per lingua:
- `/en/scan`  → Inglese
- `/de/scan`  → Tedesco
(L'italiano resta com'è su `/scansiona`.)

Implementazione consigliata, scegli la più pulita per questo progetto e proponimela:
- **Opzione A (consigliata):** estrai la landing in un componente condiviso
  `ScanLanding({ lang, t })` dove `t` è un dizionario di stringhe, e crea 3 thin-page:
  `/scansiona` (it), `/en/scan` (en), `/de/scan` (de) che passano la lingua giusta.
  Così la grafica e la logica restano UNICHE: si tocca un punto solo in futuro.
- **Opzione B:** duplichi la cartella. Sconsigliata (codice triplicato, si disallinea).

Metti le traduzioni in un dizionario semplice, es. `src/app/scan/i18n.ts`:
```ts
export const SCAN_I18N = {
  it: { /* le stringhe attuali */ },
  en: { /* English */ },
  de: { /* Deutsch */ },
};
```
Mostrami la struttura dei file che creerai. STOP.

---

## STEP 2 — Traduzioni (STOP dopo)
Compila il dizionario `en` e `de` partendo dalle stringhe italiane trovate allo STEP 0.
Usa questi testi come base (adattali alle stringhe reali del progetto, non inventare campi
che non esistono):

### Inglese (en)
- Hero title: "Scan your area"
- Hero subtitle: "Discover in 10 seconds how many businesses near you are losing customers — and which ones you could win."
- Field "service": "What service do you offer?"
- Field "city": "Your city or area"
- Field "target": "What kind of businesses do you want to find?"
- Field "email": "Where should I send the full report?"
- Button: "Scan now"
- Loading: "Scanning your area…"
- Preview heading: "Top 5 opportunities near you"
- Masked signal "no website": "No website"
- Masked signal "few reviews": "Few reviews"
- Masked signal "no online booking": "No online booking"
- Email-gate note: "Enter your email to unlock the full list with names and contacts."
- Success: "Done! Check your inbox — your report is on its way."
- GDPR note: "We only use public business data. We'll email you the report; you can unsubscribe anytime."
- Error: "Something went wrong. Please try again in a moment."

### Tedesco (de)
- Hero title: "Scanne deine Region"
- Hero subtitle: "Finde in 10 Sekunden heraus, wie viele Unternehmen in deiner Nähe Kunden verlieren — und welche du gewinnen könntest."
- Field "service": "Welche Dienstleistung bietest du an?"
- Field "city": "Deine Stadt oder Region"
- Field "target": "Welche Art von Unternehmen möchtest du finden?"
- Field "email": "Wohin soll ich den vollständigen Report senden?"
- Button: "Jetzt scannen"
- Loading: "Deine Region wird gescannt…"
- Preview heading: "Top 5 Chancen in deiner Nähe"
- Masked signal "no website": "Keine Website"
- Masked signal "few reviews": "Wenige Bewertungen"
- Masked signal "no online booking": "Keine Online-Buchung"
- Email-gate note: "Gib deine E-Mail ein, um die vollständige Liste mit Namen und Kontakten freizuschalten."
- Success: "Fertig! Schau in dein Postfach — dein Report ist unterwegs."
- GDPR note: "Wir verwenden nur öffentliche Unternehmensdaten. Wir senden dir den Report per E-Mail; du kannst dich jederzeit abmelden."
- Error: "Etwas ist schiefgelaufen. Bitte versuche es gleich noch einmal."

Mostrami il dizionario completo (it/en/de) così controllo le traduzioni. STOP.

---

## STEP 3 — Endpoint /api/scan multilingua (STOP dopo)
NON duplicare il motore. Aggiungi un parametro `lang` ("it" | "en" | "de", default "it")
alla chiamata `/api/scan`:
1. La landing passa `lang` nel body insieme a service/city/target/email.
2. Se l'endpoint genera stringhe visibili (es. i "segnali" mascherati "Nessun sito web"),
   spostale in un dizionario server-side e restituiscile nella lingua richiesta.
   Se invece l'endpoint restituisce solo dati/flag e le stringhe le costruisce la pagina,
   allora basta tradurre lato client (più semplice) — dimmi tu quale dei due casi è.
3. **DEMO mode** deve continuare a funzionare identico in tutte le lingue
   (stessi risultati deterministici quando manca `GOOGLE_PLACES_API_KEY`).
4. Salva comunque l'iscritto nella stessa tabella subscribers, aggiungendo se utile una
   colonna `lang` (additiva, `default 'it'`) per sapere in che lingua si è iscritto.
Mostrami le modifiche all'endpoint. STOP.

---

## STEP 4 — Sicurezza (invariata)
Mantieni lo stesso modello dell'italiano:
- La `SUPABASE_SERVICE_ROLE_KEY` resta **solo lato server** (mai `NEXT_PUBLIC`, mai nel client).
- Nessuna nuova query sensibile dal browser.
- Nessuna chiave nel codice. Non toccare RLS in questo task.

---

## STEP 5 — Test in locale (STOP dopo)
- Apri `/en/scan` e `/de/scan`: la grafica deve essere identica all'italiana, testi tradotti.
- Fai una scan di prova in DEMO su una **combinazione città+categoria NUOVA**
  (la cache 24h potrebbe restituire un vecchio risultato per combo già usate).
- Verifica che l'email di prova venga salvata con la lingua giusta.
- NON fare invii reali di massa, NON deployare.
Mostrami gli screenshot/output del test. STOP.

---

## Note finali
- Italiano invariato: `/scansiona` deve continuare a funzionare esattamente come ora.
- Link utili da riusare se servono (footer/condivisione): l'italiano è enrietabiz.com/scansiona;
  i nuovi saranno enrietabiz.com/en/scan ed enrietabiz.com/de/scan.
- Quando tutto è testato in locale e approvato, ti dirò io quando fare il deploy
  (ricordati: su Netlify serve "Clear cache and deploy" e le env var, come per l'italiano).
