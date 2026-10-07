Data (UTC): 2026-10-07

## Accordo con l'agente 2

Divisione dell'agente 2 confermata: T1 al lavoratore 4, T2 al lavoratore 5, lavoratore 6 senza task.

Verifica indipendente (file aperti sotto `web/`):
- (a) T1 e T2 assegnati esattamente una volta ciascuno.
- (b) Insiemi di file disgiunti: gruppo 4 = `web/lib/chatHistory.ts`, `web/app/api/agent/chat/route.ts`,
  `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx`; gruppo 5 = `web/app/api/agent/search/route.ts`.
- (c) Carico: due task piccoli, uno per lavoratore; il terzo resta vuoto perche' non ci sono altri task assegnabili.
- (d) Testi precisi. Aggiunte due precisazioni (non cambiano lo scopo): in T2 il formato attuale produrrebbe uno spazio
  doppio con marca e modello vuoti, quindi il criterio "nessuno spazio doppio" e' reso esplicito con un esempio; per
  entrambi il controllo di build e' specificato (vedi sotto, `npm run build` rigenera un file 'GENERATO DA').
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file 'GENERATO DA'; nessuna
  migrazione, secret nuovo o scelta di design. Nessun task di rafforzamento della sicurezza oggi.
- (f) PR aperte (via REST, `gh pr list` non disponibile in questo ambiente): solo #68, che modifica solo
  `supabase/migrations/0005_rls_hardening.sql`. Nessuna sovrapposizione.

Risposte ai punti da confermare:
1. Confermato: estendere `web/lib/chatHistory.ts` (esiste gia', contiene `historyWindow` usata solo da
   `chat/route.ts`). `historyWindow` non va modificata. Il modulo puo' importare i tre file `@/messages/*.json` come gia'
   fa la route; viene importato solo da codice server (route e pagina server), quindi nessun peso aggiunto al client.
2. Non si accorpano i task: con file disgiunti due lavoratori in parallelo sono preferibili; i punti U1-U13 restano
   all'intervento umano e non vanno sbloccati da questa cascata.

## Lavoratore 4

Branch: `claude/worker-4-2026-10-07`

### T1 — Pagina documenti: nascondi i vecchi testi di riserva salvati
- Gravita': Minore
- File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:27-34`, `web/app/api/agent/chat/route.ts:11-13, 46-53`
- Problema: la pagina carica gli ultimi 50 `chat_messages` senza filtro; le righe dell'assistente con il testo "nessuna
  risposta" salvate prima della PR #73 compaiono ancora come risposte vere, mentre la route le scarta gia' dal prompt.
- Correzione: spostare la costruzione di `EMPTY_REPLY_TEXTS` (testi `apiErrors.emptyReply` di it/en/de, con `trim()`) in un
  modulo di `web/lib/` (per esempio `web/lib/chatHistory.ts`) con una funzione tipo `isEmptyReplyText(content)`; usarla nella
  route al posto del Set locale e nella pagina documenti per escludere i messaggi `assistant` che corrispondono, prima di
  passarli a `ChatPanel`.
- Accettazione: nessuna definizione duplicata dei testi di riserva; la pagina documenti non passa a `ChatPanel` messaggi
  `assistant` il cui contenuto (dopo `trim()`) e' un testo di riserva; la route chat continua a scartarli dal prompt;
  `npm run build` (o lint + typecheck) in `web/` senza errori.

Decisione dell'agente 3: il modulo e' `web/lib/chatHistory.ts` (file esistente, da estendere; non creare un modulo nuovo).
Togliere da `chat/route.ts` gli import dei tre `@/messages/*.json` se dopo la modifica non sono piu' usati altrove nel file.

File ammessi (gli unici modificabili):
- `web/lib/chatHistory.ts`
- `web/app/api/agent/chat/route.ts`
- `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx`

Ordine di esecuzione: 1) aggiungere `isEmptyReplyText` in `chatHistory.ts`; 2) usarla in `chat/route.ts` e rimuovere il
`Set` locale; 3) filtrare i messaggi nella pagina documenti.

Criteri di accettazione:
- quelli di T1 sopra;
- `historyWindow` invariata;
- in `web/`: `npx tsc --noEmit` e `npm run lint` senza errori nuovi; se si esegue `npm run build`, non includere nel commit
  le modifiche a `web/lib/appIcons.ts` (file 'GENERATO DA') ne' altri file fuori elenco.

## Lavoratore 5

Branch: `claude/worker-5-2026-10-07`

### T2 — Ricerca IA: mantieni anno e motorizzazione anche senza marca e modello
- Gravita': Minore
- File: `web/app/api/agent/search/route.ts:406-415`
- Problema: con marca e modello vuoti la condizione `if (make || model)` scarta l'intero contesto del veicolo, anche anno e
  motorizzazione presenti.
- Correzione: costruire `vehicleContext` quando c'e' almeno uno tra `make`, `model` ed `engine`, mantenendo il formato attuale
  (nessuno spazio doppio, anno e motore solo se presenti) e i limiti `clampText` gia' applicati.
- Accettazione: per un veicolo con marca e modello vuoti ma motore valorizzato il contesto contiene tipo, anno (se c'e') e
  motorizzazione; con tutti e tre vuoti resta vuoto; i casi con marca o modello restano identici a oggi; build in `web/` ok.

Precisazione dell'agente 3: con marca e modello vuoti il template attuale darebbe `auto  (2020)` (due spazi). Il risultato
atteso in quel caso e' `Veicolo di riferimento: auto (2020), motorizzazione X.` (oppure `... auto, motorizzazione X.` senza
anno). Con marca o modello presenti la stringa deve restare byte per byte identica a oggi.

File ammessi (gli unici modificabili):
- `web/app/api/agent/search/route.ts`

Ordine di esecuzione: 1) modificare condizione e composizione di `vehicleContext`; 2) verificare a mano i tre casi
(marca/modello presenti, solo motore, tutto vuoto).

Criteri di accettazione:
- quelli di T2 sopra e la precisazione sul formato;
- in `web/`: `npx tsc --noEmit` e `npm run lint` senza errori nuovi; se si esegue `npm run build`, non includere nel commit
  le modifiche a `web/lib/appIcons.ts` (file 'GENERATO DA') ne' altri file fuori elenco.

## Lavoratore 6

Nessun task assegnato.

## Richiede intervento umano (non assegnati)
Invariato rispetto a TASKS.md: vedi BUG_SCAN.md, punti U1-U13.

## Gia' in PR
- #68 (solo `supabase/`).
