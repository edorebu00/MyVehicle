# Scansione notturna dei bug — MyVehicle

Data scan: 2026-10-06 01:21 (UTC)
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
Da ieri in `main` sono entrate le PR #83 (targa ripulita dagli spazi), #84 (catalogo: e-up!, Golf R, M135i, Ypsilon)
e #85 (aggiornamento del catalogo del 06/10). Le route sotto `web/app/api/agent/*` non sono cambiate: autenticazione
e limite d'uso condiviso (conteggio delle righe salvate per utente) restano come negli scan precedenti.
PR aperte al momento dello scan: #73 (lavoratore 4, `web/app/api/agent/chat/route.ts`), #68 (solo `supabase/`).

Ogni problema qui sotto e' stato verificato leggendo di persona il codice indicato.

## Bloccante

Nessun problema bloccante trovato.

## Importante

### I1 — Rafforza il limite di lunghezza dei dati del veicolo usati nella ricerca IA
File: `web/app/api/agent/search/route.ts:406-408`, `web/app/(dashboard)/veicoli/nuovo/page.tsx` (campi di testo libero di marca, modello, motore e targa)
Marca, modello e motorizzazione del veicolo vengono inseriti cosi' come sono nel testo inviato al modello, senza limite
di lunghezza, mentre la ricerca stessa e' gia' limitata a 200 caratteri con `clampText`. Le colonne sono `text` senza
limiti e i campi del modulo non hanno `maxLength`: un valore molto lungo fa crescere il costo di ogni ricerca su quel veicolo.
Proposta: passare i tre campi da `clampText(..., limite)` prima di comporre `vehicleContext` e aggiungere `maxLength` agli input liberi del modulo.

## Minore

### M1 — Nuovo veicolo: marca o modello di soli spazi vengono salvati vuoti
File: `web/app/(dashboard)/veicoli/nuovo/page.tsx:44-45, 106-136`
I campi "Altro" sono `required`, ma un valore di soli spazi supera il controllo del browser; dopo `trim()` diventa `""`
e `handleSubmit` inserisce comunque il veicolo (le colonne sono `not null`, ma la stringa vuota e' accettata): la scheda
mostra un nome vuoto e la ricerca IA riceve "auto  .".
Proposta: in `handleSubmit`, se `make` o `model` sono vuoti dopo il `trim()`, mostrare un errore e non inserire.

### M2 — Catalogo: la e-up! sotto "Up!" ha una sola motorizzazione per due generazioni di batteria
File: `web/lib/vehicleData.ts:2546` (in contrasto con `web/lib/engineExtensions.ts:133-136`)
"Elettrica e-up! 82cv" copre 2013-2023, ma dal 2019 la e-up! ha la batteria da 32,3 kWh e 83cv; lo stesso catalogo, sotto
"e-Up!", distingue gia' le due versioni. Chi sceglie "Up!" per una e-up! 2020-2023 salva una motorizzazione errata.
Proposta: sostituire la voce con "Elettrica 18,7 kWh 82cv" 2013-2019 ed "Elettrica 32,3 kWh 83cv" 2019-2023, come in `engineExtensions.ts`.

### M3-M6 — Invariati dagli scan precedenti (decisioni del proprietario, vedi U3-U6)
- Chat: il testo di riserva appare come una vera risposta e sparisce ricaricando la pagina (`web/components/ChatPanel.tsx:71-83`) = U6.
- Chat: una risposta vuota del modello principale non passa al modello di riserva (`web/app/api/agent/chat/route.ts:245-253`) = U5.
- API senza sessione: il middleware risponde con un messaggio in inglese (`web/middleware.ts:44-49`) = U3.
- Chat: dopo un invio dall'esito incerto la cronologia mostrata e' diversa da quella salvata (`web/components/ChatPanel.tsx:62-88`) = U4.

## Rilievi esaminati e non trasformati in task
- Golf R "300cv" 2014-2020 sovrapposta a "310cv" 2017-2018 (`vehicleData.ts:2469-2470`): e' corretto, la 7.5 R dopo il
  WLTP (2018-2020) e' tornata a 300cv; nel 2017-2018 le due versioni coesistono davvero.
- `handleSubmit` senza try/finally (`veicoli/nuovo/page.tsx:106`): i client Supabase restituiscono gli errori di rete come
  `{ error }` invece di lanciarli, quindi il pulsante bloccato non e' stato riprodotto: nessun task.
- Targa non normalizzata (maiuscole, trattini): e' una scelta di formato, non un difetto.
- Hyundai Ioniq 9 "Performance AWD 435cv" (`vehicleData.ts`): la potenza pubblicata varia tra le fonti; non verificabile con certezza.
- Audi Q6 e-tron e A6 e-tron: mancano le versioni a trazione posteriore o base; la potenza esatta va confermata (U10).

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
- U11 — Valutare un limite di lunghezza anche a livello di database per i campi di testo di `vehicles` (migrazione in `supabase/`).

## Gia' in PR
- #73 (lavoratore 4): cronologia della chat senza testi di riserva e risposte di soli spazi.
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
