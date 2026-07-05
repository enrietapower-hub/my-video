# PROMPT — Bot Telegram: nuovo gruppo setter con topic (lead 80% + lead da chiamare)

> Da usare in Claude Code dentro il progetto **GlobalLead Engine**. Conferma prima in quale cartella sei.
> Procedi a piccoli passi fermandoti a ogni STOP. Niente invii di massa senza mia conferma.

---

## CONTESTO
Il bot Telegram "enrietabiz" esiste già e già manda notifiche/approvazioni. Ho creato un
NUOVO gruppo Telegram con i topic (forum) per le setter. Voglio che il bot pubblichi i lead
anche in questo gruppo, divisi per topic e assegnati alle setter.

**Gruppo nuovo:** dal link t.me/c/4350310169/... → il chat_id è `-1004350310169`
(formato bot API: -100 + il numero del link. Verificalo con getUpdates o un messaggio di prova).

**Topic (message_thread_id):**
- Topic **11** → "Lead 80% score" → t.me/c/4350310169/11
- Topic **9**  → "Lead da chiamare / WhatsApp" → t.me/c/4350310169/9

⚠️ Prerequisito: il bot deve essere DENTRO il nuovo gruppo come amministratore.
Se non riesce a scrivere, dimmelo subito: lo aggiungo io dal telefono.

---

## STEP 1 — Ricognizione (STOP dopo)
1. Trova dove il bot manda oggi i messaggi Telegram (funzione/endpoint, dove sta il BOT_TOKEN
   e il chat_id attuale). NON toccare il flusso esistente: quello attuale continua a funzionare.
2. Dimmi come sono gestite oggi le "corsie" di assegnazione (assegnato_a / owner):
   oggi ci sono Enrieta, EnrietaGmail, Desy, Sara. Vanno AGGIUNTE due setter nuove:
   **Cristina** e **Daniela**. Dimmi dove si aggiungono (config/tabella).
3. Dimmi con che criterio distinguiamo un "lead da email" da un "lead da chiamare"
   (ha email? ha solo telefono? entrambi?). STOP.

## STEP 2 — Regole di smistamento (STOP dopo)
Implementa questa logica per i lead QUALIFICATI:

**A) Topic 11 — "Lead 80% score"** (message_thread_id = 11)
- Criterio: score ≥ 80 E ha un'email valida.
- Assegnazione outreach a ROTAZIONE EQUA tra: **Sara, Desy, Cristina, Daniela**
  (round-robin; se una corsia è già molto carica, riequilibra).
- Il messaggio nel topic deve contenere: nome attività, città, categoria, score,
  gap principale, email, e **"Assegnato a: {setter}"**.

**B) Topic 9 — "Lead da chiamare / WhatsApp"** (message_thread_id = 9)
- Criterio: lead con telefono da lavorare a chiamata o WhatsApp
  (es. niente email, oppure telefono mobile presente — conferma il criterio allo STEP 1).
- Assegnazione SOLO a rotazione tra: **Daniela e Cristina** (le altre NON ricevono questi).
- Il messaggio deve contenere: nome attività, città, categoria, score, telefono,
  link wa.me pronto se è un mobile, e **"Assegnato a: {setter}"**.

Regole comuni:
- Un lead va in UN solo topic (se ha sia email che telefono → topic 11, l'email vince).
- Non ripubblicare lead già pubblicati (tieni traccia con una colonna tipo
  `telegram_msg_id` / `pubblicato_gruppo_setter_il` — additiva, non rompere lo schema).
- Mostrami un ESEMPIO di messaggio per ciascun topic prima di attivare. STOP.

## STEP 3 — "Contattato = via dalla lista" (STOP dopo)
Quando un lead viene segnato come contattato nell'app (bottone "inviata"/"contattato"):
- Il bot **elimina** il messaggio di quel lead dal topic (deleteMessage usando il
  telegram_msg_id salvato) — oppure, se l'eliminazione non è affidabile, lo **modifica**
  in "✅ Contattato da {setter}" (editMessageText). Scegli la via più robusta e dimmi quale.
- Nel database NON si cancella niente: lo stato resta tracciato come ora
  (monitoraggio manuale per adesso, nessuna automazione in più).
STOP.

## STEP 4 — Test (STOP dopo)
- Manda 2-3 lead di PROVA nei due topic (dimmi quali hai scelto).
- Verifica: assegnazione giusta (topic 11 → una tra Sara/Desy/Cristina/Daniela;
  topic 9 → solo Daniela o Cristina), formato messaggio ok, e che segnando "contattato"
  il messaggio sparisca/si aggiorni nel gruppo.
- STOP: controllo io nel gruppo e ti do l'ok.

## STEP 5 — Attiva
Solo dopo il mio ok: attiva sul flusso reale. Il vecchio canale Telegram di approvazione
NON si tocca: questo gruppo è IN AGGIUNTA.

---

## NOTE
- Le setter NON hanno accesso all'app per ora: lavorano dal gruppo Telegram. Per questo
  il messaggio deve avere dentro TUTTO quello che serve per contattare il lead.
- Se qualcosa richiede colonne nuove in Supabase, dimmi prima cosa aggiungi (solo additive).
- Non aumentare i volumi di invio: cambia solo DOVE vengono pubblicati i lead e a chi.
