# Scansione notturna dei bug — MyVehicle

Data scan: 2026-10-03 (UTC)
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
Da ieri in `main` sono entrate la PR #76 (voce "Altro" nel menu del motore), la PR #77 (correzioni al catalogo) e la
PR #78 (Smart #1/#3, Leapmotor, Zeekr). Nessuna route sotto `web/app/api/`, middleware o componente della chat e'
cambiato: per quelle parti valgono le conclusioni degli scan precedenti.
PR aperte al momento dello scan: #73 (lavoratore 4, `web/app/api/agent/chat/route.ts`), #68 (solo `supabase/`).

Ogni problema qui sotto e' stato verificato leggendo di persona il codice indicato.
I1 e M1-M5 dello scan del 02/10 sono stati corretti dalle PR #76 e #77.

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante nuovo.

## Minore

### M1 — Catalogo: Smart #1/#3 e Leapmotor C10/T03 compaiono due volte con etichette diverse
File: `web/lib/vehicleData.ts:2282-2289` e `2604-2607` (PR #78), `web/lib/engineExtensions.ts:811-818` e `838-843`

Le nuove voci di `ENGINE_DATA` ripetono motori gia' presenti in `ENGINE_EXTENSIONS`. `getEngineVariants`
(`vehicleData.ts:2911-2925`) scarta solo le etichette identiche, quindi per Smart #1 il menu mostra quattro voci per
due motori ("Pro Elettrica 272cv" e "Elettrica 66 kWh 272cv", "Brabus Elettrica 428cv" e "Brabus 66 kWh 428cv").
Lo stesso vale per la #3 e per la Leapmotor C10 ("Elettrica 218cv" ed "Elettrica RWD 218cv"). Per la #3 Brabus i due
duplicati hanno anche anni diversi (2024 contro 2023), quindi l'anno proponibile dipende dall'etichetta cliccata.
La T03 e' copiata identica e quindi non si vede, ma il dato esiste in due copie.

Proposta: rimuovere i blocchi Smart `#1`/`#3` e Leapmotor da `ENGINE_DATA`; restano le voci di `engineExtensions.ts`.

### M2 — Nuovo veicolo: il motore scritto a mano per un modello senza catalogo non viene ripulito dagli spazi
File: `web/app/(dashboard)/veicoli/nuovo/page.tsx:130`

`engine_code` viene ripulito con `trim()` solo nel ramo "Altro". Nel campo libero dei modelli senza motorizzazioni
in catalogo viene salvato `engineCode || null`, cosi' com'e': un valore di soli spazi viene salvato come motore.
La scheda del veicolo (`components/VehicleCard.tsx:40-41`) mostra "Motore:" vuoto e la ricerca IA
(`app/api/agent/search/route.ts:408`) aggiunge una motorizzazione vuota al contesto. Marca e modello sono gia'
ripuliti (righe 44-45).

Proposta: salvare `(isCustomEngine ? customEngine : engineCode).trim() || null`.

### M3 — Catalogo: VW Up! 1.0 60cv ed e-up! proposte fino all'anno corrente
File: `web/lib/vehicleData.ts:2513`, `2516`

La produzione della Up! si e' chiusa nel 2023, ma le voci "1.0 60cv" ed "Elettrica e-up! 82cv" hanno `yearTo: null`
e propongono come anni validi 2024-2026. Le gemelle Seat Mii (`vehicleData.ts:2180-2181`) sono gia' chiuse.

Proposta: `yearTo: 2023` per entrambe.

### M4-M7 — Invariati dagli scan precedenti
- Chat: il testo di riserva appare come una vera risposta e sparisce ricaricando la pagina (`web/components/ChatPanel.tsx:71-83`) = U6.
- Chat: una risposta vuota del modello principale non passa al modello di riserva (`web/app/api/agent/chat/route.ts:245-253`) = U5.
- API senza sessione: il middleware risponde con un messaggio in inglese (`web/middleware.ts:44-49`) = U3.
- Chat: dopo un invio dall'esito incerto la cronologia mostrata e' diversa da quella salvata (`web/components/ChatPanel.tsx:62-88`) = U4.

## Rilievi esaminati e non trasformati in task
- Con la voce "Altro" il campo libero del motore non e' obbligatorio, quindi il veicolo si salva senza motore. Il campo
  libero dei modelli senza catalogo e' facoltativo per scelta (commento a `page.tsx:318-320`): rendere obbligatorio
  quello nuovo e' una scelta di prodotto (U7).
- Con la voce "Altro" gli anni vanno dal 1950 a oggi anche se le motorizzazioni del modello delimitano il periodo. Il
  commento a `page.tsx:58-59` dice che il comportamento e' voluto: restringerlo e' una scelta di prodotto (U8).
- Proposta di estrarre un componente comune "menu + Altro": e' un refactoring, non un difetto.

## Richiede intervento umano
- U1 — Il limite d'uso condiviso si appoggia a righe che l'account puo' rimuovere: serve una struttura dedicata in `supabase/` (invariato).
- U2 — La pausa del riquadro motorsport vive nella memoria di istanza e ha una durata fissa (`web/lib/motorsport.ts`), invariato.
- U3 — Risposta del middleware per le API senza sessione: serve il via libera del proprietario.
- U4 — Rendere idempotente l'invio della chat: serve una migrazione.
- U5 — Decidere se una risposta vuota del modello principale debba tentare il modello di riserva: e' una scelta di costo.
- U6 — Decidere come mostrare il testo di riserva nel client (bolla o messaggio d'errore).
- U7 — Decidere se, scelto "Altro", il motore scritto a mano debba essere obbligatorio.
- U8 — Decidere se, scelto "Altro", gli anni vadano limitati al periodo coperto dalle motorizzazioni del modello.

## Gia' in PR
- #73 (lavoratore 4): cronologia della chat senza testi di riserva e risposte di soli spazi.
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
