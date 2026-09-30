Data (UTC): 2026-09-30

## Accordo con l'agente 2

Verifica indipendente svolta sul codice di `main` (`web/app/api/agent/chat/route.ts`, `web/lib/vehicleData.ts`) e sulle PR aperte.

- (a) T1, T2, T3 assegnati ciascuno esattamente una volta; U1-U5 non assegnati. Confermato.
- (b) Insiemi di file disgiunti: Lavoratore 4 = `web/app/api/agent/chat/route.ts`; Lavoratore 5 = `web/lib/vehicleData.ts`. Confermato.
- (c) Carico: 2 task piccoli (stesso file) contro 1 task piccolo; con 3 task e il vincolo di disgiunzione non esiste una divisione piu' equilibrata. Confermato.
- (d) Precisione: i testi di TASKS.md corrispondono al codice attuale (`emptyReply` alle righe 245 e 249, `chatWithOpenAI` alla riga 71, Corsa alle righe 1899-1906, Rafale alle righe 2124-2127). Unica precisazione aggiunta: in T3 la funzione di verifica e' `getEngineVariants(type, make, model)` (`web/lib/vehicleData.ts:2867`).
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file "GENERATO DA"; nessuno richiede migrazioni, secret nuovi o scelte di design. Nessun task di rafforzamento della sicurezza oggi.
- (f) PR aperte: solo #68 (`supabase/migrations/0005_rls_hardening.sql`): nessuna sovrapposizione con i file assegnati.

Risposte ai "Punti da confermare all'agente 3":
1. T1 e T2 restano insieme nel Lavoratore 4, T1 per primo: confermato (stesso file, e cosi' evitiamo due PR in conflitto su `route.ts`).
2. Lavoratore 6 senza task: confermato. Nessuna revisione incrociata: il ruolo dei lavoratori e' eseguire task, non rivedere PR altrui.
3. Il Lavoratore 5 parte da `origin/main` aggiornato come tutti i lavoratori; nessun ulteriore vincolo.

Cambiamenti rispetto alla proposta dell'agente 2: nessuno nella divisione; aggiunta solo la precisazione su `getEngineVariants` nei criteri di T3.

## Lavoratore 4

Branch: `claude/worker-4-2026-09-30` (creato da `origin/main` aggiornato).

File ammessi (gli unici modificabili):
- `web/app/api/agent/chat/route.ts`

Ordine di esecuzione: T1, poi T2.

### T1 — Chat: non salvare il messaggio di riserva come risposta dell'assistente
Gravita': Minore
File: web/app/api/agent/chat/route.ts:238-256 (ramo Anthropic, ramo OpenAI, inserimento della risposta)
Problema: se il modello non restituisce testo, `tErr("emptyReply")` viene inserito in `chat_messages` con role
`assistant` e rimandato al modello nelle richieste successive come se fosse una sua risposta.
Correzione: lasciare che i due rami producano il testo reale (anche vuoto), applicare `tErr("emptyReply")` una sola
volta dopo il try/catch per la risposta al client, e fare l'insert `role: "assistant"` solo se il testo reale non e'
vuoto. Il limite condiviso conta solo le righe `role: "user"`, quindi non cambia.
Accettazione: con una risposta senza testo la route restituisce 200 con `reply` = emptyReply tradotto e NON inserisce
righe assistant; con una risposta normale il comportamento e' identico a oggi; `emptyReply` compare una sola volta nel
file; `npm run lint` e `npx tsc --noEmit` in web/ passano.

### T2 — Chat: segnalare nei log una risposta del modello di riserva troncata
Gravita': Minore
File: web/app/api/agent/chat/route.ts:71-85 (`chatWithOpenAI`)
Problema: il ramo principale avvisa quando la risposta e' troncata (riga 235), il ramo OpenAI no.
Correzione: se `completion.choices[0]?.finish_reason === "length"`, `console.warn("Chat IA: risposta del fallback troncata, max_tokens raggiunto.")`.
Accettazione: il warn esiste solo per `finish_reason === "length"`; il valore restituito non cambia; lint e tsc passano.

Criteri di accettazione complessivi:
- `git diff --name-only origin/main` elenca solo `web/app/api/agent/chat/route.ts`.
- Tutti i criteri di T1 e T2 soddisfatti; in `web/` passano `npm run lint` e `npx tsc --noEmit`.
- Nessuna altra modifica di comportamento (U5, tentare il modello di riserva su risposta vuota, NON va implementato).

## Lavoratore 5

Branch: `claude/worker-5-2026-09-30` (creato da `origin/main` aggiornato).

File ammessi (gli unici modificabili):
- `web/lib/vehicleData.ts`

Ordine di esecuzione: T3.

### T3 — Catalogo: aggiungere la Corsa elettrica 156cv e correggere l'anno della Rafale plug-in
Gravita': Minore
File: web/lib/vehicleData.ts:1899-1906 (Opel Corsa), :2124-2127 (Renault Rafale)
Problema: manca la Corsa elettrica 156cv (in vendita dal 2023); la Rafale "E-Tech Plug-in Hybrid 4x4 300cv" parte dal
2024 ma e' in vendita dal 2025.
Correzione: aggiungere `{ label: "Elettrica 156cv", yearFrom: 2023, yearTo: null }` alla Corsa; portare a 2025 lo
`yearFrom` della Rafale plug-in. Nessun'altra modifica al catalogo.
Accettazione: `getEngines` (o la funzione equivalente) per Opel Corsa 2024 include "Elettrica 156cv"; la Rafale
plug-in non compare per il 2024 e compare per il 2025; nessuna voce doppia; lint e tsc passano.

Precisazione dell'agente 3: la funzione equivalente e' `getEngineVariants(type, make, model)` (`web/lib/vehicleData.ts:2867`); il filtro per anno si verifica su `yearFrom`/`yearTo` delle voci restituite.

Criteri di accettazione complessivi:
- `git diff --name-only origin/main` elenca solo `web/lib/vehicleData.ts`; il diff contiene solo una riga aggiunta (Corsa) e una riga modificata (Rafale).
- In `web/` passano `npm run lint` e `npx tsc --noEmit`.

## Lavoratore 6

Nessun task assegnato.

## Richiede intervento umano (non assegnato)

- U1 — Limite d'uso condiviso: serve una struttura dedicata in supabase/.
- U2 — Pausa del riquadro motorsport condivisa fra istanze: serve una struttura condivisa e una scelta sulle durate.
- U3 — Risposta del middleware per le API senza sessione: serve il via libera del proprietario.
- U4 — Invio della chat idempotente: serve una migrazione.
- U5 — Risposta vuota del modello principale e modello di riserva: scelta di costo.

## Gia' in PR

- #68 (solo `supabase/`): nessun task assegnato la tocca.
