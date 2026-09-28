Data (UTC): 2026-09-28

## Accordo con l'agente 2

Divisione proposta in `cascade/SPLIT.md` CONFERMATA senza modifiche: un task per lavoratore
(T1 -> 4, T2 -> 5, T3 -> 6).

Verifica indipendente (file aperti sotto `web/`):
- (a) T1, T2, T3 assegnati ciascuno esattamente una volta.
- (b) Insiemi di file disgiunti: `web/middleware.ts` / `web/lib/engineExtensions.ts` /
  `web/components/ChatPanel.tsx`.
- (c) Carico bilanciato: un task piccolo, di un solo file, per lavoratore.
- (d) Task precisi: verificato che `middleware.ts:44-49`, `engineExtensions.ts:807-810` (chiave
  `Aceman` sotto Mini) e `ChatPanel.tsx:56-66` corrispondono alla descrizione di TASKS.md.
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file generati;
  nessuna migrazione, secret nuovo o scelta di design richiesti.
- (f) PR aperte al momento della verifica: nessuna. Nessun task escluso.

Risposte ai punti da confermare:
- T1 e T3 restano a lavoratori diversi: i file sono disgiunti e i due cambiamenti sono compatibili.
  Dopo T1 una richiesta senza sessione a `/api/agent/chat` riceve dalla route un 401 JSON tradotto
  senza `userMessageSaved`, che in `ChatPanel.tsx` finisce nel ramo `!res.ok` (errore mostrato,
  testo rimesso nel campo: corretto, la route non ha salvato nulla). Non tocca il ramo modificato da T3.
- T1 non richiede modifiche a `ChatPanel.tsx` ne' a `GlobalSearch.tsx`: entrambi mostrano gia'
  `data.error`, che con T1 diventa il messaggio tradotto della route.
- Verificato che tutte e tre le route sotto `web/app/api/` (`agent/chat`, `agent/process-document`,
  `agent/search`) controllano l'utente con `getUser` e rispondono 401 con `tErr("notAuthenticated")`
  prima di qualunque altra operazione: T1 non deve aggiungere controlli nelle route.
- Nessuna dipendenza d'ordine fra i gruppi.

## Lavoratore 4

Branch: `claude/worker-4-2026-09-28`

### T1 — API senza sessione: lasciar rispondere la route (messaggio tradotto, cookie aggiornati)
Gravita': Minore
File: `web/middleware.ts:44-49`
Problema: per i percorsi `/api/` senza sessione il middleware risponde 401 con il testo fisso inglese
"Not authenticated" e con una risposta nuova che non porta i cookie scritti da `getUser`; le route in
`web/app/api/agent/*` fanno gia' lo stesso controllo e rispondono 401 con il messaggio tradotto.
Correzione: per i percorsi che iniziano con `/api/` e senza utente, restituire `response` (lasciar
proseguire la richiesta) invece del JSON inglese; aggiornare il commento. Prima di farlo, verificare che
ogni route sotto `web/app/api/` controlli l'utente e risponda 401 (se una non lo fa, aggiungere il
controllo nella route con `apiErrors.notAuthenticated`, come nelle altre).
Accettazione: `middleware.ts` non contiene piu' "Not authenticated"; ogni route in `web/app/api/`
risponde 401 con messaggio tradotto senza sessione; `npm run build` (o `npx tsc --noEmit`) e `npm run lint` in `web/` passano.

Nota dell'agente 3: la verifica delle route e' gia' stata fatta (tutte e tre controllano l'utente);
rieseguirla comunque prima della modifica. Il rinvio a `/login` per le pagine non API resta invariato.

File ammessi: `web/middleware.ts` (e, solo se la verifica trovasse una route senza controllo, quella
route sotto `web/app/api/`).

Ordine di esecuzione: 1) ricontrollare le route sotto `web/app/api/`; 2) T1 in `middleware.ts`.

Criteri di accettazione: quelli di T1 sopra; nessun altro file modificato; per le pagine non API senza
sessione il rinvio a `/login` resta invariato.

## Lavoratore 5

Branch: `claude/worker-5-2026-09-28`

### T2 — Mini Aceman: togliere le motorizzazioni doppie dalle estensioni
Gravita': Minore
File: `web/lib/engineExtensions.ts:807-810` (voce `Aceman` sotto Mini)
Problema: `ENGINE_DATA` (`web/lib/vehicleData.ts:1799-1803`) ha ora tre voci Aceman; le due di
`ENGINE_EXTENSIONS` ("Elettrica 42,5 kWh 184cv", "Elettrica 54,2 kWh 218cv") sono le stesse versioni con
la capacita' lorda, e il menu le mostra due volte.
Correzione: rimuovere la chiave `Aceman` da `ENGINE_EXTENSIONS` in `engineExtensions.ts` (come fatto per la
bZ4X nella PR #62). Non toccare `vehicleData.ts:192` se Aceman e' ancora necessario nell'elenco modelli.
Accettazione: `getEngineVariants` per Auto > Mini > Aceman restituisce esattamente le tre voci di
`ENGINE_DATA`; Aceman resta selezionabile come modello; typecheck e lint passano.

File ammessi: `web/lib/engineExtensions.ts`.

Ordine di esecuzione: T2.

Criteri di accettazione: quelli di T2 sopra; `vehicleData.ts` non modificato; le altre voci Mini in
`engineExtensions.ts` (Coupe, Roadster, ecc.) invariate.

## Lavoratore 6

Branch: `claude/worker-6-2026-09-28`

### T3 — Chat: non rimettere nel campo una domanda gia' salvata quando il corpo di un 200 non si legge
Gravita': Minore
File: `web/components/ChatPanel.tsx:56-66`
Problema: il ramo `res.redirected || (res.ok && data === null)` chiama `restoreUnsent()`. Un 200 dal corpo
illeggibile arriva in pratica dopo che la route ha salvato domanda e risposta; togliere la bolla e
rimettere il testo porta a un reinvio e a una domanda doppia in cronologia.
Correzione: separare i due casi: con `res.redirected` mostrare l'errore generico e chiamare
`restoreUnsent()`; con `res.ok && data === null` mostrare l'errore generico senza `restoreUnsent()`
(la bolla resta, come per 502/504). Aggiornare il commento sopra `res.json()` di conseguenza.
Accettazione: con `res.ok` e corpo non JSON la bolla dell'utente resta e il campo non viene riempito;
con `res.redirected` il comportamento e' invariato; typecheck e lint passano.

File ammessi: `web/components/ChatPanel.tsx`.

Ordine di esecuzione: T3.

Criteri di accettazione: quelli di T3 sopra; i rami `!res.ok` e `catch` restano invariati.
