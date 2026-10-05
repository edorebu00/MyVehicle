# Scansione notturna dei bug — MyVehicle

Data scan: 2026-10-05 (UTC)
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
Da ieri in `main` e' entrata solo la PR #82 (Opel Mokka elettrica 156cv e chiusura della 136cv al 2023, ex M1 del 04/10).
Nessuna route sotto `web/app/api/`, middleware o componente della chat e' cambiato: per quelle parti valgono le
conclusioni degli scan precedenti (riconfermate: autenticazione presente in tutte le route `app/api/agent/*`).
PR aperte al momento dello scan: #73 (lavoratore 4, `web/app/api/agent/chat/route.ts`), #68 (solo `supabase/`).

Ogni problema qui sotto e' stato verificato leggendo di persona il codice indicato.

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante nuovo.

## Minore

Il menu degli anni offre solo gli anni della motorizzazione scelta: un intervallo sbagliato nel catalogo impedisce a un
proprietario reale di registrare la propria auto (o lo costringe a scegliere un motore errato, che poi arriva al
contesto della ricerca IA in `app/api/agent/search/route.ts:408`).

### M1 — Nuovo veicolo: la targa non viene ripulita dagli spazi
File: `web/app/(dashboard)/veicoli/nuovo/page.tsx:132`
Marca, modello e motore vengono ripuliti con `trim()` (righe 44, 45, 130), la targa no (`plate: plate || null`). Una
targa di soli spazi viene salvata come stringa vuota visibile ("Targa:" seguito da spazi in `veicoli/[id]/page.tsx:89`)
invece di `null`, e una targa con spazi ai lati viene salvata con gli spazi.
Proposta: `plate: plate.trim() || null`.

### M2 — Catalogo: VW e-up! proposta solo dal 2016
File: `web/lib/vehicleData.ts:2525`
La e-up! e' in vendita dalla fine del 2013; chi ha una e-up! 2013-2015 non trova il proprio anno.
Proposta: `yearFrom: 2013`.

### M3 — Catalogo: Golf R senza motorizzazione per il 2018-2020
File: `web/lib/vehicleData.ts:2449-2450`
"2.0 TSI R 300cv" finisce nel 2017 e "2.0 TSI R 320cv" inizia nel 2021: la Golf 7.5 R (310cv, poi 300cv) non e'
selezionabile con il suo anno.
Proposta: portare "R 300cv" a `yearTo: 2020` e aggiungere "2.0 TSI R 310cv" 2017-2018.

### M4 — Catalogo: manca la prima BMW M135i (3.0, 2012-2016)
File: `web/lib/vehicleData.ts:881-882`
L'unica M135i e' la 2.0 dal 2019; la M135i F20 a sei cilindri (320cv, 2012-2016) non c'e'.
Proposta: aggiungere "M135i 3.0 320cv" con `yearFrom: 2012`, `yearTo: 2016`.

### M5 — Catalogo: nuova Lancia Ypsilon (2024) presente solo come HF
File: `web/lib/vehicleData.ts:1599-1604`
Per la nuova generazione c'e' solo "HF Elettrica 280cv"; mancano la Elettrica 156cv e la 1.2 Hybrid 100cv (dal 2024),
mentre le motorizzazioni della generazione precedente ("1.2 69cv", "1.0 Hybrid 70cv") restano aperte fino all'anno
corrente. Chi ha una Ypsilon 2024-2026 salva un motore che la sua auto non ha.
Proposta: chiudere le due vecchie a `yearTo: 2024` e aggiungere "Elettrica 156cv" e "1.2 Hybrid 100cv" dal 2024.

### M6-M9 — Invariati dagli scan precedenti
- Chat: il testo di riserva appare come una vera risposta e sparisce ricaricando la pagina (`web/components/ChatPanel.tsx:71-83`) = U6.
- Chat: una risposta vuota del modello principale non passa al modello di riserva (`web/app/api/agent/chat/route.ts:245-253`) = U5.
- API senza sessione: il middleware risponde con un messaggio in inglese (`web/middleware.ts:44-49`) = U3.
- Chat: dopo un invio dall'esito incerto la cronologia mostrata e' diversa da quella salvata (`web/components/ChatPanel.tsx:62-88`) = U4.

## Rilievi esaminati e non trasformati in task
- Opel Corsa "Elettrica 136cv" (`vehicleData.ts:1922`) e' ancora aperta fino all'anno corrente accanto alla 156cv.
  A differenza della Mokka, la 136cv e' rimasta in listino in alcuni mercati anche dopo il 2023: l'anno di chiusura
  non e' certo, quindi nessun task.
- Il menu degli anni limitato alla motorizzazione (`veicoli/nuovo/page.tsx:66`) rende bloccante ogni errore di
  catalogo; offrire sempre l'intervallo completo e' una scelta di prodotto (si aggiunge a U8).
- Le quattro funzioni che azzerano i campi a valle e i tre blocchi "select con Altro" ripetuti in
  `veicoli/nuovo/page.tsx` sono duplicazione, non difetti: nessun refactoring.
- Opel Mokka GSE e Omoda 7 dal 2026: gia' U9.

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

## Gia' in PR
- #73 (lavoratore 4): cronologia della chat senza testi di riserva e risposte di soli spazi.
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
