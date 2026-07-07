# FIX — Daniela e Cristina mancanti nei follow-up e nella cabina setter

> Da usare in Claude Code dentro il progetto **GlobalLead Engine**. Conferma in quale cartella sei.
> Bug fix. Procedi a piccoli passi con STOP. Non toccare le mail gia inviate.

## SINTOMI (osservati in produzione)
1. Quando si scrive/genera il FOLLOW-UP per un lead assegnato a **Daniela** o **Cristina**,
   NON si caricano l'**oggetto** e il **contesto/corpo** (restano vuoti o rotti).
   Per Enrieta / EnrietaGmail / Desy / Sara invece funziona.
2. Nella **CABINA SETTER** non compaiono i nomi di **Daniela** e **Cristina**
   (ci sono solo le setter vecchie).

## DIAGNOSI PROBABILE (verificala, non darla per scontata)
Daniela e Cristina sono state aggiunte SOLO nella lista dei pulsanti "Assegnato a" della
scheda lead, ma NON negli altri punti che elencano/mappano le setter:
- la mappa mittente → { oggetto, frase di presentazione, firma } usata dal generatore di
  bozze e follow-up (per questo oggetto+contesto escono vuoti per loro);
- la lista di setter usata dalla CABINA SETTER (per questo non appaiono).
In pratica manca una **unica fonte di verità** per l'elenco setter.

## STEP 1 — Trova tutti i punti (STOP dopo)
Cerca nel codice OGNI posto dove sono elencati i nomi delle setter/mittenti
(Enrieta, EnrietaGmail, Desy, Sara). Tipicamente:
- la config/array delle corsie mittente e la mappa mittente → firma/presentazione;
- il generatore delle bozze di primo contatto E dei follow-up (dove costruisce oggetto e corpo);
- il componente/pagina della CABINA SETTER (dove filtra/mostra le setter);
- eventuali valori in tabella Supabase (es. `utenti`, `impostazioni`) o enum di stato.
Elencami TUTTI i file/punti trovati e dimmi, per Daniela e Cristina, cosa manca in ciascuno. STOP.

## STEP 2 — Unica fonte di verità (STOP dopo)
Crea (o consolida) UN solo elenco setter, es. `lib/setters.ts`, tipo:
```ts
export const SETTERS = {
  Enrieta:      { label: "Enrieta",      team: false, firma: "Enrieta Fontana — EnrietaBiz", presentazione: "Sono Enrieta, fondatrice di EnrietaBiz." },
  EnrietaGmail: { label: "Enrieta",      team: false, firma: "Enrieta Fontana — EnrietaBiz", presentazione: "Sono Enrieta, fondatrice di EnrietaBiz." },
  Desy:         { label: "Desy",         team: true,  firma: "Desy — Team EnrietaBiz",         presentazione: "Lavoro con Enrieta Fontana di EnrietaBiz." },
  Sara:         { label: "Sara",         team: true,  firma: "Sara — Team EnrietaBiz",         presentazione: "Lavoro con Enrieta Fontana di EnrietaBiz." },
  Daniela:      { label: "Daniela",      team: true,  firma: "Daniela — Team EnrietaBiz",      presentazione: "Lavoro con Enrieta Fontana di EnrietaBiz." },
  Cristina:     { label: "Cristina",     team: true,  firma: "Cristina — Team EnrietaBiz",     presentazione: "Lavoro con Enrieta Fontana di EnrietaBiz." },
};
```
Poi fai in modo che TUTTI i punti dello STEP 1 leggano da QUI:
- i pulsanti "Assegnato a" nella scheda lead;
- il generatore di bozze/follow-up (oggetto, presentazione, firma);
- la CABINA SETTER (elenco/filtri).
Cosi in futuro basta aggiungere una riga qui e la persona compare ovunque. Mostrami il file
e i punti che ora lo importano. STOP.

## STEP 3 — Sistema il follow-up (STOP dopo)
Verifica perche per Daniela/Cristina oggetto e contesto non si caricavano: quasi certamente
il template cercava la firma/presentazione con una chiave che per loro non esisteva e falliva
in silenzio. Rendi il generatore robusto: se una setter non e nella mappa, NON deve uscire
vuoto — usa un fallback team ("Lavoro con Enrieta Fontana di EnrietaBiz." + firma
"{nome} — Team EnrietaBiz") e logga un avviso. Testa la generazione di un follow-up per un
lead assegnato a Daniela e uno a Cristina: oggetto e corpo devono comparire pieni. STOP.

## STEP 4 — Sistema la cabina setter (STOP dopo)
Fai comparire Daniela e Cristina nella cabina setter (lista/filtri) leggendo da SETTERS.
Verifica che selezionandole si vedano e si possano lavorare i loro lead. STOP.

## STEP 5 — Test finale
- Genera un follow-up per Daniela → oggetto + contesto pieni, firma "Daniela — Team EnrietaBiz".
- Genera un follow-up per Cristina → idem.
- Apri la cabina setter → Daniela e Cristina presenti e selezionabili.
- Controlla che Desy e Sara continuino a funzionare come prima (nessuna regressione).
Riportami cosa hai cambiato, file per file.

## NOTE
- Non toccare le mail gia inviate. Sistema solo la generazione e la UI.
- Se qualcosa e in tabella Supabase e non nel codice, dimmi PRIMA cosa cambi (solo additive).
- Le due nuove sono TEAM (mai "sono la fondatrice"): presentazione "Lavoro con Enrieta Fontana".
