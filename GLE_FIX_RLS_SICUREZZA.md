# GLE — Fix sicurezza: attivare RLS su 20 tabelle esposte

> Da usare in Claude Code dentro il progetto GlobalLead Engine (VPS). Conferma in quale progetto
> sei. Azione su database di PRODUZIONE con dati reali (15.837 lead) — procedi con cautela,
> STOP dopo ogni step, testa prima di andare avanti.

## IL PROBLEMA
Nel Supabase del progetto (project ref `hmvoljehdquikawksklf`), 20 tabelle hanno **Row Level
Security (RLS) disattivata**:
```
leads, ricerche, messaggi, impostazioni, programma_scan, utenti, aperture, intent_signals,
ricevai_clienti, ricevai_conversazioni, ricevai_messaggi, ricevai_prenotazioni, ricevai_prospect,
ricevai_demo, geo_localita, ricerche_immobiliari, risultati_immobiliari, ricerche_risultati,
omi_quotazioni, invii_log
```
Con RLS disattivata, chiunque conosca la chiave pubblica (anon/publishable key) del sito può
leggere e MODIFICARE tutte le righe di queste tabelle via API Supabase diretta — lead, messaggi,
utenti, tutto. Va chiuso.

## IL MODELLO GIÀ IN USO NELLO STESSO PROGETTO (da replicare)
Altre tabelle nello stesso database sono già protette correttamente, in due modi:
1. **RLS attiva, ZERO policy** → accesso negato a `anon`/`authenticated`, permesso solo al
   backend che usa la `service_role` key (che bypassa sempre RLS). Esempio: `lead_magnet_scans`,
   `lead_magnet_subscribers`, `reputation_sources`, `reviews`, `review_analyses`,
   `reputation_snapshots`, `reputation_audits`.
2. **RLS attiva + una policy INSERT-only per `anon`** → per tabelle alimentate da un form
   pubblico (scrivono ma non leggono). Esempio: `richieste_sito`
   (`with_check: true`, solo INSERT, nessun SELECT per anon).

Per la maggior parte delle 20 tabelle (dati interni: pipeline lead, messaggi, utenti, log invii,
config) il pattern 1 (RLS attiva, zero policy = solo backend) è quello giusto, SE il backend
(postino, dashboard, cron) usa sempre la `service_role` key per leggerle/scriverle.

## STEP 1 — Verifica quale chiave usa il codice per ciascuna tabella (STOP dopo)
Cerca nel codice (grep) dove vengono usate queste 20 tabelle e con quale client Supabase
(`service_role` key lato server, oppure `anon`/`publishable` key lato client/browser). In
particolare verifica con attenzione queste 3, che dal nome sembrano potenzialmente pubbliche:
- **`geo_localita`** (198.972 righe — sembra un lookup per autocompletamento città/zone: se usato
  in un form pubblico, serve una policy SELECT-only per `anon`, mai INSERT/UPDATE/DELETE)
- **`ricevai_demo`** (commento in tabella: "Catalogo demo RicevAI per settore: categorie mostrate
  dall'agente prospect + video... e link inviati su WhatsApp" — se letta da una pagina/agente
  pubblico, serve SELECT-only per `anon`)
- **`omi_quotazioni`** (quotazioni immobiliari — se mostrate in una pagina pubblica di
  valutazione, serve SELECT-only per `anon`)

Per tutte le altre 17 (leads, messaggi, utenti, ricevai_clienti/conversazioni/messaggi/
prenotazioni/prospect, ricerche*, impostazioni, programma_scan, aperture, intent_signals,
risultati_immobiliari, ricerche_risultati, invii_log) verifica comunque che siano SOLO
backend/server-side prima di procedere — non dare per scontato, controlla il codice.

Riportami: per ciascuna tabella, "solo backend" oppure "letta/scritta anche da client pubblico" e
da dove.

## STEP 2 — Piano di policy (STOP dopo, aspetta mio ok prima di eseguire)
In base allo STEP 1, proponi:
- Per le tabelle "solo backend": RLS ON + zero policy (pattern 1, come lead_magnet_scans).
- Per `geo_localita` / `ricevai_demo` / `omi_quotazioni`, SE risultano lette da client pubblico:
  RLS ON + una policy `SELECT` per `anon` con `qual: true` (sola lettura, mai scrittura) — stesso
  identico pattern di `richieste_sito` ma per SELECT invece di INSERT.
- Se qualche tabella risulta scritta anche da client pubblico (es. un form), proponi una policy
  INSERT-only mirata, mai una policy permissiva su UPDATE/DELETE per anon.

Mostrami il piano tabella per tabella PRIMA di eseguire nulla.

## STEP 3 — Esecuzione a lotti, con test (STOP dopo ogni lotto)
Applica in 3 lotti, non tutto insieme:
1. **Lotto 1** — le tabelle più "a rischio zero" e mai toccate da pagine pubbliche (es.
   `impostazioni`, `programma_scan`, `utenti`, `invii_log`, `intent_signals`, `aperture`).
   Applica RLS ON (zero policy). Testa: dashboard e postino continuano a funzionare? Controlla
   log/errori.
2. **Lotto 2** — le tabelle centrali della pipeline (`leads`, `messaggi`, `ricerche`,
   `ricevai_clienti`, `ricevai_conversazioni`, `ricevai_messaggi`, `ricevai_prenotazioni`,
   `ricevai_prospect`, `ricerche_immobiliari`, `risultati_immobiliari`, `ricerche_risultati`).
   Applica, poi testa a fondo: dashboard GLE si apre e mostra i lead? Il postino manda ancora i
   messaggi approvati (c'è un batch di 85 messaggi appena approvati da inviare in questi giorni —
   NON deve rompersi)? Verifica anche RicevAI (prenotazioni, conversazioni) funzioni ancora.
3. **Lotto 3** — le 3 tabelle sospette (`geo_localita`, `ricevai_demo`, `omi_quotazioni`), con la
   policy SELECT-only per anon se serve (vedi STEP 2). Testa la pagina/funzione pubblica
   collegata (autocompletamento zona, demo RicevAI, valutazione immobiliare) DAL VIVO, non solo
   "sembra ok" — apri davvero la pagina e prova.

Dopo OGNI lotto, esegui questa query per confermare che RLS sia attiva e mostrami il risultato:
```sql
select tablename, rowsecurity from pg_tables where schemaname='public' and tablename in (...lista del lotto...);
```

## STEP 4 — Verifica finale (STOP dopo)
Rilanciati l'advisor di sicurezza Supabase (o la query equivalente) e conferma che le 20 tabelle
ora risultano tutte con RLS attiva. Riportami l'elenco finale.

## REGOLE
- Non abilitare RLS su una tabella con policy sbagliate "tanto poi aggiusto" — se non sei sicuro
  che il backend usi service_role per una tabella, fermati e chiedimi prima di quella tabella.
- Non toccare `conversations` e `readings` (già RLS attiva con policy permissive volute, non fa
  parte di questo fix) né `richieste_sito` (già a posto).
- Se un test fallisce dopo un lotto, puoi tornare indietro con `ALTER TABLE ... DISABLE ROW LEVEL
  SECURITY` solo su quella tabella specifica, poi fermati e riportami cosa è successo.
- Il postino ha un batch di 85 messaggi appena approvati da inviare (15/giorno, ~6 giorni) — non
  deve interrompersi per questo fix.
