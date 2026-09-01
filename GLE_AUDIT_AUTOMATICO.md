# GLE — Audit automatico (porta d'ingresso)

> Da usare in Claude Code dentro il progetto GlobalLead Engine. Conferma in quale progetto sei.
> Feature additiva sul generatore di bozze esistente. STOP dopo ogni step.

## PERCHÉ SERVE (contesto)
Nel processo di vendita abbiamo aggiunto una "porta d'ingresso": un audit gratuito di 2-3 gap
concreti sul lead, mandato PRIMA del pitch diretto, per abbassare la barriera con i contatti più
freddi/diffidenti. I 2-3 gap **sono già dentro GLE** per ogni lead (`sito_obsoleto`, `ha_booking`,
`servizio_consigliato`, `score`) — oggi le setter dovrebbero leggerli a mano dalla scheda e
scrivere il messaggio. Va automatizzato: un bottone che genera il testo pronto.

## OBIETTIVO
Aggiungere alla scheda lead (o al generatore di bozze esistente) un bottone **"Genera Audit"**
che produce, usando SOLO template fissi + dati reali del lead (MAI testo generato liberamente
dall'AI che possa inventare cose false su un'attività vera):

1. **Script 1 — proposta audit** (primo contatto soft)
2. **Script 2 — consegna audit** con i gap reali del lead già inseriti, e chiusura con richiesta
   di call

## TEMPLATE ESATTI (da usare parola per parola, sostituendo solo le variabili)

### Script 1 — proposta audit
```
Ciao [nome_attivita], sono [mittente_nome] di EnrietaBiz 🙂
Ho dato un'occhiata veloce alla presenza online di [nome_attivita] e ho notato un paio di cose
che probabilmente vi fanno perdere clienti senza che ve ne accorgiate.
Ti va se ti mando un audit gratuito di 2 minuti con quello che ho trovato? Nessun impegno, solo
per darti valore.
```

### Script 2 — consegna audit + ponte alla call
```
Ciao [nome_attivita], ecco il tuo audit veloce:
[GAP_1]
[GAP_2]
[GAP_3 se presente]
Sono cose che con un intervento mirato si sistemano in pochi giorni. Ti va una call di 15 minuti
per vedere insieme come recuperarle?
```

## MAPPA GAP → TESTO (deterministica, NON generata da AI — solo questi testi fissi)
Genera al massimo 3 gap, nell'ordine sotto, solo se la condizione è vera per quel lead. Se un
lead ha meno di 2 gap disponibili, l'audit non si genera (bottone disabilitato o messaggio "dati
insufficienti per un audit su questo lead") — MAI inventare un gap che non risulta dai dati.

| Condizione sul lead | Testo del gap (con emoji 🔴 davanti) |
|---|---|
| `sito_obsoleto = true` | 🔴 Il vostro sito non sembra aggiornato da tempo — chi vi cerca oggi si fa un'idea in pochi secondi. |
| `ha_booking = false` | 🔴 Non avete un sistema di prenotazione online — le richieste fuori orario probabilmente si perdono. |
| `sito_web` è vuoto/null | 🔴 Non risulta un sito web collegato alla vostra attività — chi vi cerca online potrebbe non trovarvi. |
| `num_recensioni` basso (< 10) o `rating` basso (< 4.0), se questi campi esistono | 🔴 Le recensioni online sono poche/basse — è spesso il primo filtro con cui un cliente nuovo decide. |

Se servono altre condizioni oltre queste 4, proponimele prima di implementarle — non inventarne
altre di tua iniziativa.

## STEP 1 — Ricognizione (STOP dopo)
Trova dove nel codice vive il generatore di bozze esistente (quello usato per i segmenti Cliniche/
Fisio/Estetica) e la scheda lead / cabina setter. Verifica quali campi (`sito_obsoleto`,
`ha_booking`, `sito_web`, `num_recensioni`, `rating`) sono popolati in modo affidabile — se alcuni
sono spesso null/mancanti, dimmelo prima di usarli nella mappa gap. Dimmi dove aggiungere il
bottone "Genera Audit".

## STEP 2 — Generazione testo (STOP dopo)
Implementa la funzione che, dato un lead, produce Script 1 e Script 2 con i placeholder
sostituiti (nome attività, mittente, gap reali nell'ordine della mappa sopra, lingua DE/IT come
già fatto per il segmento Cliniche se il lead ha paese/regione svizzero). Nessuna chiamata AI per
generare i gap — sono template fissi, solo i DATI sono dinamici.

## STEP 3 — UI (STOP dopo)
Bottone "Genera Audit" nella scheda lead / cabina setter, che mostra Script 1 e Script 2 pronti da
copiare (stesso pattern "copia" già usato per la traccia telefonica del segmento Cliniche). Se il
lead ha meno di 2 gap disponibili, mostra un avviso invece del testo (vedi sopra, mai inventare).

## STEP 4 — Follow-up dedicati (STOP dopo)
Aggiungi anche i 2 follow-up dell'audit (testo fisso, dalla sezione 0 del documento di vendita):
```
Follow-up 1: [nome_attivita], ti avevo proposto un audit gratuito del tuo sito qualche giorno fa
— te lo preparo comunque? Ci metto 2 minuti 🙂

Follow-up 2: [nome_attivita], ultimo messaggio su questo — se in futuro vuoi l'audit gratuito
sono qui, altrimenti va benissimo così, buon lavoro! 🌸
```
Stesso meccanismo di follow-up 1/2 già esistente per gli altri messaggi (bozza → approvata →
inviata), solo con questi testi e collegati al lead che ha ricevuto lo Script 1 senza risposta.

## STEP 5 — Test (STOP dopo)
Genera l'audit per 3 lead reali con combinazioni diverse di gap (es. uno con solo sito_obsoleto,
uno con sito_obsoleto + ha_booking false, uno senza gap sufficienti → deve mostrare l'avviso).
Mostrami i 3 risultati. STOP.

## REGOLE
- Zero testo generato liberamente dall'AI per i gap: solo la mappa fissa sopra. È un audit reale
  su dati reali, non deve mai sembrare (o essere) inventato.
- Non toccare il generatore di bozze esistente per gli altri segmenti (Cliniche, Fisio, Estetica,
  Enagic, Luxury, Velvet) — questa è una funzione parallela, non una modifica di quelle.
- L'audit resta un mezzo per arrivare alla call, non un messaggio a sé: lo Script 2 chiude SEMPRE
  con la richiesta di call.
