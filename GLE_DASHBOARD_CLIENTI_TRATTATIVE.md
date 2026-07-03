# PROMPT — Dashboard GLE: Clienti attivi + Trattative aperte

> Da usare nella CHAT di Claude Code, nel progetto GlobalLead Engine. Conferma prima in quale cartella/progetto sei.
> ⚠️ Se stai ancora costruendo i follow-up o l'update outreach, FINISCILI prima di lanciare questo.

---

## Obiettivo
Aggiungere alla dashboard due schede che mostrano l'imbuto reale del business, con dati veri:
- **Clienti attivi** (persone/aziende con cui ho una collaborazione avviata)
- **Trattative aperte** (chi ha ricevuto una proposta/preventivo ma non ha ancora firmato/pagato)

Voglio che siano **record veri nel database** (non numeri scritti a mano nel codice), così il conteggio si aggiorna da solo quando aggiungo o sposto qualcuno.

## Struttura
Crea (o riusa se esistono) due entità collegate ai lead:
1. **Clienti** — campi: nome/azienda, servizio, stato = `attivo`, data inizio, note.
2. **Trattative (deals)** — campi: nome/azienda, servizio proposto, stato (`aperta` = proposta inviata / `da_firmare` = ha detto sì ma non ha pagato/firmato), valore stimato, data, note.

L'imbuto completo da rappresentare (da sinistra a destra):
**Conversazioni/Follow-up attivi → Trattative aperte → Da firmare → Clienti attivi**

## Dati reali da inserire (li confermo/completo io)
Clienti attivi (7) — collaborazioni reali già avviate. Inserisci questi e lasciami completare/correggere i dettagli:
- Unlimited Consulting
- Elisabetta Del Giudice
- Carmen Rizzi
- Carolina Marconi
- Brigitta Boccoli
- Vanessa Gaudenzi
- (7° cliente: lo aggiungo io)

Trattative aperte (2) — proposta/preventivo inviato, non ancora chiuso:
- Daniele (preventivo inviato)
- (2ª trattativa: la aggiungo io)

## Cosa deve mostrare la dashboard
- Card **"Clienti attivi"** con il numero (conteggio reale dei record `attivo`) → oggi 7
- Card **"Trattative aperte"** con il numero → oggi 2
- Idealmente anche le card già esistenti: conversazioni avviate, follow-up attivi, lead totali — così si vede l'imbuto completo.
- Poter cliccare una card e vedere l'elenco (i nomi), per gestirli.

## Importante
- I numeri devono venire SEMPRE dal conteggio reale dei record, mai hardcoded. Se sposto un lead da "trattativa" a "cliente", i due numeri si aggiornano da soli.
- Voglio poter **spostare** facilmente un contatto lungo l'imbuto (es. da trattativa aperta → da firmare → cliente attivo).

## Regola di avanzamento (rispettala)
Procedi a piccoli passi, fermandoti dopo ognuno e aspettando il mio "ok prosegui":
1. Mostrami se esistono già tabelle clienti/trattative o se vanno create. Proponi lo schema. STOP.
2. Crea le due entità e inserisci i record reali che ti ho dato. Mostrami l'elenco. STOP.
3. Aggiungi le due card alla dashboard con conteggio dinamico. Mostrami come si vede. STOP.
4. Aggiungi la possibilità di spostare un contatto lungo l'imbuto. Test. STOP.

## Nota
I numeri sono tutti reali (clienti e trattative esistono davvero). Non inserire mai dati inventati: se un record non c'è, non va contato.
