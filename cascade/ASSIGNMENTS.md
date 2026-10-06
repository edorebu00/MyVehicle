Data (UTC): 2026-10-06

# Assegnazioni definitive della notte

## Accordo con l'agente 2
Ho controllato di persona `web/app/api/agent/search/route.ts`, `web/app/(dashboard)/veicoli/nuovo/page.tsx`,
`web/lib/vehicleData.ts`, `web/lib/engineExtensions.ts`, `web/lib/validation.ts` e `web/messages/*.json`.

Confermato:
- (a) T1, T2 e T3 sono assegnati una sola volta ciascuno; i punti U1-U11 restano fuori dall'assegnazione.
- (b) T1 e T2 toccano entrambi `veicoli/nuovo/page.tsx`, quindi vanno nello stesso gruppo. T3 tocca solo
  `web/lib/vehicleData.ts`. I due insiemi di file non hanno file in comune.
- (c) Il carico non si puo' bilanciare meglio senza rompere la disgiunzione dei file. Va bene lasciare vuoto il
  lavoratore 6.
- (d) Ho reso i task piu' precisi, cosi' non serve interpretarli (vedi "Cambiato").
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file "GENERATO DA" (l'unico file
  generato sotto `web/lib` e' `appIcons.ts`, che non rientra in nessun task). Nessun task richiede una migrazione,
  un secret nuovo o una scelta di design. T1 e' un rafforzamento fatto solo con codice sotto `web/`, quindi si puo'
  assegnare ed e' il primo del suo gruppo.
- (f) PR aperte (lette con l'API REST, perche' `gh pr list` non e' disponibile tramite GraphQL): #73
  (`claude/worker-4-2026-10-01`, solo `web/app/api/agent/chat/route.ts`) e #68 (`claude/rls-hardening`, solo
  `supabase/migrations/0005_rls_hardening.sql`). Nessun file in comune con T1, T2 o T3.

Risposte ai "Punti da confermare all'agente 3":
- Carico sbilanciato: confermo la divisione. T1 e T2 non si possono separare. Il lavoratore 6 resta senza task.
- PR #73 del lavoratore 4: va bene lo stesso. Il lavoro di questa notte usa un branch nuovo
  (`claude/worker-4-2026-10-06`) e file diversi, quindi le due PR non vanno in conflitto.
- PR #73 e #68: confermo che non condividono file con i task di questa notte.

Cambiato (solo chiarimenti, nessun task spostato):
- T1: ho fissato i valori, cioe' `MAX_VEHICLE_FIELD_CHARS = 80` per marca, modello e motore, `maxLength={80}` sui loro
  input liberi e `maxLength={20}` sulla targa. Ho anche definito cosa fare quando un campo diventa null.
- T2: ho fissato il nome della chiave di traduzione (`vehicleNew.emptyMakeModelError`), il testo nelle tre lingue e il
  punto esatto del controllo.

## Lavoratore 4
Branch: `claude/worker-4-2026-10-06`

### Task assegnati

#### T1 — Limita la lunghezza dei dati del veicolo nel contesto della ricerca IA (rafforzamento)
Gravita': Importante
File: `web/app/api/agent/search/route.ts:404-409`; `web/app/(dashboard)/veicoli/nuovo/page.tsx` (input liberi di marca, modello, motore e targa)
Problema: `make`, `model` ed `engine_code` del veicolo entrano nel testo inviato al modello senza limite di lunghezza
(la ricerca invece e' gia' tagliata con `clampText`), e il modulo non pone limiti ai campi di testo libero.
Correzione: in `search/route.ts` passare i tre campi da `clampText` (da `@/lib/validation`) con una costante dedicata
(es. `MAX_VEHICLE_FIELD_CHARS = 80`) prima di comporre `vehicleContext`, omettendo un campo che diventa null; nel modulo
aggiungere `maxLength` coerente agli input liberi (marca, modello, motore, targa).
Accettazione: `vehicleContext` non puo' contenere un campo del veicolo piu' lungo della costante; gli input liberi del
modulo hanno `maxLength`; `npm run lint` e `npx tsc --noEmit` in `web/` passano.

Precisazioni vincolanti dell'agente 3:
- In `search/route.ts` dichiara `const MAX_VEHICLE_FIELD_CHARS = 80;` vicino alle altre costanti del file (ad esempio
  `MAX_QUERY_CHARS`). `clampText` e' gia' importato: non aggiungere import.
- Calcola `make`, `model` ed `engine` con `clampText(vehicle.<campo>, MAX_VEHICLE_FIELD_CHARS)`. Se `make` e `model`
  sono entrambi null, lascia `vehicleContext` vuoto. Altrimenti unisci con uno spazio solo quelli non null.
  Lascia invariato il resto della frase (tipo, anno, ", motorizzazione ..." solo se `engine` non e' null).
- In `veicoli/nuovo/page.tsx`: metti `maxLength={80}` sui tre `<input>` liberi (marca personalizzata, modello
  personalizzato in entrambi i rami, motore libero in entrambi i rami) e `maxLength={20}` sull'input `plate`.
  Non toccare i `<select>`.

#### T2 — Nuovo veicolo: non salvare marca o modello vuoti dopo il trim
Gravita': Minore
File: `web/app/(dashboard)/veicoli/nuovo/page.tsx:106-136`
Problema: un valore di soli spazi nei campi "Altro" supera `required`, diventa `""` dopo `trim()` e il veicolo viene
salvato con marca o modello vuoti.
Correzione: all'inizio di `handleSubmit`, se `make` o `model` sono vuoti, impostare un errore tradotto (nuova chiave
in `messages/it.json`, `en.json`, `de.json` sotto `vehicleNew`) e uscire senza chiamare Supabase.
Accettazione: con marca o modello di soli spazi non parte alcun insert e appare un messaggio d'errore nelle tre lingue;
lint e typecheck passano.

Precisazioni vincolanti dell'agente 3:
- Metti il controllo subito dopo `e.preventDefault();` e prima di `setLoading(true)` e di `supabase.auth.getUser()`:
  `if (!make || !model) { setError(t("emptyMakeModelError")); return; }`. Le costanti `make` e `model` alle righe 44-45
  sono gia' ripulite dagli spazi.
- Aggiungi la chiave `"emptyMakeModelError"` sotto `vehicleNew`, subito dopo `"incompleteVehicleError"`, mantenendo
  il JSON valido:
  - it: `"Inserisci marca e modello del veicolo."`
  - en: `"Enter the vehicle's make and model."`
  - de: `"Gib Marke und Modell des Fahrzeugs ein."`

### File ammessi (gli unici modificabili)
- `web/app/api/agent/search/route.ts`
- `web/app/(dashboard)/veicoli/nuovo/page.tsx`
- `web/messages/it.json`
- `web/messages/en.json`
- `web/messages/de.json`

### Ordine di esecuzione
1. T1 (rafforzamento, va per primo)
2. T2

### Criteri di accettazione
- Quelli di T1 e T2 riportati sopra, comprese le precisazioni.
- Nessun file fuori dall'elenco ammesso risulta modificato (`git diff --name-only`).
- I tre file di traduzione hanno la stessa chiave nuova e sono JSON validi.
- `npm run lint` e `npx tsc --noEmit` in `web/` passano.

## Lavoratore 5
Branch: `claude/worker-5-2026-10-06`

### Task assegnati

#### T3 — Catalogo: separa le due versioni della e-up! sotto "Up!"
Gravita': Minore
File: `web/lib/vehicleData.ts:2546`
Problema: "Elettrica e-up! 82cv" copre 2013-2023, ma dal 2019 la e-up! ha 32,3 kWh e 83cv; `web/lib/engineExtensions.ts:133-136`
distingue gia' le due versioni.
Correzione: sostituire la voce con "Elettrica 18,7 kWh 82cv" (2013-2019) ed "Elettrica 32,3 kWh 83cv" (2019-2023).
Accettazione: sotto "Up!" una e-up! del 2021 propone solo la versione da 83cv e una del 2015 solo quella da 82cv; typecheck passa.

Precisazioni vincolanti dell'agente 3:
- Nella lista `"Up!"` di `ENGINE_DATA` (Volkswagen, auto) sostituisci la sola riga
  `{ label: "Elettrica e-up! 82cv", yearFrom: 2013, yearTo: 2023 },` con queste due righe:
  `{ label: "Elettrica 18,7 kWh 82cv", yearFrom: 2013, yearTo: 2019 },`
  `{ label: "Elettrica 32,3 kWh 83cv", yearFrom: 2019, yearTo: 2023 },`
- Non modificare `web/lib/engineExtensions.ts`. La voce `"e-Up!"` lasciala com'e'.

### File ammessi (gli unici modificabili)
- `web/lib/vehicleData.ts`

### Ordine di esecuzione
1. T3

### Criteri di accettazione
- Quelli di T3 riportati sopra.
- Il diff di `web/lib/vehicleData.ts` contiene solo la riga sostituita, cioe' 1 riga tolta e 2 aggiunte.
- `npm run lint` e `npx tsc --noEmit` in `web/` passano.

## Lavoratore 6
Nessun task assegnato.

## Richiede intervento umano (non assegnato)
U1-U11 come in `cascade/TASKS.md`, invariati. Nessun task nuovo e' stato tolto dall'assegnazione.

## Gia' in PR (non assegnato)
- #73: cronologia della chat (`web/app/api/agent/chat/route.ts`).
- #68: rafforzamento della RLS (solo `supabase/`).
