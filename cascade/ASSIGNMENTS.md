Data (UTC): 2026-09-27

Divisione definitiva e vincolante dei task di `cascade/TASKS.md` fra i lavoratori 4, 5 e 6.
Ogni lavoratore modifica SOLO i file elencati nella propria sezione.

## Accordo con l'agente 2

Verifica indipendente svolta leggendo i file sotto `web/`:

- (a) Copertura: T1, T2, T3 e T4 sono assegnati ciascuno esattamente una volta; U1 e U2 non sono assegnati.
- (b) File disgiunti: gruppo 4 = `web/middleware.ts`, `web/components/ChatPanel.tsx`; gruppo 5 =
  `web/lib/motorsport.ts`; gruppo 6 = `web/lib/engineExtensions.ts`, `web/lib/vehicleData.ts`. Nessun file compare in due gruppi.
- (c) Carico: 1 / 1 / 2 task. Accettabile: T3 e T4 sono correzioni di una riga ciascuna, T1 e T2 hanno logica.
- (d) Precisione: i riferimenti di riga sono stati controllati sul codice attuale e corrispondono
  (`web/middleware.ts:44-49`, `web/lib/motorsport.ts:96-107`, `web/lib/engineExtensions.ts:526`,
  `web/lib/vehicleData.ts:2006`). Il commento di `web/components/ChatPanel.tsx` da aggiornare e' alle righe 56-61.
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file 'GENERATO DA';
  nessuno richiede migrazioni, secret nuovi o scelte di design. U1 e U2 restano a intervento umano.
  Per T1 ho verificato che tutte le route sotto `web/app/api/` (`agent/chat`, `agent/search`,
  `agent/process-document`) controllano gia' la sessione e rispondono 401 tradotto: lasciar proseguire la
  richiesta dal middleware non toglie protezione. Ho aggiunto a T1 un criterio che lo ricontrolla.
- (f) PR aperte: nessuna (verificato al momento dell'assegnazione). Nessun task escluso.

Risposte ai 'Punti da confermare all'agente 3':
- Commento in `ChatPanel.tsx`: INCLUSO. Dopo T1 una chiamata `/api/agent/chat` con sessione scaduta non
  viene piu' rimandata a /login ma riceve 401 JSON dalla route; il commento diventerebbe inesatto. Si cambia
  solo il commento, non la logica (il ramo `res.redirected` resta).
- Accorpamento T3+T4 nel gruppo 6: CONFERMATO.
- File disgiunti fra i gruppi: CONFERMATO.

Modifiche rispetto alla proposta dell'agente 2: nessun cambio di assegnazione. Aggiunti a T1 il criterio sulle
route API e il limite "solo commento" per `ChatPanel.tsx`; precisato per T3 che l'oggetto `Toyota` in
`engineExtensions.ts` contiene altre voci e quindi resta.

## Richiede intervento umano

- U1 e U2 (vedi `cascade/TASKS.md`): richiedono una struttura condivisa o una migrazione in `supabase/`. Non assegnati.

## Lavoratore 4

Branch: `claude/worker-4-2026-09-27`

### T1 — Le API senza sessione rispondono con il messaggio tradotto della route
Gravita': Minore
File: `web/middleware.ts:44-49`
Problema: per i percorsi `/api/` il middleware risponde 401 con il testo fisso inglese "Not authenticated";
i client (`web/components/GlobalSearch.tsx:41-44`, `web/components/ChatPanel.tsx:66-67`) lo mostrano cosi'
com'e', quindi chi usa l'app in italiano o tedesco con la sessione scaduta vede un messaggio in inglese. La
risposta creata da zero non porta inoltre i cookie che il client Supabase ha scritto su `response` durante
`getUser`. Ogni route in `web/app/api/agent/*` verifica gia' l'utente e risponde 401 JSON tradotto
(`tErr("notAuthenticated")`).
Correzione richiesta: nel ramo `/api/` restituire `response` (lasciar proseguire la richiesta) invece di
`NextResponse.json(...)`, con un commento che spiega che ogni route API fa il proprio controllo e risponde
401 JSON nella lingua dell'utente. Aggiornare il commento in `web/components/ChatPanel.tsx:56-60` se cita
ancora il rinvio a /login per sessione scaduta. Non toccare il comportamento per le pagine (rinvio a /login).
Criterio di accettazione: in `web/middleware.ts` non compare piu' la stringa "Not authenticated"; per
`/api/*` senza utente il middleware restituisce `response`; le tre route in `web/app/api/agent/*` contengono
ancora il controllo `getUser` con `tErr("notAuthenticated")`; `npx tsc --noEmit` e `npm run lint` in `web/` passano.

File ammessi (gli unici modificabili):
- `web/middleware.ts`
- `web/components/ChatPanel.tsx` (solo il commento alle righe 56-61; nessuna riga di codice)

Ordine di esecuzione: 1) prima di modificare, verificare che OGNI `route.ts` sotto `web/app/api/` controlli
`getUser` e risponda 401 prima di qualsiasi altra operazione; se una route non lo fa, NON applicare T1 e
segnalarlo nella descrizione della PR/riepilogo; 2) `web/middleware.ts`; 3) commento in `ChatPanel.tsx`.

Criteri di accettazione aggiuntivi: il ramo delle pagine (rinvio a /login) e il rinvio da /login e /registrati
a /dashboard restano identici; `git diff --stat` mostra solo i due file ammessi.

## Lavoratore 5

Branch: `claude/worker-5-2026-09-27`

### T2 — Riquadro motorsport: una risposta troncata non finisce in cache come elenco vuoto
Gravita': Minore
File: `web/lib/motorsport.ts:96-107`
Problema: se la risposta si ferma per `max_tokens` mentre il modello scrive l'input di `submit_briefing`,
il blocco esiste ma l'input e' parziale e senza array `news`; `extractBriefing` restituisce `{ news: [] }`
senza errore e `unstable_cache` lo conserva per 24 ore.
Correzione richiesta: in `extractBriefing` lanciare l'errore (stesso formato di quello esistente, con lo
`stop_reason`) anche quando `stopReason === "max_tokens"` o quando `input.news` non e' un array; un
`submit_briefing` completo con `news: []` resta un risultato valido. Aggiornare il commento alle righe 101-103.
Criterio di accettazione: con `stopReason` "max_tokens" oppure con input `{}` la funzione lancia; con
input `{ news: [] }` e `stopReason` "tool_use"/"end_turn" restituisce `{ news: [] }`; `npx tsc --noEmit` e
`npm run lint` in `web/` passano.

File ammessi (gli unici modificabili):
- `web/lib/motorsport.ts` (solo la funzione `extractBriefing` e il suo commento)

Ordine di esecuzione: unico task.

Criteri di accettazione aggiuntivi: la logica di pausa dopo un tentativo non riuscito (`FAILURE_PAUSE_MS`,
righe ~184-212) non viene modificata (e' il rilievo U2, riservato all'intervento umano); `git diff --stat`
mostra solo il file ammesso.

## Lavoratore 6

Branch: `claude/worker-6-2026-09-27`

### T3 — Toyota bZ4X: togliere la motorizzazione doppia dal menu
Gravita': Minore
File: `web/lib/engineExtensions.ts:526`
Problema: `ENGINE_DATA` (`web/lib/vehicleData.ts:2323-2326`) ha "Elettrica 71.4 kWh 204cv" e "Elettrica 72.8 kWh
AWD 218cv"; `ENGINE_EXTENSIONS` ha anche "Elettrica 71 kWh 204cv", che e' la stessa versione con un'altra
etichetta. `getEngineVariants` unisce le due liste scartando solo le etichette identiche, quindi il menu
mostra tre voci.
Correzione richiesta: rimuovere la voce `bZ4X` da `web/lib/engineExtensions.ts` (se resta vuoto l'oggetto
Toyota, rimuovere anche quello, seguendo lo stile del file).
Criterio di accettazione: `getEngineVariants("auto", "Toyota", "bZ4X")` restituisce esattamente le due
voci di `ENGINE_DATA`; `grep -n bZ4X web/lib/engineExtensions.ts` non trova nulla; `npx tsc --noEmit` passa.

Nota dell'agente 3: l'oggetto `Toyota` in `engineExtensions.ts` contiene anche altri modelli (es. "GR Yaris",
"Land Cruiser Prado"), quindi va rimossa solo la riga `bZ4X` e l'oggetto resta.

### T4 — Peugeot e-3008 Dual Motor: correggere batteria e potenza
Gravita': Minore
File: `web/lib/vehicleData.ts:2006`
Problema: la voce "Elettrica Dual Motor 98 kWh 320cv" non corrisponde alla versione reale: la e-3008 Dual
Motor a trazione integrale ha la batteria da 73 kWh e 325cv (la 98 kWh e' la Long Range a un motore, gia'
presente come "Elettrica 98 kWh 230cv"). L'etichetta viene usata dalla ricerca IA e dalla chat.
Correzione richiesta: cambiare l'etichetta in "Elettrica Dual Motor 73 kWh 325cv", lasciando invariati gli anni.
Criterio di accettazione: `grep -n "Dual Motor" web/lib/vehicleData.ts` mostra per la e-3008 solo
"Elettrica Dual Motor 73 kWh 325cv"; nessun'altra riga del file cambia.

File ammessi (gli unici modificabili):
- `web/lib/engineExtensions.ts` (solo la riga `bZ4X`)
- `web/lib/vehicleData.ts` (solo la riga 2006)

Ordine di esecuzione: T3, poi T4 (indipendenti).

Criteri di accettazione aggiuntivi: il diff complessivo e' di una riga rimossa in `engineExtensions.ts` e una
riga cambiata in `vehicleData.ts`; `npx tsc --noEmit` in `web/` passa.
