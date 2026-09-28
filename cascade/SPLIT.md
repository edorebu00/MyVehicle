Data (UTC): 2026-09-28

Solo 3 task in TASKS.md, ciascuno con file coinvolti disgiunti: assegnazione 1 task per lavoratore,
nessun gruppo vuoto.

## Lavoratore 4 — T1

ID task: T1 — API senza sessione: lasciar rispondere la route (messaggio tradotto, cookie aggiornati)

File previsti:
- `web/middleware.ts` (unico file da modificare)

Verificato leggendo il codice: le tre route sotto `web/app/api/` (`agent/chat`, `agent/process-document`,
`agent/search`) controllano gia' l'utente e rispondono 401 con `apiErrors.notAuthenticated`, quindi non
serve toccare nessuna route: basta far proseguire la richiesta (`return response`) per i percorsi `/api/`
senza utente in `middleware.ts`.

Motivazione: task isolato, un solo file, nessuna dipendenza da altri task.

Rischi/conflitti: nessun conflitto di file con gli altri gruppi. Il comportamento osservabile (messaggio
d'errore che arriva alle route che chiamano `/api/agent/*`) tocca la stessa storia utente di T3 (bolla di
chat su sessione scaduta), ma i due task modificano file diversi e non si toccano a livello di codice:
possono procedere in parallelo senza coordinamento.

## Lavoratore 5 — T2

ID task: T2 — Mini Aceman: togliere le motorizzazioni doppie dalle estensioni

File previsti:
- `web/lib/engineExtensions.ts` (rimuovere la chiave `Aceman`, righe ~807-810)

Verificato leggendo il codice: `ENGINE_EXTENSIONS.Mini.Aceman` contiene le due voci duplicate ("Elettrica
42,5 kWh 184cv", "Elettrica 54,2 kWh 218cv"); `vehicleData.ts` importa `engineExtensions.ts` ma il task
non richiede modifiche a `vehicleData.ts` (le tre voci Aceman restano li' cosi' come sono).

Motivazione: task isolato, un solo file, nessuna dipendenza da altri task.

Rischi/conflitti: nessuno. Nessun altro task tocca `engineExtensions.ts` o `vehicleData.ts`.

## Lavoratore 6 — T3

ID task: T3 — Chat: non rimettere nel campo una domanda gia' salvata quando il corpo di un 200 non si legge

File previsti:
- `web/components/ChatPanel.tsx` (righe ~56-66, separare il ramo `res.redirected` da `res.ok && data === null`)

Verificato leggendo il codice: il branch attuale unisce i due casi in un solo `if`; basta separarli e
togliere la chiamata a `restoreUnsent()` solo per il caso `res.ok && data === null`, aggiornando il
commento sopra `res.json()`.

Motivazione: task isolato, un solo file, nessuna dipendenza da altri task.

Rischi/conflitti: nessuno. Vedi nota su T1 sopra (stessa storia utente, file diversi, nessun conflitto di
merge).

## Punti da confermare all'agente 3

- Con solo 3 task un gruppo per lavoratore e' la divisione piu' naturale, ma se l'agente 3 preferisce
  raggruppare T1 e T3 sotto lo stesso lavoratore per via della storia utente condivisa (messaggio di
  sessione scaduta in chat), i file restano comunque disgiunti quindi non cambia nulla per i conflitti di
  merge: e' solo una scelta di organizzazione, non di sicurezza dai conflitti.
- T1 in BUG_SCAN.md cita `GlobalSearch.tsx` e `ChatPanel.tsx` come "chiamanti" che leggono `data.error`,
  ma l'accettazione di T1 in TASKS.md richiede solo la modifica di `middleware.ts`: ho assunto che nessuna
  di queste due componenti vada toccata. Se l'agente 3 ritiene che serva anche una modifica in
  `ChatPanel.tsx` per T1, andrebbe verificato che non collida con la modifica di T3 nello stesso file
  (stesso lavoratore, task T1 prima di T3, in quel caso).
- Nessun file e' condiviso tra i tre task, quindi non ci sono dipendenze d'ordine da rispettare tra i
  gruppi.
