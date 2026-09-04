# GLE — Monitoraggio sociale automazione PMI (IT/CH) → report giornaliero commenti caldi

> Da usare in Claude Code con accesso reale a LinkedIn/social (browser loggato, Sales Navigator,
> o tool tipo Phantombuster/n8n con nodo LinkedIn/X). **NON funziona con solo ricerca web generica**
> (vedi nota tecnica sotto) — prima INVESTIGA che integrazione è disponibile, poi implementa.
> STOP dopo ogni step.

## NOTA TECNICA — leggi prima di iniziare
Questo prompt è stato testato con `WebSearch` generico (Google-style, senza login): il risultato è
quasi solo pagine profilo LinkedIn e annunci di lavoro indicizzati, **non** i singoli post/thread di
discussione. Non è possibile in quel modo: filtrare per "ultimi 14 giorni" in modo affidabile,
leggere il numero di like/commenti reali, o accedere ai gruppi Facebook (sono chiusi, dietro login).

Per funzionare davvero, questo task richiede UNA di queste condizioni — verificala allo STEP 1:
1. **Accesso a LinkedIn autenticato** (account con login attivo via browser automation, o Sales
   Navigator con API/export), per leggere post reali con data e engagement.
2. **Un tool di social listening/scraping già collegato** (es. Phantombuster, n8n con nodo
   LinkedIn/X, o simili) che l'utente ha già configurato.
3. **API ufficiali** (LinkedIn API, X API a pagamento) — le uniche vie pienamente conformi ai
   Termini di Servizio delle piattaforme.

⚠️ **Attenzione ban**: scraping automatico e sistematico di LinkedIn con un account personale
(bot che cerca parole chiave su larga scala) viola i Termini di Servizio di LinkedIn e può portare
a restrizioni o blocco dell'account. Se l'unica via disponibile è "browser loggato con l'account
personale di Enrieta", va fatto con **volumi bassi e ritmo umano** (poche ricerche/giorno, pause,
mai in loop stretto) — stesso principio delle regole anti-ban già in uso per WhatsApp/LinkedIn nel
processo di vendita. Se non è chiaro come restare nei limiti, fermati e chiedi conferma prima di
implementare qualsiasi automazione che tocchi l'account LinkedIn reale.

Se allo STEP 1 nessuna delle 3 condizioni sopra è disponibile, **fermati e riportalo** invece di
produrre un report con dati mancanti o (peggio) inventati — vale la stessa regola di tutti gli altri
file GLE: mai inventare dati su aziende/persone reali.

---

## TASK (testo originale, così come richiesto)

Trova aziende PMI in Italia e Svizzera che negli ultimi 14 giorni stanno cercando/valutando
automazioni (workflow, CRM, chatbot WhatsApp/ManyChat, AI agent, RPA) e segnala ogni giorno le
discussioni più calde su cui per Enrieta conviene lasciare un commento pubblico. Non inviare né
suggerire connessioni o DM freddi.

### Istruzioni operative
- Lingua: italiano
- Paesi: Italia (IT) e Svizzera (CH)
- Focus: solo PMI (micro, piccole, medie). Escludi aziende >250 dipendenti. Se la dimensione è
  incerta, prova a inferirla (LinkedIn company size 1–10/11–50/51–200/201–500: tieni solo fino a
  201–500 se è comunque PMI; >250 escludi).
- Settori: includi tutti (anche pulizie, hotellerie, detergenti) se il post mostra un bisogno reale
  di automazione.
- Fonti: LinkedIn (post/profili/aziende e offerte), community/gruppi, job board, X/Twitter, siti
  aziendali (careers/blog), forum.
- Finestra temporale: ultimi 14 giorni (escludi fonti senza data chiara).
- Azioni vietate: non proporre né inviare connessioni, DM freddi, email a freddo, scraping di
  contatti sensibili.
- Obiettivo pratico: generare una short-list giornaliera di "thread dove commentare ora" con bozza
  di commento pronta, aderente al contesto.

### Query di ricerca (adatta/combina)
- ("automazione workflow" OR "automatizzare processi" OR "integrazione CRM" OR "AI agent" OR "RPA"
  OR "n8n" OR "Zapier" OR "Make" OR "ManyChat" OR "chatbot WhatsApp")
  AND ("cerchiamo" OR "stiamo cercando" OR "ci serve" OR "consulente" OR "implementare" OR
  "valutiamo")
  AND (Italia OR Svizzera OR IT OR CH)
- site:linkedin.com ("automazione" OR "n8n" OR "Zapier" OR "Make" OR "ManyChat" OR "chatbot
  WhatsApp") ("cerchiamo" OR "consulente" OR "implementare") (Italia OR Svizzera)
- site:linkedin.com/jobs ("automation" OR "CRM" OR "workflow" OR "RPA" OR "AI agent") (Italia OR
  Svizzera)
- site:facebook.com/groups ("automazione" OR "n8n" OR "Zapier" OR "Make" OR "chatbot WhatsApp")
  ("cerco" OR "chi mi aiuta")
- site:x.com ("automatizzare" OR "n8n" OR "Zapier" OR "Make") ("cerco" OR "aiuto")
- Facoltativo per settori: aggiungi keyword come "hotel", "ospitalità", "housekeeping", "pulizie",
  "detergenti", solo se coesistono con automazione/strumenti.

### Criteri di scoring (0–100)
- +25 bisogno esplicito ("cerchiamo/serve urgentemente/valutiamo ora")
- +20 ruolo decisionale autore (Founder/CEO/COO/Marketing/Operations/IT/Growth/CRM) o budget
  menzionato
- +15 strumenti citati (n8n/Zapier/Make/ManyChat/CRM/RPA/AI agent)
- +15 chiarezza area processo (lead gen, CRM, customer care, operations, e-commerce, hospitality
  ops)
- +15 freschezza (≤7 giorni: +15; 8–14: +8)
- +10 engagement del thread (commenti/like sopra media della pagina)
- -20 se azienda >250 dipendenti o enterprise

### Output (JSON Lines; una riga JSON per risultato)
```json
{
  "azienda": "string",
  "settore": "string",
  "size_range": "1-10|11-50|51-200|201-250|sconosciuta",
  "paese": "IT|CH",
  "canale": "LinkedIn|FB Group|Job Board|X|Sito|Forum",
  "link": "https://…",
  "autore_ruolo": "string",
  "bisogno": "citazione o riassunto sintetico",
  "strumenti_menzionati": ["n8n","Zapier","Make","ManyChat","CRM","RPA","AI agent"],
  "data_post": "YYYY-MM-DD",
  "engagement": { "like": 0, "commenti": 0 },
  "score": 0,
  "perche_adesso": "1 riga sul timing/opportunità",
  "bozza_commento": "breve, utile, contestuale: 1 spunto concreto + 1 domanda, senza pitch e senza DM",
  "azione": "commenta nel thread",
  "note": "eventuali rischi/contesto"
}
```

### Regole finali (originali)
- Deduplica per azienda+link
- Mantieni solo PMI e post con intento reale (non tutorial generici)

---

## STEP 1 — Verifica ambiente (STOP dopo, riportami cosa trovi)
Prima di cercare qualsiasi post, verifica e riportami:
1. Quale delle 3 condizioni della NOTA TECNICA è disponibile in questo ambiente (login LinkedIn
   attivo? tool di scraping già collegato? API a pagamento configurate?).
2. Se nessuna è disponibile, fermati qui e dimmelo esplicitamente — non generare un report con dati
   parziali o stimati spacciati per reali.
3. Se è disponibile un accesso con account personale (non API ufficiale), stima un volume di
   ricerche/giorno che resti prudente per non rischiare il ban, e proponimelo prima di procedere.

## STEP 2 — Prova su un giorno singolo (STOP, aspetta il mio ok)
Prima di impostare qualsiasi automazione giornaliera, fai UN solo giro di prova con le query sopra
e mostrami i risultati reali (anche se pochi o zero) in formato JSON Lines come specificato. Niente
righe "di esempio" o inventate per riempire l'output — se una query non trova nulla di reale in 14
giorni, va bene un output vuoto per quella query.

## STEP 3 — Automazione giornaliera (solo dopo il mio ok sullo STEP 2, STOP dopo)
Solo se la prova dello STEP 2 ha prodotto risultati reali e utili, imposta l'esecuzione giornaliera
e il formato di consegna del report (dimmi tu dove preferisci riceverlo: Telegram come le bozze
GLE, email, o altro canale già in uso).

## REGOLE
- Mai inventare aziende, post, citazioni o metriche di engagement: solo dati verificabili dalla
  fonte reale.
- Nessuna connessione o DM freddo, nessuno scraping di contatti sensibili (email/telefono privati)
  — l'unico output ammesso è "commenta nel thread pubblico".
- Se il volume di ricerche rischia di violare i Termini di Servizio della piattaforma o di far
  bannare l'account, fermati e chiedi conferma invece di procedere comunque.
- Se dopo lo STEP 1 risulta che l'ambiente non ha nessuna delle 3 condizioni necessarie, il task
  resta bloccato finché non si collega un'integrazione vera — non forzare un risultato con la sola
  ricerca web generica.
