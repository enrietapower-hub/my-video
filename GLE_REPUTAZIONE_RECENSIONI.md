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
Non so cosa facciano: se sono uno scaffolding mai completato, un modulo attivo ma dimenticato, o un
esperimento per un prodotto diverso da GLE/EnrietaBiz. Vanno capiti prima di decidere se e come
usarli — non presumere nulla sul loro scopo.

## STEP 1 — Cosa sono davvero (STOP dopo, riportami tutto prima di procedere)
Rispondi punto per punto:

1. **Schema**: mostrami le colonne di ciascuna delle 5 tabelle e quante righe hanno oggi (anche 0).
2. **Codice**: cerca nel codebase dove vengono lette/scritte queste tabelle. Sono collegate a un
   endpoint, una pagina, un cron job, o non sono referenziate da nessuna parte (codice morto)?
3. **Scopo**: se trovi codice attivo, capisci a cosa serve — es. monitorare le recensioni Google/
   Facebook dei LEAD (per arricchire l'audit/outreach), oppure delle attività GIÀ CLIENTI di
   EnrietaBiz (per un servizio di reputation management separato), oppure qualcos'altro?
4. **Collegamento con `leads`**: la tabella `leads` ha già `num_recensioni` e `rating` (statici, un
   solo snapshot). Il sistema `reputation_*` fa qualcosa di più (storico nel tempo, testo delle
   recensioni analizzato, alert su calo rating)? Se sì, cosa esattamente.
5. **Stato**: il sistema risulta completo e funzionante, a metà, o abbandonato? Se c'è un motivo
   noto per cui è stato interrotto (nel codice, commit, commenti), riportalo.

Non proporre nulla allo STEP 2 finché non hai risposto a queste 5 domande con dati reali.

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
