# Scansione notturna dei bug — MyVehicle

Data scan: 2026-10-18 (UTC), eseguita alle 01:20
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
Dallo scan del 17/10 `main` non e' cambiato (ultimo commit: merge della PR #104): il codice sotto `web/` e `supabase/` e'
identico a quello gia' esaminato, quindi l'elenco qui sotto resta valido con gli stessi numeri di riga (ricontrollati a campione).
PR aperte al momento dello scan: #98 (`claude/worker-6-2026-10-10`), #96 (`claude/worker-4-2026-10-10`), #91 (`claude/worker-7-2026-10-07`), #68 (solo `supabase/`).
Le PR aperte dei lavoratori sono 3: per la regola sull'arretrato oggi non vengono creati task.

Nessun rilievo nuovo: il codice non e' cambiato dallo scan precedente.

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
File: `web/lib/vehicleData.ts:1572-1573`. E' un dato di catalogo (U15).

### M3 — Catalogo: nomi delle versioni Polestar scritti in due modi diversi (invariato)
File: `web/lib/vehicleData.ts:473-480`. Solo estetico (U15).

### M4 — Pagina documenti: filtro applicato dopo `.limit(50)` (invariato)
File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:29-38`. Rimandato finche' la PR #91 (stesso file) e' aperta.

### M5-M8 — Invariati (decisioni del proprietario, vedi U3-U6)
- Chat: il testo di riserva appare come una vera risposta (`web/components/ChatPanel.tsx`) = U6.
- Chat: una risposta vuota del modello principale non passa al modello di riserva (`web/app/api/agent/chat/route.ts:249`) = U5.
- API senza sessione: il middleware risponde con un messaggio in inglese (`web/middleware.ts`) = U3.
- Chat: dopo un invio dall'esito incerto la cronologia mostrata e' diversa da quella salvata = U4.

### M9 — Catalogo: Renault 5 Turbo 3E ha un anno di inizio successivo all'anno corrente (invariato)
File: `web/lib/vehicleData.ts:2272`; calcolo degli anni: `web/app/(dashboard)/veicoli/nuovo/page.tsx:63-71`
In pratica, scegliendo la versione "Turbo 3E Elettrica 555cv" (inizio 2027), il menu degli anni propone solo il 2026, cioe'
un anno precedente all'inizio indicato, perche' l'intervallo e' chiuso sull'anno corrente. E' un dato di catalogo da
confermare (U17), non un difetto del calcolo.
Proposta: confermare l'anno di inizio reale e, se e' 2027, decidere se tenere ora la versione in catalogo.

### M10 — Catalogo: anni di inizio da confermare per due nuove versioni (invariato)
File: `web/lib/vehicleData.ts:1585` (Jeep Wagoneer S, inizio 2026) e `:1873` (AMG GLC63 S E Performance, inizio 2024);
calcolo degli anni: `web/app/(dashboard)/veicoli/nuovo/page.tsx:63-71`
In pratica il menu degli anni parte da `yearFrom`: chi ha una Wagoneer S del 2024-2025 (anno modello 2024) o una GLC 63 S E
Performance del 2023 non trova il proprio anno. La C63 AMG con lo stesso motore (`:1842`) parte dal 2023.
Proposta: confermare gli anni di inizio reali (U18).

### M11 — Catalogo: potenze e struttura da confermare per due nuove versioni (invariato)
File: `web/lib/vehicleData.ts:548-551` (BYD Seal U DM-i), `:1585` (Jeep Wagoneer S)
In pratica "319cv" (Seal U DM-i AWD) e "600cv" (Wagoneer S) sembrano valori in hp anziche' in cavalli metrici come nel resto del
file (circa 324cv e 608cv). Inoltre la DM-i e' un modello a parte ("Seal U DM-i") accanto a "Seal U", cosi' chi sceglie "Seal U"
vede solo la versione elettrica. E' una scelta di catalogo.
Proposta: confermare potenze e collocazione della DM-i (U18).

### M12 — Catalogo: potenza della Jeep Recon e dati della nuova Lancia Gamma da confermare (invariato)
File: `web/lib/vehicleData.ts:1591` (Jeep Recon, "650cv"), `:1714-1720` (Lancia Gamma 2026)
In pratica "650cv" della Recon sembra il valore in hp (circa 659cv metrici), come gia' visto in M11 per la Wagoneer S. Le potenze
delle versioni Gamma 2026 (in particolare "HF Integrale Elettrica 375cv") sono da confermare sui dati ufficiali. Il modello Gamma
mescola la versione del 1976-1984 e quelle del 2026: il menu degli anni funziona per motorizzazione, quindi non e' un difetto.
Proposta: confermare le potenze (U18).

### M13 — Catalogo: generazioni vecchie e nuove sovrapposte sotto lo stesso modello (invariato)
File: `web/lib/vehicleData.ts:1017-1018` (iX3), `:2204-2209` (Macan), `:2256-2258` (Twingo), `:1896` (GLE)
In pratica le motorizzazioni della generazione precedente restano con `yearTo: null` accanto a quelle nuove: per una iX3 del 2026
il menu offre anche "286cv" (generazione precedente), per una Twingo 2026 compaiono "Elettrica 82cv" e "Elettrica 27,5 kWh 82cv"
quasi uguali, e "2.0 Turbo 265cv" della Macan arriva fino all'anno corrente. "AMG GLE63 S 4.0 V8 612cv" parte dal 2019, mentre la
GLS63 aggiunta insieme (stessa motorizzazione) parte dal 2020. La motorizzazione scelta finisce nel testo della ricerca IA.
Proposta: confermare gli anni di fine delle generazioni precedenti e l'anno di inizio della GLE63 S (U19).

### M14 — Catalogo: "ID. Polo" affiancata a "ID.2all" e "ID. Cross" con dati da confermare (invariato)
File: `web/lib/vehicleData.ts:216` (elenco modelli Volkswagen), `:2666-2676`
In pratica "ID.2all" (nome del prototipo da cui deriva la ID. Polo) resta nell'elenco senza motorizzazioni, accanto a "ID. Polo"
che ne ha quattro: la stessa auto puo' essere salvata con due nomi di modello. Le tre versioni di "ID. Cross" sono copie di quelle
della ID. Polo e i dati di produzione non sono ancora confermati. Togliere "ID.2all" cambierebbe l'elenco anche per i veicoli gia'
salvati con quel nome: e' una scelta del proprietario.
Proposta: decidere se togliere o rinominare "ID.2all" e confermare le versioni della ID. Cross (U19).

## Rilievi esaminati e non trasformati in task
- `web/lib/engineExtensions.ts:3-6` dice di aggiungere le nuove motorizzazioni li' "invece di gonfiare ENGINE_DATA", ma le PR di
  catalogo recenti (#99-#104) modificano direttamente `ENGINE_DATA`. Nessun effetto per l'utente; spostare i dati sarebbe
  riordino, non correzione di un difetto.
- Etichetta "AMG GLC63 S E Performance 2.0 Turbo Hybrid 680cv" (`web/lib/vehicleData.ts:1873`) con formato diverso da
  "C63 AMG ..." (`:1842`): solo estetico.
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
- U12 — Civic Type R (`web/lib/vehicleData.ts:1434-1435`): confermare anno 2022 e fine `null` invece di 2026.
- U13 — Valutare una pulizia una tantum delle righe di riserva gia' salvate in `chat_messages` (toglierebbe anche il confronto testuale in `web/lib/chatHistory.ts`).
- U14 — Confermare le potenze di Audi Q6 e-tron, A6 e-tron e Peugeot E-208 GTi.
- U15 — Confermare l'anno di inizio di Jeep Avenger 4xe e il formato delle etichette Polestar 3/4.
- U16 — Decidere se, quando una ricerca fallisce, i risultati precedenti vadano nascosti.
- U17 — Renault 5 Turbo 3E (`web/lib/vehicleData.ts:2272`): confermare l'anno di inizio (oggi 2027, oltre l'anno corrente).
- U18 — Confermare anni di inizio di Jeep Wagoneer S e AMG GLC63 S E Performance, potenze di Seal U DM-i AWD, Wagoneer S, Jeep Recon e Lancia Gamma 2026, e se la DM-i debba stare sotto "Seal U" (M10, M11, M12).
- U19 — Confermare gli anni di fine delle generazioni precedenti di iX3, Macan e Twingo, l'anno di inizio della AMG GLE63 S, le versioni della ID. Cross e decidere se tenere "ID.2all" accanto a "ID. Polo" (M13, M14).

## Gia' in PR
- #98: copia doppia di Hyundai Inster.
- #96: uniformare gli spazi nel testo della ricerca IA (copre anche il testo predefinito della pagina veicolo).
- #91: testi di riserva in un modulo dedicato e `check:cache`; stesso file di M4.
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
