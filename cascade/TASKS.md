Data (UTC): 2026-10-03

## T1 — Catalogo: elimina i doppioni Smart #1/#3 e Leapmotor e chiudi gli anni della VW Up!
Gravita': Minore
File: `web/lib/vehicleData.ts:2282-2289` (Smart `#1`/`#3` in `ENGINE_DATA`), `2604-2607` (Leapmotor in `ENGINE_DATA`), `2513` e `2516` (VW Up!)
Problema: le voci aggiunte dalla PR #78 ripetono, con etichette diverse, motori gia' presenti in `web/lib/engineExtensions.ts:811-818` e `838-843`.
`getEngineVariants` scarta solo le etichette identiche, quindi il menu di Smart #1, Smart #3 e Leapmotor C10 elenca lo stesso motore due volte.
Per la #3 Brabus i doppioni hanno anche anni diversi (2024 contro 2023). Le voci della Up! "1.0 60cv" ed "Elettrica e-up! 82cv"
hanno `yearTo: null`, ma la produzione si e' chiusa nel 2023.
Correzione: rimuovere da `ENGINE_DATA` i modelli `"#1"` e `"#3"` sotto Smart (senza toccare le altre voci Smart) e l'intero blocco `Leapmotor`.
Restano le voci di `engineExtensions.ts`, che non va modificato. Mettere `yearTo: 2023` alle due voci Up! indicate. Non toccare gli elenchi dei modelli.
Accettazione: `getEngineVariants("auto","Smart","#1")` e `("auto","Smart","#3")` restituiscono 2 voci ciascuno, con la #3 Brabus dal 2023.
`("auto","Leapmotor","C10")` restituisce 2 voci (RWD 218cv, AWD 598cv) e `("auto","Leapmotor","T03")` 1 voce.
Le due voci Up! hanno `yearTo: 2023`. `npx tsc --noEmit` e `npm run lint` in `web/` passano.

## T2 — Nuovo veicolo: ripulisci dagli spazi anche il motore scritto nel campo libero
Gravita': Minore
File: `web/app/(dashboard)/veicoli/nuovo/page.tsx:130`
Problema: `engine_code` viene ripulito con `trim()` solo quando si sceglie "Altro". Per i modelli senza motorizzazioni in catalogo
si salva `engineCode || null` cosi' com'e', e un valore di soli spazi finisce nella scheda del veicolo e nel contesto della ricerca IA.
Marca e modello sono gia' ripuliti (righe 44-45).
Correzione: salvare `(isCustomEngine ? customEngine : engineCode).trim() || null`, per esempio con una costante `engine` derivata accanto a `make` e `model`.
Accettazione: con un motore scritto a mano come "  " viene salvato `null`, e con " 1.6 TDI " viene salvato "1.6 TDI", in entrambi i rami.
Le motorizzazioni scelte dal menu vengono salvate invariate. `npx tsc --noEmit` e `npm run lint` in `web/` passano.

## Richiede intervento umano (non assegnare)
- U1-U6: invariati, vedi `BUG_SCAN.md`.
- U7: decidere se, scelta la voce "Altro" del motore, il campo libero debba essere obbligatorio.
- U8: decidere se, scelta la voce "Altro" del motore, gli anni vadano limitati al periodo delle motorizzazioni del modello.

## Gia' in PR
- #73: cronologia della chat (`web/app/api/agent/chat/route.ts`).
- #68: rafforzamento RLS (`supabase/`).
