Data (UTC): 2026-10-01

# Task della cascata notturna

Nessun task di rafforzamento questa notte. PR dei lavoratori aperte: 0.

## T1 — Chat: cronologia senza righe di riserva e risposte di soli spazi trattate come vuote
Gravita': Minore
File: `web/app/api/agent/chat/route.ts` (righe 50-67 `toAlternatingMessages`, 245-269)

Problema: (a) le righe `assistant` salvate prima della PR #71 con il testo di riserva (`apiErrors.emptyReply` in
`web/messages/it.json`, `en.json`, `de.json`, riga 453) vengono ancora mandate al modello come sue risposte;
(b) una risposta di soli spazi (es. `"\n\n"`) supera `if (reply)`, viene salvata e il client mostra una bolla vuota.

Correzione richiesta: (a) scartare dalla cronologia le righe con ruolo `assistant` il cui contenuto, dopo `trim()`,
e' uguale al testo `emptyReply` di una qualunque lingua disponibile (riusare i messaggi esistenti, senza ricopiare i
testi a mano se si possono importare); (b) applicare `trim()` alla risposta del modello (entrambi i rami) prima del
controllo `if (reply)` e del ripiego `reply || tErr("emptyReply")`.

Criterio di accettazione: una cronologia con una riga `assistant` uguale a "Non sono riuscito a generare una risposta."
(o alla versione en/de) non la include nei `messages` inviati al modello; una risposta `"  \n"` non viene salvata e il
client riceve il testo `emptyReply`; `npm run lint` e `npx tsc --noEmit` in `web/` passano.

## T2 — Catalogo: Golf GTI 2013-2017 e Grandland GSe
Gravita': Minore
File: `web/lib/vehicleData.ts` (Golf righe 2414-2425, Grandland righe 1926-1930)

Problema: la Golf GTI 245cv parte dal 2013, ma fino al 2017 la GTI aveva 220cv (230cv la Performance), che mancano; la
Grandland GSe plug-in 4x4 300cv (2022-2024), annunciata dal commit della PR #72, non e' stata aggiunta.

Correzione richiesta: Golf: `"2.0 TSI GTI 245cv"` con `yearFrom: 2017`; aggiungere
`{ label: "2.0 TSI GTI 220cv", yearFrom: 2013, yearTo: 2017 }` e
`{ label: "2.0 TSI GTI Performance 230cv", yearFrom: 2013, yearTo: 2017 }`. Grandland: aggiungere
`{ label: "GSe Plug-in Hybrid 4x4 300cv", yearFrom: 2022, yearTo: 2024 }`. Non toccare altre voci.

Criterio di accettazione: per una Golf del 2014 il selettore offre le GTI 220cv e 230cv e non la 245cv; per una Grandland
del 2023 compare la GSe 300cv; nessuna voce duplicata con `lib/engineExtensions.ts`; `npx tsc --noEmit` passa.

## Richiede intervento umano (NON assegnare)

- U1 — Limite d'uso condiviso appoggiato a righe rimovibili dall'account: serve una struttura dedicata in `supabase/`.
- U2 — Pausa del riquadro motorsport in memoria di istanza (`web/lib/motorsport.ts`).
- U3 — Messaggio in inglese del middleware per le API senza sessione (`web/middleware.ts:44-49`).
- U4 — Invio della chat idempotente: serve una migrazione.
- U5 — Risposta vuota del modello principale: tentare o no il modello di riserva (scelta di costo).
- U6 — Testo di riserva della chat mostrato come bolla o come errore nel client (`web/components/ChatPanel.tsx:71-83`).

## Gia' in PR

- #68 (solo `supabase/`): nessun task la duplica.
