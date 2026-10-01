# Scansione notturna dei bug — MyVehicle

Data scan: 2026-10-01 (UTC)
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
La revisione approfondita si e' concentrata sulle modifiche entrate in `main` dopo lo scan precedente
(PR #70 e #71 dei lavoratori: `web/app/api/agent/chat/route.ts`, `web/lib/vehicleData.ts`; PR #72: `web/lib/vehicleData.ts`).
Nessun'altra route sotto `web/app/api/` e' cambiata.
PR aperte al momento dello scan: #68 (solo `supabase/`). PR dei lavoratori non unite: 0.

Ogni problema qui sotto e' stato verificato leggendo personalmente il codice indicato.
I rilievi M1, M2, M4 e M5 dello scan precedente sono stati corretti dalle PR #70 e #71.

Rilievi esaminati e scartati:
- Le nuove voci della PR #72 sono state scritte in `ENGINE_DATA` invece che in `lib/engineExtensions.ts`, contro quanto
  dice il commento di quel file. Le ultime PR di catalogo del proprietario fanno tutte cosi': e' la pratica attuale e non
  produce difetti visibili. Non e' un task.
- Le risposte troncate vengono comunque salvate in cronologia (`chat/route.ts:238-241`, `84-86`): scartarle o marcarle
  e' una scelta di prodotto, non un difetto certo.

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante trovato.

## Minore

### M1 — Chat: le righe salvate prima della PR #71 con il testo di riserva tornano al modello
File: `web/app/api/agent/chat/route.ts:190-207`

La PR #71 non salva piu' il testo "nessuna risposta" come risposta dell'assistente, ma le righe gia' salvate prima
(it/en/de, da `messages/*.json:453`) vengono ancora caricate in cronologia e mandate al modello come sue risposte.

Proposta: in `toAlternatingMessages` (o subito prima), scartare le righe `assistant` il cui testo, senza spazi iniziali
e finali, coincide con `apiErrors.emptyReply` in una delle lingue disponibili.

### M2 — Chat: una risposta fatta solo di spazi viene salvata e mostrata come bolla vuota
File: `web/app/api/agent/chat/route.ts:248, 252, 259, 269`

`if (reply)` e `reply || tErr("emptyReply")` considerano valida una risposta come `"\n\n"`. La riga viene salvata
(e scartata comunque alla richiesta dopo da `toAlternatingMessages`, che fa `trim()`) e il client mostra una bolla vuota
invece del testo di riserva.

Proposta: `reply = reply.trim()` prima del controllo.

### M3 — Catalogo: Golf GTI 245cv offerta dal 2013 e GTI 220/230cv assenti
File: `web/lib/vehicleData.ts:2419`

La Golf 7 GTI (2013-2017) aveva 220cv (230cv la Performance); i 245cv arrivano solo con il restyling 2017. Oggi chi ha una
GTI del 2013-2016 trova solo il motore 245cv.

Proposta: `yearFrom: 2017` per la 245cv e aggiungere "2.0 TSI GTI 220cv" e "2.0 TSI GTI Performance 230cv" (2013-2017).

### M4 — Catalogo: manca la Grandland GSe annunciata dal commit della PR #72
File: `web/lib/vehicleData.ts:1926-1930`

Il commit dice "Opel Astra/Grandland GSe", ma per la Grandland e' stata aggiunta la "Elettrica Dual Motor 325cv". La
Grandland GSe (plug-in 4x4 da 300cv, 2022-2024) resta assente.

Proposta: aggiungere `{ label: "GSe Plug-in Hybrid 4x4 300cv", yearFrom: 2022, yearTo: 2024 }`.

### M5 — Chat: il testo di riserva appare come una vera risposta e sparisce ricaricando la pagina
File: `web/components/ChatPanel.tsx:71-83`, `web/app/api/agent/chat/route.ts:269`

Dopo la PR #71 il testo di riserva non e' piu' salvato, ma il client lo mostra come una bolla dell'assistente: dopo un
ricaricamento sparisce e la domanda resta senza risposta. Mostrarlo come errore cambia il contratto della risposta: e'
una scelta (vedi U6).

### M6 — Chat: una risposta vuota del modello principale non passa al modello di riserva (invariato, = U5)
File: `web/app/api/agent/chat/route.ts:245-253`

### M7 — API senza sessione: messaggio in inglese dal middleware (invariato, = U3)
File: `web/middleware.ts:44-49`

### M8 — Chat: cronologia mostrata diversa da quella salvata dopo un invio dall'esito incerto (invariato, = U4)
File: `web/components/ChatPanel.tsx:62-88`, `web/app/api/agent/chat/route.ts`

## Richiede intervento umano

- U1 — Il limite d'uso condiviso si appoggia a righe che l'account puo' rimuovere: serve una struttura dedicata in
  `supabase/` (invariato; la PR #68 non tocca questo punto).
- U2 — Pausa del riquadro motorsport in memoria di istanza e di durata fissa (`web/lib/motorsport.ts`), invariato.
- U3 — Risposta del middleware per le API senza sessione (M7): serve il via libera del proprietario.
- U4 — Invio della chat idempotente (M8): serve una migrazione.
- U5 — Decidere se una risposta vuota del modello principale debba tentare il modello di riserva (M6): scelta di costo.
- U6 — Decidere come mostrare il testo di riserva nel client (bolla o messaggio d'errore) (M5).

## Gia' in PR

- #68 "Supabase: migrazione 0005 di rafforzamento della RLS" (solo `supabase/`): nessun rilievo di questo scan la duplica.
