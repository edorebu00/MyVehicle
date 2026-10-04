# Scansione notturna dei bug — MyVehicle

Data scan: 2026-10-04 (UTC)
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
Da ieri in `main` sono entrate la PR #79 (motore scritto a mano ripulito dagli spazi), la PR #80 (doppioni Smart/Leapmotor
rimossi e anni della VW Up! chiusi) e la PR #81 (Jaecoo 5/8, Omoda 7/9, Leapmotor B10, Abarth 600e, Opel Mokka GSE).
Nessuna route sotto `web/app/api/`, middleware o componente della chat e' cambiato: per quelle parti valgono le
conclusioni degli scan precedenti.
PR aperte al momento dello scan: #73 (lavoratore 4, `web/app/api/agent/chat/route.ts`), #68 (solo `supabase/`).

Ogni problema qui sotto e' stato verificato leggendo di persona il codice indicato.
M1, M2 e M3 dello scan del 03/10 sono stati corretti dalle PR #79 e #80. Il merge della PR #81 non ha creato marche
doppie in `ENGINE_DATA` e non ha reintrodotto doppioni: Leapmotor B10 esiste solo in `vehicleData.ts`, C10/T03 solo in
`engineExtensions.ts`.

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante nuovo.

## Minore

### M1 — Catalogo: per l'Opel Mokka elettrica esiste solo la versione da 136cv, proposta fino all'anno corrente
File: `web/lib/vehicleData.ts:1939`

La voce "Elettrica 136cv" ha `yearTo: null`. Dal 2023 la Mokka elettrica e' venduta con batteria da 54 kWh e 156cv, ma
quella versione non e' nel catalogo. Chi ha una Mokka elettrica 2023-2026 puo' scegliere solo la 136cv: viene salvato il
motore sbagliato, che poi arriva anche al contesto della ricerca IA (`app/api/agent/search/route.ts:408`).

Proposta: `yearTo: 2023` per "Elettrica 136cv" e nuova voce "Elettrica 54 kWh 156cv" (`yearFrom: 2023`, `yearTo: null`).

### M2-M5 — Invariati dagli scan precedenti
- Chat: il testo di riserva appare come una vera risposta e sparisce ricaricando la pagina (`web/components/ChatPanel.tsx:71-83`) = U6.
- Chat: una risposta vuota del modello principale non passa al modello di riserva (`web/app/api/agent/chat/route.ts:245-253`) = U5.
- API senza sessione: il middleware risponde con un messaggio in inglese (`web/middleware.ts:44-49`) = U3.
- Chat: dopo un invio dall'esito incerto la cronologia mostrata e' diversa da quella salvata (`web/components/ChatPanel.tsx:62-88`) = U4.

## Rilievi esaminati e non trasformati in task
- Opel Mokka GSE (`vehicleData.ts:1940`) e Omoda 7 (`vehicleData.ts:440`) partono dal 2026. Secondo fonti generali i
  primi esemplari sono arrivati nel 2025; con quelle motorizzazioni l'anno 2025 non si puo' scegliere. La data e' stata
  scritta dal proprietario nella PR #81 e non si puo' verificare dal codice: va confermata (U9).
- Il commento in testa a `lib/catalogueSweep.ts:3-8` dice che quei modelli non hanno motorizzazioni, ma Jaecoo 5/8,
  Omoda 7/9, Leapmotor B10 e Abarth 600e ora le hanno in `ENGINE_DATA`. Il comportamento e' corretto (`getEngineVariants`
  non dipende dalla lista di provenienza), solo il commento e' impreciso: non e' un difetto funzionale.
- Le motorizzazioni Leapmotor sono di nuovo divise in due file (B10 in `vehicleData.ts`, C10/T03 in `engineExtensions.ts`).
  Oggi non ci sono doppioni: spostare B10 sarebbe solo riorganizzazione.
- `CURRENT_YEAR` e' calcolato all'avvio del modulo (`veicoli/nuovo/page.tsx`). Ha effetti solo a cavallo di capodanno o
  con l'orologio del dispositivo indietro, quindi e' un caso marginale.
- Con la voce "Altro" il motore non e' obbligatorio e gli anni coprono l'intero intervallo: sono scelte di prodotto (U7, U8).

## Richiede intervento umano
- U1 — Il limite d'uso condiviso si appoggia a righe che l'account puo' rimuovere: serve una struttura dedicata in `supabase/` (invariato).
- U2 — La pausa del riquadro motorsport vive nella memoria di istanza e ha una durata fissa (`web/lib/motorsport.ts`), invariato.
- U3 — Risposta del middleware per le API senza sessione: serve il via libera del proprietario.
- U4 — Rendere idempotente l'invio della chat: serve una migrazione.
- U5 — Decidere se una risposta vuota del modello principale debba tentare il modello di riserva: e' una scelta di costo.
- U6 — Decidere come mostrare il testo di riserva nel client (bolla o messaggio d'errore).
- U7 — Decidere se, scelto "Altro", il motore scritto a mano debba essere obbligatorio.
- U8 — Decidere se, scelto "Altro", gli anni vadano limitati al periodo coperto dalle motorizzazioni del modello.
- U9 — Confermare l'anno di inizio di Opel Mokka GSE e Omoda 7 (2025 o 2026).

## Gia' in PR
- #73 (lavoratore 4): cronologia della chat senza testi di riserva e risposte di soli spazi.
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
