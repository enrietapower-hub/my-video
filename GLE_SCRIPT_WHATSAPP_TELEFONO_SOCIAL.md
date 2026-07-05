# PROMPT — Script WhatsApp, Telefonata e Contatto Social per le setter

> Da usare in Claude Code dentro il progetto **GlobalLead Engine**, DOPO aver completato
> il gruppo Telegram setter (GLE_TELEGRAM_GRUPPO_SETTER.md).
> Procedi a piccoli passi, STOP dopo ogni step. I testi qui sotto sono BOZZE approvate
> da Enrieta: usali così, non riscriverli di tua iniziativa.

---

## CONTESTO
Le setter Daniela e Cristina lavorano i lead del topic "Lead da chiamare / WhatsApp"
(telefonate e WhatsApp) e all'occorrenza il contatto social (Instagram DM).
Servono script pronti, personalizzati sul GAP del lead (stessa logica delle email:
no booking > sito vecchio > IG attivo > fallback) e con la presentazione da TEAM
("Lavoro con Enrieta Fontana di EnrietaBiz" — mai "sono la fondatrice").

Gli script devono comparire:
1. **Nel messaggio Telegram del lead** (topic 9): il testo WhatsApp già pronto dentro il
   link wa.me, così la setter clicca e trova il messaggio precompilato.
2. **Nella scheda lead / cabina**: sezione "Script" con le 3 varianti (WhatsApp, telefono,
   social) già compilate con i dati del lead, con bottone "copia".

---

## STEP 1 — Ricognizione (STOP dopo)
Dimmi dove oggi vengono generati i testi per WhatsApp (il link wa.me esiste già?) e se
esiste una sezione script nella scheda lead. Poi STOP.

## STEP 2 — I testi (implementali come template con placeholder)

Placeholder: {nome} = nome attività o referente, {setter} = Daniela/Cristina,
{GANCIO} = frase gancio in base al gap principale (stessa priorità delle email).

### A) SCRIPT WHATSAPP (primo messaggio — corto, no link, una domanda)

Ganci {GANCIO} per WhatsApp:
- no booking: "ho visto che dal vostro sito non si può prenotare online — chi vuole un appuntamento deve chiamare, e qualcuno si perde per strada"
- sito vecchio: "ho dato un'occhiata al vostro sito e sembra fermo da un po', rispetto a quanto siete attivi altrove"
- IG attivo: "vi seguo su Instagram, profilo curato! Poi sono andata sul sito e non è allo stesso livello"
- fallback: "ho dato un'occhiata alla vostra presenza online e ci sono un paio di punti che si possono migliorare"

Template:
```
Ciao! Sono {setter}, lavoro con Enrieta Fontana di EnrietaBiz 🙂
Vi scrivo perché {GANCIO}.
Aiutiamo attività come la vostra a sistemare esattamente questo.
Vi va una chiamata veloce di 10 minuti per capire se ha senso? Basta un "sì".
Se non vi interessa, ditemelo pure e non vi disturbo più!
```

Regole: MAX questo. Niente listini, niente link nel primo messaggio, un solo messaggio
(non raffiche). Se risponde → la setter prosegue a mano.

### B) SCRIPT TELEFONATA (traccia, non copione rigido)

```
APERTURA
"Buongiorno! Sono {setter}, la chiamo per conto di Enrieta Fontana di EnrietaBiz.
Ha un minuto? Le dico subito il motivo, così non le faccio perdere tempo."

MOTIVO (usa il gancio del gap)
- no booking: "Abbiamo visto che dal vostro sito non si può prenotare online:
  chi vuole un appuntamento deve chiamare, e spesso qualcuno si perde.
  Noi sistemiamo esattamente questo."
- sito vecchio: "Abbiamo visto il vostro sito e sembra fermo da un po',
  soprattutto rispetto a quanto siete bravi e attivi altrove."
- IG attivo: "Vi seguiamo su Instagram, il profilo è molto curato — ma il sito
  non è allo stesso livello, e lì si perdono richieste."

PROPOSTA (una sola)
"Le andrebbe una videochiamata di 15 minuti con Enrieta, senza impegno,
per vedere se ha senso per voi? Anche la settimana prossima."

SE DICE SÌ → prendi giorno/ora (o manda il link Calendly via WhatsApp) e segna sul lead.
SE DICE NO → "Nessun problema, grazie del tempo! Le lascio solo il nostro contatto
se in futuro vi serve." → segna esito "non interessato".
SE "MANDATEMI INFO" → "Certo! Le mando due righe su WhatsApp/email, così vede di
cosa parliamo." → segna esito "inviare info".

OBIEZIONI RAPIDE
- "Quanto costa?" → "Dipende da cosa serve davvero: per questo la call è gratuita
  e senza impegno — 15 minuti e sa se e cosa le conviene."
- "Ho già chi mi segue il sito" → "Perfetto, non vogliamo sostituire nessuno:
  guardiamo solo se vi sfuggono richieste. Se è tutto a posto, glielo diciamo."
```

### C) SCRIPT SOCIAL (Instagram DM — solo lead con profilo IG attivo)

```
Ciao! 🙂 Vi seguo da un po' e il profilo è davvero curato.
Sono {setter}, lavoro con Enrieta Fontana di EnrietaBiz.
Vi scrivo perché il sito non rende quanto il profilo — e di solito è lì che si
perdono le richieste. Vi va una chiamata veloce per vedere se possiamo aiutarvi?
Se no, nessun problema, continuo a seguirvi volentieri!
```

Regola anti-invenzione (VALE ANCHE QUI): mai citare post/numeri specifici del profilo
a meno che il campo dettaglio_personale sia compilato a mano dal setter. Se compilato:
"Ho visto {dettaglio_personale} — davvero notevole." al posto della prima riga.

STOP: mostrami i template implementati e un'anteprima compilata su 2 lead reali.

## STEP 3 — Integrazione (STOP dopo)
1. Topic 9 Telegram: il link wa.me deve contenere lo script A già compilato col gancio
   giusto per quel lead.
2. Scheda lead / cabina: sezione "Script" con le 3 varianti compilate + bottone copia
   per ciascuna. La telefonata (B) si mostra come traccia leggibile.
3. Esiti chiamata: se non esiste, aggiungi al lead un campo esito_chiamata
   (interessato / non_interessato / inviare_info / non_risponde / richiamare) +
   data richiamo opzionale. Solo colonne additive, dimmi prima cosa aggiungi. STOP.

## STEP 4 — Test (STOP dopo)
Prova su 2-3 lead reali (SENZA inviare niente): controlla che gancio, nome setter e
telefono siano giusti, che il wa.me apra il messaggio precompilato, che il copia funzioni.
STOP: controlla Enrieta e dà l'ok.

---

## NOTE
- Tono: informale-professionale, "voi" verso l'attività, frasi corte.
- Le setter possono adattare a voce/a mano: gli script sono una base, non una gabbia.
- Nessun invio automatico: WhatsApp e social partono SEMPRE a mano dalla setter.
