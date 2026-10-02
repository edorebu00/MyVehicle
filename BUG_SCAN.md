# Scansione notturna dei bug — MyVehicle

Data scan: 2026-10-02 01:20 (UTC)
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
Da ieri in `main` sono entrate solo modifiche al catalogo (`web/lib/vehicleData.ts`, PR #74 e #75). Nessuna route
sotto `web/app/api/`, componente o middleware e' cambiato: per quelle parti valgono le conclusioni dello scan precedente.
La revisione si e' concentrata sulle voci nuove del catalogo e sul modulo che le usa
(`web/app/(dashboard)/veicoli/nuovo/page.tsx`).
PR aperte al momento dello scan: #73 (lavoratore 4, `web/app/api/agent/chat/route.ts`), #68 (solo `supabase/`).

Ogni problema qui sotto e' stato verificato leggendo di persona il codice indicato.
I rilievi M3 e M4 dello scan precedente (Golf GTI 220/230cv, Grandland GSe) sono stati corretti dalla PR #74.
M1 e M2 sono coperti dalla PR #73, ancora aperta.

## Bloccante

Nessun problema bloccante trovato.

## Importante

### I1 — Nuovo veicolo: il menu del motore non ha la voce "Altro", quindi ogni lacuna del catalogo obbliga a una scelta sbagliata
File: `web/app/(dashboard)/veicoli/nuovo/page.tsx:280-296` (menu), `57-67` (anni), `15-20` (convenzione `OTHER`)

Se un modello ha motorizzazioni in catalogo, il campo motore e' un `<select required>` senza voce "Altro". Gli anni
proposti seguono poi `yearFrom`/`yearTo` della voce scelta. Chi ha un motore non in elenco non puo' salvare il veicolo
senza scegliere un'etichetta sbagliata, che limita anche gli anni e finisce in `engine_code` e nella ricerca IA.
Marca e modello hanno gia' la voce "Altro (non in elenco)" (`OTHER`), e il commento in testa al file spiega proprio
che bloccare la scelta alle sole voci in elenco esclude dei veicoli: il campo motore non segue questa convenzione.
Gli scan del 25/09, del 26/09 e del 01/10 hanno corretto il catalogo voce per voce; il difetto di fondo resta.

Proposta: aggiungere la voce `OTHER` al menu del motore; se scelta, mostrare il campo libero gia' usato quando
il modello non ha motorizzazioni in catalogo, e proporre l'intervallo di anni completo.

## Minore

### M1 — Catalogo: "GLB45 S AMG 421cv" e' un modello che non esiste
File: `web/lib/vehicleData.ts:1773` (PR #75)

Mercedes-AMG non ha mai prodotto una GLB 45 S: l'unica GLB AMG e' la GLB 35 4MATIC (2.0 Turbo, 306cv, dal 2019).
Chi ha una GLB 35 trova solo la voce inesistente da 421cv, che viene salvata e passata alla ricerca IA.

Proposta: sostituirla con `{ label: "GLB35 AMG 2.0 Turbo 306cv", yearFrom: 2019, yearTo: null }`.

### M2 — Catalogo: manca la Golf 7.5 GTI da 230cv (2017-2020) e la GTI Clubsport 2016
File: `web/lib/vehicleData.ts:2423-2427`

Dopo la PR #74 l'unica voce da 230cv e' la "GTI Performance 230cv", che finisce nel 2017. La GTI standard del
restyling 2017-2020 aveva 230cv: chi ha una GTI del 2018 non puo' indicare il suo anno con la potenza giusta. Manca
anche la Golf 7 GTI Clubsport 265cv (2016-2017): l'unica voce da 265cv e' la Golf 8.5, proposta solo dal 2024.

Proposta: aggiungere `"2.0 TSI GTI 230cv"` (2017-2020) e `"2.0 TSI GTI Clubsport 265cv"` (2016-2017).

### M3 — Catalogo: Grandland Hybrid4 300cv 2020-2022 assente, GSe proposta dal 2022
File: `web/lib/vehicleData.ts:1932`

La Grandland X Hybrid4 (stesso sistema plug-in 4x4 da 300cv) e' stata venduta dal 2020 al 2022 e non ha una voce.
La GSe e' in vendita dal 2023. Chi ha una Hybrid4 del 2020 o 2021 puo' scegliere solo la GSe, che non propone il suo anno.

Proposta: aggiungere `"Hybrid4 Plug-in 4x4 300cv"` (2020-2022) e portare `yearFrom` della GSe a 2023.

### M4 — Catalogo: BMW Serie 1 "M135i / M140i 3.0 340cv" sbagliata dopo il 2019
File: `web/lib/vehicleData.ts:866`

La M140i (F20, 3.0 sei cilindri, 340cv) e' uscita di produzione nel 2019. La M135i F40 (dal 2019) ha un 2.0 quattro
cilindri da 306cv. Chi ha una M135i del 2021 deve salvare un motore 3.0 340cv, e la ricerca IA cerca il motore sbagliato.

Proposta: dividere la voce in `"M140i 3.0 340cv"` (2016-2019) e `"M135i 2.0 Turbo 306cv"` (dal 2019).

### M5 — Catalogo: Up! 1.0 60cv proposta solo dal 2016, manca la 75cv
File: `web/lib/vehicleData.ts:2501`

La Up! e' in vendita dal 2011, ma la voce 60cv parte dal 2016. Chi ha una Up! del 2012-2015 non puo' indicare il suo
anno. Manca anche la versione 1.0 da 75cv, molto diffusa.

Proposta: `yearFrom: 2011` per la 60cv e aggiungere `"1.0 75cv"` (2011-2019).

### M6-M10 — Invariati dallo scan precedente
- Chat: il testo di riserva appare come una vera risposta e sparisce ricaricando la pagina (`web/components/ChatPanel.tsx:71-83`) = U6.
- Chat: una risposta vuota del modello principale non passa al modello di riserva (`web/app/api/agent/chat/route.ts:245-253`) = U5.
- API senza sessione: il middleware risponde con un messaggio in inglese (`web/middleware.ts:44-49`) = U3.
- Chat: dopo un invio dall'esito incerto la cronologia mostrata e' diversa da quella salvata (`web/components/ChatPanel.tsx:62-88`) = U4.

## Rilievi esaminati e scartati
- La "GLA45 S AMG 421cv" dal 2020 (PR #75) e' corretta (H247).
- La "GTI 245cv" 2017-2024 copre sia la Golf 7.5 GTI Performance sia la Golf 8 GTI: e' corretta.

## Richiede intervento umano
- U1 — Il limite d'uso condiviso si appoggia a righe che l'account puo' rimuovere: serve una struttura dedicata in `supabase/` (invariato).
- U2 — La pausa del riquadro motorsport vive nella memoria di istanza e ha una durata fissa (`web/lib/motorsport.ts`), invariato.
- U3 — Risposta del middleware per le API senza sessione: serve il via libera del proprietario.
- U4 — Rendere idempotente l'invio della chat: serve una migrazione.
- U5 — Decidere se una risposta vuota del modello principale debba tentare il modello di riserva: e' una scelta di costo.
- U6 — Decidere come mostrare il testo di riserva nel client (bolla o messaggio d'errore).

## Gia' in PR
- #73 (lavoratore 4): cronologia della chat senza testi di riserva e risposte di soli spazi (M1 e M2 dello scan precedente).
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
