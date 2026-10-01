Data (UTC): 2026-10-01

# Assegnazioni definitive della cascata notturna

## Accordo con l'agente 2

`cascade/SPLIT.md` non e' presente sul branch con la data di oggi: l'agente 2 non ha completato. La divisione qui sotto
e' stata costruita dall'agente 3 con gli stessi criteri, verificando direttamente i file sotto `web/`.

Verifiche:
- (a) Task assegnabili: T1 e T2. Ciascuno e' assegnato esattamente una volta (T1 al lavoratore 4, T2 al lavoratore 5).
- (b) Insiemi di file disgiunti: lavoratore 4 solo `web/app/api/agent/chat/route.ts`; lavoratore 5 solo
  `web/lib/vehicleData.ts`. Nessun file in comune.
- (c) Carico: due task piccoli e indipendenti, uno per lavoratore; il lavoratore 6 resta senza task (non ci sono altri
  task assegnabili e dividere T1 o T2 creerebbe file in comune).
- (d) Precisione: i task sono eseguibili cosi' come scritti. Chiarimenti aggiunti senza cambiarne il senso: in T1 il
  `trim()` va applicato una sola volta subito dopo il blocco `try/catch` (copre entrambi i rami, Anthropic e OpenAI);
  i testi `emptyReply` vanno importati dai file `web/messages/*.json` (il progetto ha `resolveJsonModule: true`),
  senza modificarli. In T2 la voce 245cv mantiene `yearTo: 2024`; cambia solo `yearFrom`. Verificato che
  `web/lib/engineExtensions.ts` non contiene voci per Golf GTI ne' per Grandland.
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file con l'intestazione
  "GENERATO DA"; nessuno richiede migrazioni, secret nuovi o scelte di design. Nessun task di rafforzamento questa notte.
- (f) PR aperte: solo #68, che modifica unicamente `supabase/migrations/0005_rls_hardening.sql`. Nessuna sovrapposizione.

Rispetto a TASKS.md non e' stato tolto ne' spostato alcun task.

## Lavoratore 4

Branch: `claude/worker-4-2026-10-01`

File ammessi (gli unici modificabili):
- `web/app/api/agent/chat/route.ts`

(`web/messages/it.json`, `en.json`, `de.json` possono essere importati in sola lettura, NON modificati.)

Ordine di esecuzione: T1.

### T1 — Chat: cronologia senza righe di riserva e risposte di soli spazi trattate come vuote
Gravita': Minore
File: `web/app/api/agent/chat/route.ts` (righe 50-67 `toAlternatingMessages`, 245-269)

Problema: (a) le righe `assistant` salvate prima della PR #71 con il testo di riserva (`apiErrors.emptyReply` in
`web/messages/it.json`, `en.json`, `de.json`, riga 453) vengono ancora mandate al modello come sue risposte;
(b) una risposta di soli spazi (es. `"\n\n"`) supera `if (reply)`, viene salvata e il client mostra una bolla vuota.

Correzione richiesta: (a) scartare dalla cronologia le righe con ruolo `assistant` il cui contenuto, dopo `trim()`,
e' uguale al testo `emptyReply` di una qualunque lingua disponibile (riusare i messaggi esistenti, senza ricopiare i
testi a mano se si possono importare); (b) applicare `trim()` alla risposta del modello (entrambi i rami) prima del
controllo `if (reply)` e del ripiego `reply || tErr("emptyReply")`.

Precisazione dell'agente 3: per (b) basta `reply = reply.trim();` subito dopo il blocco `try/catch`, prima di
`if (reply)`. Per (a) l'insieme dei testi si costruisce importando `apiErrors.emptyReply` dai tre file JSON.

Criteri di accettazione: una cronologia con una riga `assistant` uguale a "Non sono riuscito a generare una risposta."
(o alla versione en/de) non la include nei `messages` inviati al modello; una risposta `"  \n"` non viene salvata e il
client riceve il testo `emptyReply`; `npm run lint` e `npx tsc --noEmit` in `web/` passano; nessun altro file modificato.

## Lavoratore 5

Branch: `claude/worker-5-2026-10-01`

File ammessi (gli unici modificabili):
- `web/lib/vehicleData.ts`

Ordine di esecuzione: T2.

### T2 — Catalogo: Golf GTI 2013-2017 e Grandland GSe
Gravita': Minore
File: `web/lib/vehicleData.ts` (Golf righe 2414-2425, Grandland righe 1926-1930)

Problema: la Golf GTI 245cv parte dal 2013, ma fino al 2017 la GTI aveva 220cv (230cv la Performance), che mancano; la
Grandland GSe plug-in 4x4 300cv (2022-2024), annunciata dal commit della PR #72, non e' stata aggiunta.

Correzione richiesta: Golf: `"2.0 TSI GTI 245cv"` con `yearFrom: 2017`; aggiungere
`{ label: "2.0 TSI GTI 220cv", yearFrom: 2013, yearTo: 2017 }` e
`{ label: "2.0 TSI GTI Performance 230cv", yearFrom: 2013, yearTo: 2017 }`. Grandland: aggiungere
`{ label: "GSe Plug-in Hybrid 4x4 300cv", yearFrom: 2022, yearTo: 2024 }`. Non toccare altre voci.

Precisazione dell'agente 3: la voce 245cv mantiene `yearTo: 2024`. Inserire le due nuove GTI subito prima della 245cv
e la GSe dopo "Hybrid Plug-in 224cv".

Criteri di accettazione: per una Golf del 2014 il selettore offre le GTI 220cv e 230cv e non la 245cv; per una Grandland
del 2023 compare la GSe 300cv; nessuna voce duplicata con `lib/engineExtensions.ts`; `npx tsc --noEmit` passa; nessun
altro file modificato.

## Lavoratore 6

Nessun task assegnato.

## Richiede intervento umano (NON assegnato)

- U1 — Limite d'uso condiviso: serve una struttura dedicata in `supabase/`.
- U2 — Pausa del riquadro motorsport in memoria di istanza (`web/lib/motorsport.ts`).
- U3 — Messaggio del middleware per le API senza sessione (`web/middleware.ts`).
- U4 — Invio della chat idempotente: serve una migrazione.
- U5 — Risposta vuota del modello principale e modello di riserva: scelta di costo.
- U6 — Presentazione del testo di riserva nel client (`web/components/ChatPanel.tsx`).

## Gia' in PR

- #68 (solo `supabase/`): nessun task la duplica.
