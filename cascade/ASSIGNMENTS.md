Data (UTC): 2026-10-03

# Assegnazioni definitive per i lavoratori 4, 5, 6

## Accordo con l'agente 2

Divisione proposta in `cascade/SPLIT.md` confermata senza modifiche: T1 al lavoratore 4, T2 al lavoratore 5, lavoratore 6 senza task.

Verifiche indipendenti (codice aperto sotto `web/`):
- (a) T1 e T2 sono assegnati una sola volta ciascuno; non ci sono altri task assegnabili.
- (b) Insiemi di file disgiunti: lavoratore 4 solo `web/lib/vehicleData.ts`, lavoratore 5 solo `web/app/(dashboard)/veicoli/nuovo/page.tsx`.
- (c) Carico: due task piccoli e indipendenti, uno per lavoratore.
- (d) Righe e contenuti indicati in TASKS.md corrispondono al codice attuale (Smart `#1`/`#3` a 2282-2289, Up! a 2513 e 2516,
  Leapmotor a 2604-2607, `engine_code` a `page.tsx:130`). I criteri di accettazione di T1 tornano: dopo la rimozione,
  `engineExtensions.ts:811-818` e `837-843` forniscono 2 voci per #1, 2 per #3 (Brabus dal 2023), 2 per C10 e 1 per T03.
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file generati; nessuna migrazione o scelta di design.
- (f) PR aperte: #73 (`web/app/api/agent/chat/route.ts`) e #68 (`supabase/migrations/0005_rls_hardening.sql`): nessuna sovrapposizione.

Risposte ai punti da confermare:
- Lettura corretta: `page.tsx` usa `getEngineVariants`, `getMakes` e `getModels` in sola lettura e T1 non ne cambia firma ne' codice.
  Inoltre `getMakes`/`getModels` leggono `VEHICLE_DATA`, `CATALOGUE_EXTENSIONS` e `CATALOGUE_SWEEP`, non `ENGINE_DATA`:
  rimuovere i blocchi di T1 non toglie marche o modelli dai menu (Leapmotor resta in `VEHICLE_DATA` riga 182, Smart #1/#3 a riga 210).
- Il lavoratore 6 resta senza task: la cascata non prevede un ruolo di revisione per i lavoratori, quindi niente lavoro inventato.

## Lavoratore 4

Branch: `claude/worker-4-2026-10-03`

### T1 — Catalogo: elimina i doppioni Smart #1/#3 e Leapmotor e chiudi gli anni della VW Up!
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

File ammessi: `web/lib/vehicleData.ts` (solo il blocco `ENGINE_DATA` nei punti indicati).

Ordine di esecuzione: T1.

Criteri di accettazione: quelli di T1; diff limitato alla rimozione dei blocchi Smart `#1`/`#3` e `Leapmotor` di `ENGINE_DATA`
e ai due `yearTo` della Up!; Fortwo, Forfour, gli elenchi dei modelli (righe 182 e 210) ed `engineExtensions.ts` invariati.

## Lavoratore 5

Branch: `claude/worker-5-2026-10-03`

### T2 — Nuovo veicolo: ripulisci dagli spazi anche il motore scritto nel campo libero
Gravita': Minore
File: `web/app/(dashboard)/veicoli/nuovo/page.tsx:130`
Problema: `engine_code` viene ripulito con `trim()` solo quando si sceglie "Altro". Per i modelli senza motorizzazioni in catalogo
si salva `engineCode || null` cosi' com'e', e un valore di soli spazi finisce nella scheda del veicolo e nel contesto della ricerca IA.
Marca e modello sono gia' ripuliti (righe 44-45).
Correzione: salvare `(isCustomEngine ? customEngine : engineCode).trim() || null`, per esempio con una costante `engine` derivata accanto a `make` e `model`.
Accettazione: con un motore scritto a mano come "  " viene salvato `null`, e con " 1.6 TDI " viene salvato "1.6 TDI", in entrambi i rami.
Le motorizzazioni scelte dal menu vengono salvate invariate. `npx tsc --noEmit` e `npm run lint` in `web/` passano.

File ammessi: `web/app/(dashboard)/veicoli/nuovo/page.tsx`.

Ordine di esecuzione: T2.

Criteri di accettazione: quelli di T2; nessun altro comportamento del form modificato (validazioni, anni, menu).

## Lavoratore 6

Nessun task assegnato.

## Richiede intervento umano

- U1-U8: invariati, vedi `BUG_SCAN.md` e `cascade/TASKS.md` (non assegnare).

## Gia' in PR

- #73: `web/app/api/agent/chat/route.ts`.
- #68: `supabase/migrations/0005_rls_hardening.sql`.
