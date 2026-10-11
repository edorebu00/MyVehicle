# Scansione notturna dei bug — MyVehicle

Data scan: 2026-10-11 01:20 (UTC)
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
Da ieri sono entrate in `main` la PR #97 (limite di 200 caratteri sul campo di `/ricerca`, era M2 del 10/10) e la PR #99
(catalogo: BMW XM/Label Red e iX2, Volvo EX90, Polestar 3/4, Jeep Avenger 4xe e altre varianti).
Le route sotto `web/app/api/` e `web/middleware.ts` non sono cambiate dallo scan precedente.
PR aperte al momento dello scan: #98 (`claude/worker-6-2026-10-10`, copia doppia dell'Inster), #96 (`claude/worker-4-2026-10-10`,
spazi nel testo della ricerca IA), #91 (`claude/worker-7-2026-10-07`, testi di riserva e `check:cache`), #68 (solo `supabase/`).

Ogni problema qui sotto e' stato verificato leggendo di persona il codice indicato.

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante nuovo trovato.

## Minore

### M1 — Catalogo: anno di inizio di Jeep Avenger 4xe da confermare
File: `web/lib/vehicleData.ts:1559`
La voce "4xe 1.2 Hybrid 145cv" (PR #99) parte dal 2024: la versione e' stata presentata a fine 2024 e consegnata dal 2025,
quindi il modulo "Aggiungi veicolo" propone un anno in cui la versione forse non era in strada. E' un dato di catalogo
(vedi U15), non un difetto del codice.

### M2 — Catalogo: nomi delle versioni Polestar scritti in due modi diversi
File: `web/lib/vehicleData.ts:470-480`
Polestar 2 usa "Elettrica Single Motor 231cv", mentre Polestar 3/4 (PR #99) mettono "Elettrica" dopo il motore
("Long Range Single Motor Elettrica 272cv"). Nell'elenco della stessa marca i nomi sono scritti in due modi. Solo estetico.
Proposta: allineare le etichette di Polestar 3/4 al formato "Elettrica ..." (rimandato: tocca dati appena aggiunti dal proprietario).

### M3 — Invariato: pagina documenti (stesso file della PR #91)
File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:29-38`. Ordinamento senza criterio di parita' e filtro applicato
dopo `.limit(50)`. Rimandato finche' la PR #91 e' aperta.

### M4-M7 — Invariati (decisioni del proprietario, vedi U3-U6)
- Chat: il testo di riserva appare come una vera risposta e sparisce ricaricando la pagina (`web/components/ChatPanel.tsx`) = U6.
- Chat: una risposta vuota del modello principale non passa al modello di riserva (`web/app/api/agent/chat/route.ts`) = U5.
- API senza sessione: il middleware risponde con un messaggio in inglese (`web/middleware.ts`) = U3.
- Chat: dopo un invio dall'esito incerto la cronologia mostrata e' diversa da quella salvata (`web/components/ChatPanel.tsx`) = U4.

## Rilievi esaminati e non trasformati in task
- `GlobalSearch.tsx:44-46`: se una ricerca fallisce restano visibili i risultati di quella prima. `VehicleDetailTabs.tsx:80-86`
  fa lo stesso, quindi e' un comportamento comune ai due campi e non un difetto isolato: da decidere insieme, se mai.
- `GlobalSearch.tsx:31`: il client accetta ricerche di 1 carattere che il server rifiuta (minimo 2) con un messaggio
  tradotto. Il risultato per l'utente e' corretto: costa solo una chiamata in piu', senza uso di modelli.
- Doppioni nei nuovi modelli della PR #99: nessuno. L'unica copia doppia resta l'Inster, gia' in PR #98 (il secondo `XM`
  alla riga 1101 e' della Citroen, non della BMW).
- `maxLength` ripetuto in due campi: e' riordino, non un difetto.

## Richiede intervento umano
- U1 — Il limite d'uso condiviso si appoggia a righe che l'account puo' rimuovere: serve una struttura dedicata in `supabase/` (invariato).
- U2 — La pausa del riquadro motorsport vive nella memoria di istanza e ha una durata fissa (`web/lib/motorsport.ts`), invariato.
- U3 — Risposta del middleware per le API senza sessione: serve il via libera del proprietario.
- U4 — Rendere idempotente l'invio della chat: serve una migrazione.
- U5 — Decidere se una risposta vuota del modello principale debba tentare il modello di riserva: e' una scelta di costo.
- U6 — Decidere come mostrare il testo di riserva nel client (bolla o messaggio d'errore).
- U7 — Decidere se, scelto "Altro", il motore scritto a mano debba essere obbligatorio.
- U8 — Decidere se gli anni vadano limitati al periodo della motorizzazione (anche con "Altro") o offerti sempre per intero.
- U11 — Portare anche a livello di database i limiti di lunghezza e il controllo di marca/modello non vuoti dei campi di `vehicles` (migrazione in `supabase/`).
- U12 — Civic Type R (`web/lib/vehicleData.ts:1421-1422`): confermare se l'anno 2022 vada coperto e se il modello attuale debba avere fine `null` invece di 2026.
- U13 — Valutare una pulizia una tantum delle righe di riserva gia' salvate in `chat_messages` (operazione sui dati).
- U14 — Confermare le potenze di Audi Q6 e-tron (292/326cv), A6 e-tron (326cv) e Peugeot E-208 GTi (281 o 280cv).
- U15 — Confermare l'anno di inizio di Jeep Avenger 4xe (2024 o 2025) e il formato delle etichette Polestar 3/4.
- U16 — Decidere se, quando una ricerca fallisce, i risultati precedenti vadano nascosti (in entrambi i campi di ricerca).

## Gia' in PR
- #98: copia doppia di Hyundai Inster (M3 del 10/10).
- #96: spazi nel testo della ricerca IA (M1 del 10/10).
- #91: `check:cache`; stesso file di M3.
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
