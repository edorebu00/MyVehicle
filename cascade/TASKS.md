Data (UTC): 2026-10-06

# Task della notte

## T1 — Limita la lunghezza dei dati del veicolo nel contesto della ricerca IA (rafforzamento)
Gravita': Importante
File: `web/app/api/agent/search/route.ts:404-409`; `web/app/(dashboard)/veicoli/nuovo/page.tsx` (input liberi di marca, modello, motore e targa)
Problema: `make`, `model` ed `engine_code` del veicolo entrano nel testo inviato al modello senza limite di lunghezza
(la ricerca invece e' gia' tagliata con `clampText`), e il modulo non pone limiti ai campi di testo libero.
Correzione: in `search/route.ts` passare i tre campi da `clampText` (da `@/lib/validation`) con una costante dedicata
(es. `MAX_VEHICLE_FIELD_CHARS = 80`) prima di comporre `vehicleContext`, omettendo un campo che diventa null; nel modulo
aggiungere `maxLength` coerente agli input liberi (marca, modello, motore, targa).
Accettazione: `vehicleContext` non puo' contenere un campo del veicolo piu' lungo della costante; gli input liberi del
modulo hanno `maxLength`; `npm run lint` e `npx tsc --noEmit` in `web/` passano.

## T2 — Nuovo veicolo: non salvare marca o modello vuoti dopo il trim
Gravita': Minore
File: `web/app/(dashboard)/veicoli/nuovo/page.tsx:106-136`
Problema: un valore di soli spazi nei campi "Altro" supera `required`, diventa `""` dopo `trim()` e il veicolo viene
salvato con marca o modello vuoti.
Correzione: all'inizio di `handleSubmit`, se `make` o `model` sono vuoti, impostare un errore tradotto (nuova chiave
in `messages/it.json`, `en.json`, `de.json` sotto `vehicleNew`) e uscire senza chiamare Supabase.
Accettazione: con marca o modello di soli spazi non parte alcun insert e appare un messaggio d'errore nelle tre lingue;
lint e typecheck passano.

## T3 — Catalogo: separa le due versioni della e-up! sotto "Up!"
Gravita': Minore
File: `web/lib/vehicleData.ts:2546`
Problema: "Elettrica e-up! 82cv" copre 2013-2023, ma dal 2019 la e-up! ha 32,3 kWh e 83cv; `web/lib/engineExtensions.ts:133-136`
distingue gia' le due versioni.
Correzione: sostituire la voce con "Elettrica 18,7 kWh 82cv" (2013-2019) ed "Elettrica 32,3 kWh 83cv" (2019-2023).
Accettazione: sotto "Up!" una e-up! del 2021 propone solo la versione da 83cv e una del 2015 solo quella da 82cv; typecheck passa.

## Richiede intervento umano (non assegnare)
- U1 — Struttura dedicata in `supabase/` per il limite d'uso condiviso.
- U2 — Pausa del riquadro motorsport in memoria di istanza con durata fissa (`web/lib/motorsport.ts`).
- U3 — Risposta del middleware per le API senza sessione.
- U4 — Invio della chat idempotente (migrazione).
- U5 — Modello di riserva per risposte vuote (scelta di costo).
- U6 — Visualizzazione del testo di riserva nella chat.
- U7 — Motore obbligatorio con "Altro".
- U8 — Intervallo degli anni con o senza motorizzazione.
- U9 — Anno di inizio di Opel Mokka GSE e Omoda 7.
- U10 — Motorizzazioni mancanti di Audi Q6 e-tron e A6 e-tron (potenze da confermare).
- U11 — Limite di lunghezza a livello di database per i campi di `vehicles` (migrazione).

## Gia' in PR
- #73: cronologia della chat (testi di riserva, risposte di soli spazi).
- #68: migrazione di rafforzamento della RLS.
