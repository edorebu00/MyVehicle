Data (UTC): 2026-10-09

## Task assegnabili

### T1 — Ricerca IA: normalizza gli spazi dei campi del veicolo prima di comporre il testo per il modello
Gravita': Minore (rafforzamento)
File: `web/app/api/agent/search/route.ts:408-415`
Problema: marca, modello e motore passano da `clampText` (toglie gli spazi in testa e in coda, poi taglia) e vengono inseriti
cosi' come sono nella riga "Veicolo di riferimento". A capo, tabulazioni o altri caratteri di controllo salvati nei campi
finiscono nel testo inviato al modello e ne cambiano la struttura.
Correzione richiesta: prima di `clampText`, sostituire in ciascuno dei tre campi ogni sequenza di spazi bianchi o caratteri di
controllo (`/[\s\u0000-\u001f\u007f]+/g`) con un solo spazio. Basta una piccola funzione locale nella route, o un helper in
`web/lib/validation.ts` accanto a `clampText`. Non cambiare il comportamento di `clampText` per gli altri chiamanti.
Accettazione: con `make = "Fiat\nRicerca: x"` la riga ottenuta e' `Veicolo di riferimento: auto Fiat Ricerca: x ...` su una
sola riga. I valori normali restano identici. `npx tsc --noEmit` e `npm run lint` in `web/` passano.

### T2 — Ricerca IA: non tagliare in silenzio il testo della ricerca oltre il limite del server
Gravita': Minore
File: `web/components/VehicleDetailTabs.tsx:216-221`, `web/app/(dashboard)/veicoli/[id]/page.tsx:76`
(limite del server: `web/app/api/agent/search/route.ts:28`)
Problema: il server accetta al massimo 200 caratteri (`MAX_QUERY_CHARS`) e scarta il resto. Il campo di ricerca non ha
`maxLength`, e `defaultQuery` (marca + modello + motore, fino a 242 caratteri) puo' superare il limite: la ricerca automatica
perde la parte finale a meta' parola.
Correzione richiesta: aggiungere `maxLength={200}` all'`<input>` di ricerca in `VehicleDetailTabs.tsx`. In `page.tsx`
limitare `defaultQuery` a 200 caratteri, tagliando all'ultimo spazio entro il limite quando serve. Il valore 200 deve
coincidere con `MAX_QUERY_CHARS`: se lo si esporta, farlo da un modulo condiviso (es. `web/lib/validation.ts`) senza far
importare la route dal client.
Accettazione: con marca, modello e motore da 80 caratteri ciascuno, `defaultQuery` ha al massimo 200 caratteri e non finisce
a meta' parola. Nel campo di ricerca non si possono digitare piu' di 200 caratteri. `npx tsc --noEmit` e `npm run lint` in
`web/` passano.

## Rimandati (stesso file di una PR aperta)
- Pagina documenti `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx`: secondo criterio di ordinamento per `id`; filtro dei
  testi di riserva e del contenuto vuoto applicato prima del taglio a 50 (BUG_SCAN M3/M4). Da proporre dopo l'unione della PR #91.

## Richiede intervento umano
Vedi BUG_SCAN.md, sezione "Richiede intervento umano" (U1-U8, U11-U14): non vanno assegnati.

## Gia' in PR
- #91: modulo dedicato per i testi di riserva e ripristino di `check:cache`.
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
