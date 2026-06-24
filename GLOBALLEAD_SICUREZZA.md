# GlobalLead — Piano di Sicurezza (passo-passo, senza rompere l'app)

> Problema confermato da Supabase: **RLS disattivata** su 7 tabelle (`leads`, `utenti`,
> `messaggi`, `impostazioni`, `ricerche`, `programma_scan`, `aperture`).
> Con la chiave pubblica `anon` (visibile nel sito) un estraneo può leggere/scrivere
> tutti i 10.614 lead e la tabella `utenti` (con gli hash delle password).
> Obiettivo: chiuderlo **senza spegnere l'app**.

---

## 🟢 PARTE A — Da fare SUBITO (rischio ZERO, non tocca l'app)

### A1. Rendi PRIVATO il repository del codice
Se il repo di GlobalLead è pubblico su GitHub → mettilo **Private**:
GitHub → repo → **Settings → General → Danger Zone → Change visibility → Private**.

### A2. Controlla che le chiavi NON siano nel codice
Le chiavi vanno SOLO nelle variabili d'ambiente, mai scritte nei file.
- Cerca nel progetto: `SERVICE_ROLE`, `service_role`, `eyJ` (le chiavi iniziano così).
- La `service_role` deve stare **solo** in env server (Coolify → Environment / `.env.local`),
  **mai** in un file con prefisso `NEXT_PUBLIC_` e mai committata.
- Se l'hai mai messa nel frontend o in un repo pubblico → **rigenerala**:
  Supabase → Project Settings → **API → Rotate** la service_role.

### A3. Attiva la 2FA (verifica in 2 passaggi) sugli account chiave
Qui sì che una **chiave hardware (YubiKey)** o un'app authenticator (Google/Microsoft
Authenticator) serve davvero — protegge il *login*:
- **Supabase** (Account → Security)
- **GitHub** (Settings → Password and authentication)
- **Hetzner** (pannello cloud)
- **Google** (l'account del Drive/Sheets dei lead)

> Fatte A1-A2-A3, hai già tolto i rischi più stupidi. Nessuna di queste può rompere l'app.

---

## 🟡 PARTE B — Blindare il database (RLS) senza downtime

⚠️ Regola d'oro: **NON** attivare RLS prima di aver spostato le letture/scritture lato server.
Se l'app legge i dati col tasto pubblico (anon) e attivi RLS, l'app si spegne.
Quindi: **prima il server, poi la serratura.**

### B1. Dai QUESTO prompt a Claude Code nel progetto GlobalLead
Copia-incolla esattamente:

> Analizza come questo progetto Next.js accede a Supabase. Trova tutte le chiamate
> `createClient` e tutte le query a `leads`, `utenti`, `messaggi`, `impostazioni`,
> `ricerche`, `programma_scan`, `aperture`.
>
> Obiettivo SICUREZZA senza downtime:
> 1. Sposta TUTTE le letture/scritture di queste tabelle in codice SERVER-SIDE
>    (route handler in `app/api/...`, Server Actions, o Server Components), usando un
>    client creato con `SUPABASE_SERVICE_ROLE_KEY` (variabile NON `NEXT_PUBLIC`).
> 2. Rimuovi ogni query a quelle tabelle fatta dal browser con la chiave `anon`.
> 3. Crea `lib/supabaseAdmin.ts` con il client service_role (auth.persistSession=false).
> 4. NON cambiare la UI/logica di business: solo da dove parte la query.
> 5. Lascia un elenco dei file modificati e dei punti dove prima si usava la chiave anon.
> Non attivare ancora RLS: lo faccio dopo aver testato.

### B2. Testa
Dopo le modifiche: builda, fai partire l'app, e verifica che TUTTO funzioni
(lista lead, login, ricerca, outreach). Se qualcosa non va, è perché una query è
rimasta lato browser → falla sistemare a Claude Code prima di procedere.

### B3. Attiva la serratura (Supabase → SQL Editor → Run)
Solo quando B2 è ok:
```sql
ALTER TABLE public.leads          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utenti         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messaggi       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impostazioni   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ricerche       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programma_scan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aperture       ENABLE ROW LEVEL SECURITY;
```
Nessuna policy per `anon` = pubblico bloccato. Il `service_role` (lato server) bypassa RLS
e continua a funzionare.

### B4. Verifica finale
- Ricarica l'app: deve funzionare come prima (ora gira via server).
- Supabase → **Advisors → Security**: l'allarme RLS deve sparire.
- Prova (facoltativo) ad aprire una pagina che prima leggeva da browser: non deve più
  riuscire a tirare i dati col tasto pubblico.

---

## Ordine pratico
**Stasera:** A1, A2, A3 (10 minuti, zero rischio).
**Quando hai mezz'ora tranquilla:** B1 → B2 → B3 → B4.

Se nel passo B2 qualcosa si rompe, fermati e scrivimi: ti dico come rimetterla a posto
prima di attivare la serratura. Meglio lenti e sicuri che veloci e offline. 🌸
