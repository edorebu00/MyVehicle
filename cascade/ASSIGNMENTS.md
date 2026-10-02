Data (UTC): 2026-10-02

# Assegnazioni definitive della cascata notturna

## Accordo con l'agente 2

Verifica indipendente svolta aprendo `web/app/(dashboard)/veicoli/nuovo/page.tsx`, `web/lib/vehicleData.ts`,
`web/lib/engineExtensions.ts`, `web/lib/catalogueSweep.ts` e `web/messages/*.json`, e controllando i file delle PR aperte.

- (a) T1 e T2 sono assegnati ciascuno esattamente una volta; U1-U6 restano non assegnati.
- (b) Insiemi di file disgiunti: lavoratore 4 solo `page.tsx`, lavoratore 5 solo `vehicleData.ts`. `page.tsx` importa
  `getEngineVariants` da `vehicleData.ts` ma T2 non cambia firme ne' export, quindi non c'e' sovrapposizione.
- (c) Carico: T1 (UI, nuovo stato) e' piu' corposo di T2 (solo dati); con due soli task il bilanciamento e' il migliore possibile.
- (d) Entrambi i task sono precisi: le righe citate corrispondono al codice attuale; le chiavi `otherOption` ed
  `enginePlaceholderFree` esistono in it/en/de; il conteggio "10 voci GTI/R" della Golf e' corretto (8 attuali + 2 nuove);
  `getEngineVariants` unisce `ENGINE_DATA` ed `ENGINE_EXTENSIONS`, e quest'ultimo non ha voci per GLB, Golf, Grandland,
  Serie 1 o Up!.
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file con intestazione "GENERATO DA";
  nessuno richiede migrazioni, secret nuovi o scelte di design. Nessun task di rafforzamento questa notte.
- (f) PR aperte: #73 (`web/app/api/agent/chat/route.ts`) e #68 (`supabase/migrations/0005_rls_hardening.sql`).
  Nessuna tocca i file di T1 o T2.

Risposte ai punti da confermare:
- Lavoratore 4 con la PR #73 aperta: confermato T1 al lavoratore 4. La #73 e' su un altro file e su un altro branch
  (`claude/worker-4-2026-10-01`); stanotte il lavoratore 4 lavora su un branch nuovo, quindi non c'e' interferenza. Nessuno scambio.
- Ordine tra T2 e T1: non serve. Correzione: il criterio "la Golf ha 10 voci GTI/R" appartiene a T2, non a T1; il
  criterio di T1 (ultima voce "Altro" per Volkswagen > Golf) vale qualunque sia il contenuto del catalogo. I due
  lavoratori procedono in parallelo.

Modifiche rispetto alla proposta: nessuna nella divisione; aggiunti solo l'elenco vincolante dei file ammessi, l'ordine
di esecuzione e i criteri di accettazione.

## Lavoratore 4

Branch: `claude/worker-4-2026-10-02` (partendo da `origin/main`).

### T1 — Nuovo veicolo: voce "Altro" nel menu del motore
Gravita': Importante
File: `web/app/(dashboard)/veicoli/nuovo/page.tsx` (righe 15-20 costante `OTHER`, 53-67 `variants`/`selectedVariant`/`yearOptions`, 69-97 handler, 120-123 insert, 280-312 campo motore)
Problema: se il modello ha motorizzazioni in catalogo, il campo motore e' un `<select required>` senza la voce "Altro"
e gli anni seguono la voce scelta. Chi ha un motore non in elenco non puo' salvare il veicolo senza un'etichetta
sbagliata, che limita gli anni e finisce in `engine_code` e nella ricerca IA. Marca e modello hanno gia' la voce
`OTHER` ("Altro (non in elenco)"), il motore no, contro quanto dice il commento sulla costante `OTHER`.
Correzione richiesta: nel ramo `variants` aggiungere in fondo al menu `<option value={OTHER}>{t("otherOption")}</option>`,
seguendo lo schema gia' usato per il modello (righe 255-268). Con la voce `OTHER` scelta: mostrare sotto il menu un
`<input>` di testo libero (non obbligatorio, placeholder `t("enginePlaceholderFree")`, `aria-label` uguale)
legato a uno stato separato (es. `customEngine`); `selectedVariant` resta `null`, quindi gli anni coprono l'intervallo
completo; all'inserimento `engine_code` vale il testo libero ripulito con `trim()`, oppure `null` se vuoto (mai la stringa
`__altro__`). Il cambio di tipo, marca, modello o motore azzera anche il testo libero. Non modificare i file `messages/*.json`:
le chiavi `otherOption` ed `enginePlaceholderFree` esistono gia'.
Criterio di accettazione: per Volkswagen > Golf il menu del motore ha come ultima voce "Altro (non in elenco)";
sceglierla mostra il campo libero e un menu anni dall'anno corrente al 1950; salvando con il campo vuoto `engine_code` e' `null`,
con "1.4 TSI 125cv" e' quel testo; senza scegliere "Altro" il comportamento e' invariato; `npx tsc --noEmit`, `npm run lint`
e `npm run build` in `web/` passano.

File ammessi (gli unici modificabili):
- `web/app/(dashboard)/veicoli/nuovo/page.tsx`

Ordine di esecuzione: 1. T1.

Criteri di accettazione: quelli di T1 sopra; il diff tocca solo il file ammesso; nessuna modifica a `messages/*.json`
ne' al ramo senza motorizzazioni in catalogo (campo libero esistente).

## Lavoratore 5

Branch: `claude/worker-5-2026-10-02` (partendo da `origin/main`).

### T2 — Catalogo: correzioni a GLB AMG, Golf GTI, Grandland, BMW Serie 1 e Up!
Gravita': Minore
File: `web/lib/vehicleData.ts` (righe 866, 1773, 1931-1932, 2423-2427, 2501)
Problema: la PR #75 ha aggiunto una "GLB45 S AMG 421cv" che non esiste (l'unica GLB AMG e' la GLB 35 da 306cv). Mancano
la Golf 7.5 GTI 230cv (2017-2020), la Golf 7 GTI Clubsport 265cv (2016-2017) e la Grandland X Hybrid4 300cv (2020-2022).
La GSe e' proposta dal 2022 ma e' in vendita dal 2023. Sulla Serie 1 la voce "M135i / M140i 3.0 340cv" (dal 2017 a oggi)
e' sbagliata dopo il 2019. La Up! 1.0 60cv parte dal 2016 ma la vettura e' in vendita dal 2011, e manca la 75cv.
Correzione richiesta, solo in `ENGINE_DATA`:
- Mercedes-Benz > GLB: sostituire `"GLB45 S AMG 2.0 Turbo 421cv"` con `{ label: "GLB35 AMG 2.0 Turbo 306cv", yearFrom: 2019, yearTo: null }`.
- Volkswagen > Golf: aggiungere `{ label: "2.0 TSI GTI 230cv", yearFrom: 2017, yearTo: 2020 }` dopo la "GTI Performance 230cv" e
  `{ label: "2.0 TSI GTI Clubsport 265cv", yearFrom: 2016, yearTo: 2017 }` prima della "GTI Clubsport 300cv".
- Opel > Grandland: aggiungere `{ label: "Hybrid4 Plug-in 4x4 300cv", yearFrom: 2020, yearTo: 2022 }` e portare `yearFrom` della
  "GSe Plug-in Hybrid 4x4 300cv" a 2023.
- BMW > Serie 1: sostituire `"M135i / M140i 3.0 340cv"` con `{ label: "M140i 3.0 340cv", yearFrom: 2016, yearTo: 2019 }` e
  `{ label: "M135i 2.0 Turbo 306cv", yearFrom: 2019, yearTo: null }`.
- Volkswagen > Up!: portare `yearFrom` di `"1.0 60cv"` a 2011 e aggiungere `{ label: "1.0 75cv", yearFrom: 2011, yearTo: 2019 }`.
Non toccare altri modelli ne' `web/lib/engineExtensions.ts` (non contiene voci per questi modelli).
Criterio di accettazione: `getEngineVariants("auto", "Mercedes-Benz", "GLB")` non contiene "GLB45" e contiene "GLB35 AMG 2.0 Turbo 306cv";
la Golf ha 10 voci GTI/R incluse le due nuove; la Grandland contiene la Hybrid4 e la GSe ha `yearFrom: 2023`; la Serie 1 non contiene
"M135i / M140i"; la Up! ha 4 voci con la 60cv da 2011; `npx tsc --noEmit` e `npm run lint` in `web/` passano.

File ammessi (gli unici modificabili):
- `web/lib/vehicleData.ts`

Ordine di esecuzione: 1. T2 (le cinque modifiche nell'ordine elencato).

Criteri di accettazione: quelli di T2 sopra; il diff tocca solo `ENGINE_DATA` nel file ammesso, senza cambiare firme,
export o altri modelli.

## Lavoratore 6

Nessun task assegnato.

## Richiede intervento umano

Invariato rispetto a `cascade/TASKS.md` (U1-U6): richiedono migrazioni, scelte di costo o di design, o il via libera
del proprietario. Nessun task e' stato tolto dall'assegnazione questa notte.
