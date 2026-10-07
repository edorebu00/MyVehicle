# Scansione notturna dei bug — MyVehicle

Data scan: 2026-10-07 01:24 (UTC)
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
Da ieri in `main` sono entrate le PR #73 (cronologia della chat senza testi di riserva), #86 (limiti di lunghezza dei campi
liberi e marca/modello vuoti), #87 (e-up! sotto Up!) e #88 (aggiornamento del catalogo del 07/10). I1, M1 e M2 dello scan
precedente risultano risolti in `main`. Le route sotto `web/app/api/agent/*` mantengono autenticazione e limite d'uso
condiviso (conteggio delle righe salvate per utente).
PR aperte al momento dello scan: #68 (solo `supabase/`).

Ogni problema qui sotto e' stato verificato leggendo di persona il codice indicato.

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante nuovo trovato.

## Minore

### M1 — Pagina documenti: i vecchi testi di riserva salvati appaiono ancora come risposte
File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:27-34`, `web/app/api/agent/chat/route.ts:46-53`
Dalla PR #73 il testo "nessuna risposta" non viene piu' salvato e le righe gia' salvate vengono scartate solo quando si
compone il prompt (`EMPTY_REPLY_TEXTS`). La pagina documenti carica gli ultimi 50 `chat_messages` senza filtro, quindi le
righe salvate prima della PR #73 continuano a comparire come bolle dell'assistente, mentre quelle nuove spariscono al
ricaricamento: la cronologia mostrata non e' coerente.
Proposta: spostare `EMPTY_REPLY_TEXTS` in un modulo condiviso di `web/lib/` e filtrare con lo stesso insieme i messaggi dell'assistente caricati dalla pagina.

### M2 — Ricerca IA: senza marca e modello si perde anche anno e motorizzazione
File: `web/app/api/agent/search/route.ts:411`
La condizione `if (make || model)` introdotta con il limite di lunghezza scarta l'intero contesto del veicolo quando marca e
modello sono vuoti (possibile per i veicoli creati prima del controllo aggiunto con la PR #86), anche se anno e motore ci
sono: prima venivano comunque inviati al modello.
Proposta: costruire il contesto se c'e' almeno uno tra marca, modello e motorizzazione.

### M3-M6 — Invariati (decisioni del proprietario, vedi U3-U6)
- Chat: il testo di riserva appare come una vera risposta e sparisce ricaricando la pagina (`web/components/ChatPanel.tsx`) = U6.
- Chat: una risposta vuota del modello principale non passa al modello di riserva (`web/app/api/agent/chat/route.ts`) = U5.
- API senza sessione: il middleware risponde con un messaggio in inglese (`web/middleware.ts`) = U3.
- Chat: dopo un invio dall'esito incerto la cronologia mostrata e' diversa da quella salvata (`web/components/ChatPanel.tsx`) = U4.

## Rilievi esaminati e non trasformati in task
- Ricerca automatica con campi liberi molto lunghi (`veicoli/[id]/page.tsx:76`): marca+modello+motore possono superare i 200
  caratteri della ricerca e la coda viene tagliata. Serve testo libero di quasi 80 caratteri in tutti e tre i campi; il taglio
  e' deterministico, quindi il riuso delle ricerche salvate continua a funzionare: nessun task.
- `reply.trim()` nella chat (`chat/route.ts:268`): toglie anche l'eventuale rientro della prima riga; la chat mostra testo
  semplice, l'effetto e' trascurabile.
- `clampText` taglia per unita' UTF-16 e puo' spezzare un emoji: servirebbe un valore di oltre 80 caratteri inserito fuori dal
  modulo; non riprodotto.
- `EMPTY_REPLY_TEXTS` elenca a mano le tre lingue: le righe di riserva non vengono piu' salvate, quindi una lingua futura non
  avrebbe righe vecchie da scartare.
- Limite 80 ripetuto nel modulo e nella route, e-up! descritta sia in `vehicleData.ts` sia in `engineExtensions.ts`:
  duplicazioni, non difetti osservati.

## Richiede intervento umano
- U1 — Il limite d'uso condiviso si appoggia a righe che l'account puo' rimuovere: serve una struttura dedicata in `supabase/` (invariato).
- U2 — La pausa del riquadro motorsport vive nella memoria di istanza e ha una durata fissa (`web/lib/motorsport.ts`), invariato.
- U3 — Risposta del middleware per le API senza sessione: serve il via libera del proprietario.
- U4 — Rendere idempotente l'invio della chat: serve una migrazione.
- U5 — Decidere se una risposta vuota del modello principale debba tentare il modello di riserva: e' una scelta di costo.
- U6 — Decidere come mostrare il testo di riserva nel client (bolla o messaggio d'errore).
- U7 — Decidere se, scelto "Altro", il motore scritto a mano debba essere obbligatorio.
- U8 — Decidere se gli anni vadano limitati al periodo della motorizzazione (anche con "Altro") o offerti sempre per intero.
- U9 — Confermare l'anno di inizio di Opel Mokka GSE e Omoda 7 (2025 o 2026).
- U10 — Confermare e aggiungere le motorizzazioni mancanti di Audi Q6 e-tron (trazione posteriore) e A6 e-tron (versione base).
- U11 — Portare anche a livello di database i limiti di lunghezza e il controllo di marca/modello non vuoti dei campi di
  `vehicles` (oggi solo nel modulo): migrazione in `supabase/`.
- U12 — Civic Type R (`web/lib/vehicleData.ts:1399-1400`): dopo la PR #88 nessuna motorizzazione copre il 2022 (320cv fino al
  2021, 329cv dal 2023). Confermare se l'anno 2022 vada coperto (ultime immatricolazioni FK8 o prime FL5).
- U13 — Valutare una pulizia una tantum delle righe di riserva gia' salvate in `chat_messages` (operazione sui dati).

## Gia' in PR
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
