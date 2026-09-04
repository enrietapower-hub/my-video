# PROMPT per Claude Code — Aggiornamento sistema Outreach GLE

> ⭐ VERIFICA PRIMA DI RILANCIARE — dati reali dal database suggeriscono che gran parte di questo
> sia già stata implementata. I messaggi recenti sono già corti/umani (coerenti con TASK 2/5,
> es. "questo è l'ultimo messaggio da parte mia, promesso 🙂"), la colonna `dettaglio_personale`
> esiste già (TASK 3B-bis). Trovati inoltre **40 messaggi** con testo verbatim del segmento
> Cliniche ("receptionist AI" / "KI-Rezeptionistin") — prima di toccare qualsiasi cosa, capisci
> se il segmento Cliniche (oggetto di GLE_SEGMENTO_CLINICHE.md, ancora in coda come "da
> lanciare") in realtà esiste già parzialmente, per non duplicarlo o romperlo.
> Da usare dentro il repo di **GlobalLead Engine** (app.enrietabiz.com), NON in questo repo.
> Trascina questo file dentro Claude Code e scrivi: "Leggi GLE_OUTREACH_UPDATE.md e segui le istruzioni".

---

## STEP 0 — Verifica cosa è già fatto (STOP dopo, riportami prima di procedere)
Prima di leggere il resto del prompt sotto come una lista di cose da costruire da zero, controlla
il codice e riportami, TASK per TASK:
1. **TASK 1 (firma dinamica)**: esiste già la mappa mittente→firma/presentazione per
   Enrieta/EnrietaGmail vs Desy/Sara?
2. **TASK 2 (copy corto)**: il template di generazione usa già la struttura corta a 5-6 righe, o
   i messaggi corti che ho visto nel database sono stati scritti/modificati a mano?
3. **TASK 3/3B (gancio sul gap + segmento Luxury)**: esiste la priorità no-booking > sito
   vecchio > IG > fallback? Il segmento Luxury con doppia offerta esiste?
4. **TASK 3B-bis (dettaglio_personale)**: la colonna esiste (confermato), ma è collegata al
   generatore di bozze e al bottone "rigenera bozza"? Se vuota, conferma che il default resta
   quello generico senza inventare nulla.
5. **Il mistero dei 40 messaggi "receptionist AI"**: da dove arrivano? È già attivo un segmento
   Cliniche (anche parziale/informale) prima che io lanciassi GLE_SEGMENTO_CLINICHE.md?
6. **TASK 4 (rigenerazione in blocco)**, **TASK 5B (cabina senza reload)**, **TASK 6 (Velvet)**:
   stato di ciascuno.

Solo per i TASK che risultano DAVVERO mancanti o incompleti, procedi con le istruzioni originali
sotto — non riscrivere/sovrascrivere quello che già funziona.

## CONTESTO
Sei dentro il codice di GlobalLead Engine (GLE). Il sistema genera bozze di email di outreach per lead qualificati, assegnati a 4 "corsie" mittente: Enrieta, EnrietaGmail, Desy, Sara. Ogni lead ha un punteggio (score) e uno o più gap rilevati (es. sito vecchio, no booking, IG, Enagic).

Dobbiamo cambiare come vengono scritte le bozze. Le mail attuali sono troppo lunghe e "vendono" troppo presto → 111 contattati, 0 risposte. Passiamo a un copy corto, umano, personalizzato sul gap, con firma corretta per chi manda.

Prima di scrivere codice: ispeziona il repo e dimmi (a) dove e come vengono generate le bozze di outreach (funzione/template/prompt), (b) dove sono salvate (tabella Supabase e colonne), (c) come funziona il bottone "rigenera bozza", (d) dove sono i template dei follow-up. Poi procedi.

---

## TASK 1 — Firma dinamica per corsia mittente
La bozza deve usare la firma di CHI ha il lead assegnato (campo tipo `assegnato_a` / `owner`). Mapping:

- **Enrieta** → prima persona, come fondatrice. Firma: `Enrieta Fontana — EnrietaBiz`
- **EnrietaGmail** → stessa persona (Enrieta), stessa firma. Vedi NOTA in fondo. Firma: `Enrieta Fontana — EnrietaBiz`
- **Desy** → scrive come team, NON come fondatrice. Firma: `Desy — Team EnrietaBiz`
- **Sara** → scrive come team, NON come fondatrice. Firma: `Sara — Team EnrietaBiz`

Importante: il CORPO cambia in base al mittente, non solo la firma:
- Se mittente = Enrieta o EnrietaGmail → il testo può dire "Sono Enrieta, fondatrice di EnrietaBiz…" o restare in prima persona.
- Se mittente = Desy o Sara → NON deve mai dire "sono la fondatrice". Deve dire che scrive dal team, es. "lavoro con Enrieta Fontana di EnrietaBiz". Rendi questa sostituzione automatica e coerente.

Rendi le firme e le frasi di presentazione dei valori configurabili (un piccolo oggetto/config in cima), così si modificano senza toccare la logica.

---

## TASK 2 — Nuovo copy base (corto, umano)
Sostituisci il template lungo attuale con questa struttura. Regola: la mail a freddo NON vende, ottiene solo una risposta. Max 5-6 righe. Niente link nella prima mail. Una sola CTA.

Struttura del corpo (con placeholder da riempire dai dati del lead):

```
Ciao {nome_referente_o_attivita},

{GANCIO_GAP}

{FRASE_PRESENTAZIONE_SECONDO_MITTENTE} Aiuto attività come la vostra a sistemare
esattamente questo, senza rincorrere nessuno.

Vi va una call di 15 minuti per capire se ha senso? Basta un "sì".
Se non è cosa, ditemelo e non vi scrivo più.

{FIRMA_SECONDO_MITTENTE}
```

Dove `{FRASE_PRESENTAZIONE_SECONDO_MITTENTE}`:
- Enrieta/EnrietaGmail → "Sono Enrieta, fondatrice di EnrietaBiz."
- Desy/Sara → "Lavoro con Enrieta Fontana di EnrietaBiz."

---

## TASK 3 — Gancio personalizzato sul GAP principale
Ogni lead ha uno o più gap. Scegli il gap principale con questa priorità (dal più "doloroso" al meno):

1. **no booking** (non si può prenotare online) — priorità massima, pain più forte per centri estetici, nutrizionisti, cliniche
2. **sito vecchio**
3. **IG** (attivo su Instagram ma sito debole) — usalo come gancio positivo
4. **fallback** generico se nessun gap chiaro

Frasi gancio `{GANCIO_GAP}` in base al gap principale:

- **no booking:** "Ho visto che sul vostro sito non si può prenotare online: chi vorrebbe fissare un appuntamento deve chiamare o scrivere, e diversi si perdono lì."
- **sito vecchio:** "Ho dato un'occhiata al vostro sito e sembra fermo da un po', soprattutto rispetto a quanto siete attivi altrove."
- **IG (attivo su IG, sito debole):** "Vi seguo su Instagram e il profilo è curato. Poi sono andata sul sito e non è allo stesso livello."
- **fallback:** "Ho dato un'occhiata alla vostra presenza online e credo si possa migliorare in un paio di punti concreti."

Se un lead ha PIÙ gap, usa solo il gancio del gap a priorità più alta (una mail = un messaggio). Non elencare tutti i gap.

**Gestione segmenti speciali (importante):**
- **Enagic** → STAND-BY. Escludilo dal flusso outreach standard. Non generare bozze "web/restyling". Lasciali in archivio taggati, pronti per un futuro flusso dedicato (dispositivo acqua, obiettivo = lead per loro, non sito). Segnalami come è gestito oggi.
- **Luxury** → ATTIVO, ma con flusso dedicato (TASK 3B). NON usare i ganci standard. Instrada i lead Luxury sul template del TASK 3B.
- **Tutti gli altri** (centro estetico, nutrizionista, ecc.) → flusso standard di questo TASK 3.

---

## TASK 3B — Segmento LUXURY (copy + doppia offerta)
I lead Luxury (agenzie immobiliari di lusso, ville, servizi premium) sono clienti ATTIVI, ma vanno trattati diversamente. Due differenze chiave:

**1. Doppia offerta.** Al luxury non vendi solo il sito. Vendi due cose:
- Un sito / web app premium all'altezza del loro posizionamento
- GLE stesso come motore di lead (come lo usi tu): trovargli clienti/acquirenti in automatico

Nella prima mail accennale entrambe in una riga, senza spiegare. Si vende in call.

**2. Tono premium.** Non "vi sistemo il sito". Piuttosto: "il vostro posizionamento online non è all'altezza del vostro portfolio".

Template LUXURY (corto):
```
Oggetto: {nome}, il vostro sito e il vostro portfolio

Gentile team di {nome},

{GANCIO_LUXURY}

Sono Enrieta Fontana, di EnrietaBiz. Con realtà premium come la vostra lavoro
su due fronti: un sito all'altezza del vostro posizionamento, e un motore che
vi porta richieste qualificate in automatico, senza gestione manuale.

15 minuti in call per mostrarvi come funzionerebbe per voi? Basta un "sì".

{FIRMA_SECONDO_MITTENTE}
```

`{GANCIO_LUXURY}` di default (senza dettaglio personale): "Il vostro portfolio è di alto livello, ma il sito attuale non lo comunica allo stesso modo — e senza un canale di contatto rapido online, ogni richiesta passa da gestione manuale."

---

## TASK 3B-bis — Semi-personalizzazione con dettaglio REALE (solo lead alto valore)
Per i lead Luxury (e in generale i lead top che il setter lavora a mano), aggiungi un campo opzionale sul dettaglio lead: `dettaglio_personale` (testo libero).

Regole:
- Se il campo è vuoto → usa il gancio di default. MAI inventare dettagli.
- Se il campo è compilato dal setter (es. "12k follower su IG", "villa a Portofino nel portfolio") → usa quel dettaglio nel gancio:
  "Vi seguo su Instagram: {dettaglio_personale}. Presenza forte, ma sul sito quella qualità non si traduce in richieste concrete."

**REGOLA ANTI-INVENZIONE (critica):** il modello NON deve mai generare da solo numeri di follower, nomi di post, foto o dettagli specifici del profilo. Solo il testo che il setter ha scritto a mano nel campo `dettaglio_personale` può finire nel gancio. Se vuoto, default e basta. Questo evita di mandare "ho adorato il vostro post su X" quando X non esiste.

Flusso operativo: GLE segnala il lead luxury → il setter apre il profilo, sceglie UN dettaglio vero, lo incolla in `dettaglio_personale` → clicca "rigenera bozza" → la mail esce personalizzata. Semi-automatico, con occhio umano.

---

## TASK 4 — Strategia di aggiornamento SICURA
Non sovrascrivere in massa le bozze già esistenti. Fai così:
1. Aggiorna la funzione/template di generazione così che TUTTE le bozze nuove e rigenerate usino la nuova logica (Task 1-2-3).
2. Bottone "rigenera bozza": rigenera con la nuova versione e la sostituisce. Meccanismo di attivazione on-demand.
3. Rigenerazione in blocco (batch) — FALLA, ma con questi paletti obbligatori. Aggiungi un'azione "Rigenera bozze non inviate":
   - Solo bozze NON ancora inviate. Mai toccare mail già partite.
   - Escludi le bozze personalizzate a mano (campo `dettaglio_personale` compilato o flag "modificata manualmente").
   - Escludi i segmenti Luxury e Velvet dal blocco: si rigenerano singolarmente.
   - Batch di prova prima: la prima esecuzione rigenera solo 20 bozze e si ferma. Solo dopo conferma esplicita, procede sul resto.
   - Conferma esplicita richiesta prima di ogni esecuzione (mostra quante bozze e quali segmenti esclusi).

Requisito: non rompere la pipeline esistente (Supabase, assegnazioni, stati lead, tracciamento). Se un cambiamento tocca colonne o stati, spiegami prima cosa cambi.

---

## TASK 5 — Follow-up corti
Aggiorna i template di follow-up con la stessa filosofia (corti, umani):
- **Follow-up 1** (dopo qualche giorno di silenzio): "Ciao {nome}, faccio un salto su questa: vi torna utile o lascio perdere? 🙂 {firma}"
- **Follow-up 2** (ultimo tentativo): "Ciao {nome}, ultimo messaggio da parte mia. Se in futuro volete dare una svecchiata alla presenza online, sapete dove trovarmi. Buon lavoro! {firma}"

Firma dinamica per mittente (Task 1). Nessun link.

---

## TASK 5B — Modalità "cabina" continua (flusso veloce)
Problema attuale: quando il setter manda una mail e clicca "inviata", la schermata chiude il lead e ne riapre un altro con un reload. Rallenta. Va reso continuo, senza ricaricare la pagina.

Comportamento desiderato (rifinisci la CABINA SETTERS esistente, non ricostruirla):
- **Nessun reload** tra un lead e l'altro. Pannello unico fisso. Stato aggiornato in locale (ottimistico) + sync Supabase in background.
- **Avanzamento automatico:** al clic "inviata"/"scarta"/"ricontatta", il lead si marca, scorre via, e compare SUBITO il prossimo. Niente schermata vuota.
- **Scorciatoie da tastiera:** Invio o barra = "inviata → prossimo"; un tasto per "scarta", uno per "da ricontattare" (mostra una piccola legenda).
- **Contatore di sessione:** "X inviate oggi".
- **Robustezza:** se la sync fallisce, avviso + non perdere lo stato (retry). Mai marcare "inviata" senza conferma del salvataggio.

Obiettivo: lavorare 30-40 lead di fila senza mai aspettare un caricamento. Se l'architettura attuale impedisce il "no reload", spiegami cosa e proponi l'alternativa più vicina.

---

## TASK 6 — Verifica e sistemazione outreach Velvet Studio
Velvet Studio AI è un prodotto DIVERSO: content studio done-for-you, target coach/creator/brand, tono premium e "desiderio", possibile inglese. Il filtro "Velvet" esiste già nella UI dei lead.

In ordine:
1. **Verifica:** esiste già un template/flusso di outreach dedicato ai lead Velvet, o quei lead usano il copy generico EnrietaBiz (sbagliato)?
2. **Riportami lo stato** prima di cambiare: dove sta, com'è scritto ora, in che lingua.
3. Se esiste ed è attivo: proponimi UNA versione corta adattata al tono Velvet (premium, orientata al risultato/desiderio). Aspetta la mia conferma prima di sostituire.
4. Se NON esiste: dimmelo e basta. NON crearlo ora.

Non applicare a Velvet i ganci "web/restyling" del TASK 3.

---

## NOTA QUALITÀ DATI (segnala, non bloccare)
Ho notato bozze su lead come "poltronesofà Crema" (catena nazionale di divani) con gancio "prenotazioni senza inseguire nessuno". Il gancio non c'entra → probabile lead mal categorizzato dallo scanner. Dimmi se lo scanner sta assegnando categoria/gap/servizio in modo affidabile, o se conviene un controllo sui lead dove categoria e gap non combaciano.

---

## COSA RIPORTARMI ALLA FINE
- Dove hai trovato la generazione bozze + i follow-up (file/funzione)
- Cosa hai cambiato esattamente (Task 1-2-3)
- Segmenti: conferma che Enagic è escluso (stand-by) e che Luxury usa il flusso dedicato (Task 3B)
- Semi-personalizzazione: conferma che `dettaglio_personale` esiste, che se vuoto NON inventa nulla, e che "rigenera bozza" lo usa (Task 3B-bis)
- Come si attiva la nuova versione (conferma che "rigenera bozza" produce il nuovo copy per standard E luxury)
- Rigenerazione in blocco: conferma paletti (solo non inviate, esclude personalizzate a mano + Luxury + Velvet, batch di prova da 20)
- Modalità cabina (Task 5B): conferma no-reload + avanzamento automatico + scorciatoie
- Stato dell'outreach Velvet (Task 6)
- Nota qualità dati: lo scanner assegna categoria/gap in modo affidabile?
- Qualsiasi cosa che tocca lo schema Supabase, spiegata PRIMA di applicarla in produzione

---

## NOTA (per Enrieta, non per Claude Code)
La corsia EnrietaGmail invia da un account Gmail gratuito: è la più debole per la consegna a freddo (limiti di volume, nessuna reputazione di dominio). Valuta di spostare quei lead sulle corsie che partono da enrietabiz.com. Scelta tua.
