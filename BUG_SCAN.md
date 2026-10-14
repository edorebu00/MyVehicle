# Scansione notturna dei bug — MyVehicle

Data scan: 2026-10-14 (UTC), eseguita alle 01:18
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
Rispetto allo scan del 13/10 su `main` e' cambiato solo `web/lib/vehicleData.ts` (PR #101: nuova Renault Clio, Renault 5 Turbo 3E,
Nissan Micra elettrica, nuova Jeep Compass). Le nuove righe sono state controllate: nessuna chiave duplicata nello stesso oggetto;
"5 Turbo 3E" compare anche in `web/lib/catalogueSweep.ts:83`, ma `getModels` (`web/lib/vehicleData.ts:295`) elimina i doppioni.
Il resto del codice sotto `web/`, comprese le route di `web/app/api/` e `web/middleware.ts`, e' identico allo scan precedente.
PR aperte al momento dello scan: #98 (`claude/worker-6-2026-10-10`), #96 (`claude/worker-4-2026-10-10`), #91 (`claude/worker-7-2026-10-07`), #68 (solo `supabase/`).

Un solo rilievo nuovo, minore (M9, dato di catalogo); il resto dell'elenco e' quello gia' verificato, ricontrollato sul codice attuale.

Ogni problema qui sotto e' stato verificato leggendo di persona il codice indicato.

## Bloccante

Nessun problema bloccante trovato.

## Importante

Nessun problema importante nuovo trovato.

## Minore

### M1 — Chat: il campo di testo non ha un limite di lunghezza, ma il server tronca a 4000 caratteri (invariato, in attesa per arretrato)
File: `web/components/ChatPanel.tsx:126-131`; limite lato server: `web/app/api/agent/chat/route.ts:35,134`
In pratica, se un utente incolla una domanda piu' lunga di 4000 caratteri, la bolla mostra tutto il testo, ma il server salva e
manda al modello solo i primi 4000. La risposta ignora la parte finale e, ricaricando la pagina, la domanda appare accorciata
senza spiegazione. I campi della ricerca e del veicolo hanno gia' `maxLength` (PR #94, #97); quello della chat no.
Proposta: esportare il limite da `web/lib/validation.ts` (come `MAX_QUERY_CHARS`), usarlo nella route e mettere `maxLength` sull'input della chat.

### M2 — Catalogo: anno di inizio di Jeep Avenger 4xe da confermare (invariato)
File: `web/lib/vehicleData.ts:1559`. E' un dato di catalogo (U15).

### M3 — Catalogo: nomi delle versioni Polestar scritti in due modi diversi (invariato)
File: `web/lib/vehicleData.ts:470-480`. Solo estetico (U15).

### M4 — Pagina documenti: filtro applicato dopo `.limit(50)` (invariato)
File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:29-38`. Rimandato finche' la PR #91 (stesso file) e' aperta.

### M5-M8 — Invariati (decisioni del proprietario, vedi U3-U6)
- Chat: il testo di riserva appare come una vera risposta (`web/components/ChatPanel.tsx`) = U6.
- Chat: una risposta vuota del modello principale non passa al modello di riserva (`web/app/api/agent/chat/route.ts:249`) = U5.
- API senza sessione: il middleware risponde con un messaggio in inglese (`web/middleware.ts`) = U3.
- Chat: dopo un invio dall'esito incerto la cronologia mostrata e' diversa da quella salvata = U4.

### M9 — Catalogo: Renault 5 Turbo 3E ha un anno di inizio successivo all'anno corrente (nuovo)
File: `web/lib/vehicleData.ts:2253`; calcolo degli anni: `web/app/(dashboard)/veicoli/nuovo/page.tsx:63-71`
In pratica, scegliendo la versione "Turbo 3E Elettrica 555cv" (inizio 2027), il menu degli anni propone solo il 2026, cioe'
un anno precedente all'inizio indicato, perche' l'intervallo e' chiuso sull'anno corrente. E' un dato di catalogo da
confermare (U17), non un difetto del calcolo.
Proposta: confermare l'anno di inizio reale e, se e' 2027, decidere se tenere ora la versione in catalogo.

## Rilievi esaminati e non trasformati in task
- `web/lib/chatHistory.ts:1-3`: importa i tre file di traduzione completi per leggere tre stringhe. E' usato solo lato server
  (route della chat e pagina documenti), quindi non pesa sul bundle del browser; il file e' comunque spostato dalla PR #91.
- `web/lib/validation.ts:50`: `collapseWhitespace` ha lo stesso nome di un helper di `web/lib/extractedText.ts:46` con
  comportamento diverso. E' un rischio di confusione futura, non un difetto osservato: niente refactoring.
- `maxLength={80}` ripetuto in `web/app/(dashboard)/veicoli/nuovo/page.tsx` e limite privato nella route di ricerca: riordino, non un difetto.
- `web/app/(dashboard)/veicoli/[id]/page.tsx:77-84`: il testo di ricerca predefinito non uniforma gli spazi; l'effetto si
  risolve lato server con la PR #96.
- `GlobalSearch.tsx:44-46` e `:31`: invariati rispetto allo scan del 10/10 (vedi U16).

## Richiede intervento umano
- U1 — Il limite d'uso condiviso si appoggia a righe che l'account puo' rimuovere: serve una struttura dedicata in `supabase/`.
- U2 — La pausa del riquadro motorsport vive nella memoria di istanza e ha una durata fissa (`web/lib/motorsport.ts`).
- U3 — Risposta del middleware per le API senza sessione: serve il via libera del proprietario.
- U4 — Rendere idempotente l'invio della chat: serve una migrazione.
- U5 — Decidere se una risposta vuota del modello principale debba tentare il modello di riserva: e' una scelta di costo.
- U6 — Decidere come mostrare il testo di riserva nel client (bolla o messaggio d'errore).
- U7 — Decidere se, scelto "Altro", il motore scritto a mano debba essere obbligatorio.
- U8 — Decidere se gli anni vadano limitati al periodo della motorizzazione o offerti sempre per intero.
- U11 — Portare a livello di database i limiti di lunghezza e il controllo di marca/modello non vuoti di `vehicles` (migrazione).
- U12 — Civic Type R (`web/lib/vehicleData.ts:1421-1422`): confermare anno 2022 e fine `null` invece di 2026.
- U13 — Valutare una pulizia una tantum delle righe di riserva gia' salvate in `chat_messages` (toglierebbe anche il confronto testuale in `web/lib/chatHistory.ts`).
- U14 — Confermare le potenze di Audi Q6 e-tron, A6 e-tron e Peugeot E-208 GTi.
- U15 — Confermare l'anno di inizio di Jeep Avenger 4xe e il formato delle etichette Polestar 3/4.
- U16 — Decidere se, quando una ricerca fallisce, i risultati precedenti vadano nascosti.
- U17 — Renault 5 Turbo 3E (`web/lib/vehicleData.ts:2253`): confermare l'anno di inizio (oggi 2027, oltre l'anno corrente).

## Gia' in PR
- #98: copia doppia di Hyundai Inster.
- #96: uniformare gli spazi nel testo della ricerca IA (copre anche il testo predefinito della pagina veicolo).
- #91: testi di riserva in un modulo dedicato e `check:cache`; stesso file di M4.
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
