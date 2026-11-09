# Scansione notturna dei bug — MyVehicle

Data scan: 2026-11-09 (UTC), eseguita alle 01:18
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json` e i file generati con l'intestazione "GENERATO DA").
Dallo scan del 08/11 `main` ha un solo cambiamento nuovo: la PR #119 (`cb631ef`, unita con `844a73c`), che aggiunge solo dati di
catalogo in `web/lib/vehicleData.ts` (Ferrari Luce, Alfa Romeo Stelvio Quadrifoglio Q4 520cv, BMW Serie 3 generazione 2026,
Ford Explorer elettrica).
Nessun altro file sotto `web/` o `supabase/` e' cambiato (verificato con `git diff 23fdad1 origin/main`), quindi le route di
`web/app/api/agent/*` (chat, process-document, search) e i rilievi gia' noti restano quelli verificati negli scan precedenti;
la revisione di oggi si e' concentrata sul codice cambiato.
Verifica della PR #119 fatta leggendo il codice: "Luce" e' stato aggiunto sia all'elenco dei modelli Ferrari delle estensioni
(`web/lib/vehicleData.ts:161`) sia a `ENGINE_DATA` (riga 478), quindi il modello compare nel menu con la sua motorizzazione;
le altre voci stanno sotto le chiavi gia' esistenti `Alfa Romeo.Stelvio`, `BMW.Serie 3` e `Ford.Explorer` (nessuna chiave doppia);
Stelvio (auto), Serie 3 ed Explorer non hanno voci in `web/lib/engineExtensions.ts` (la "Stelvio" li' e' quella Moto Guzzi),
quindi non ci sono doppioni con le estensioni. Pero' le voci nuove si affiancano a quelle precedenti lasciate aperte: vedi M23.
PR aperte al momento dello scan: #98 (`claude/worker-6-2026-10-10`), #96 (`claude/worker-4-2026-10-10`), #91 (`claude/worker-7-2026-10-07`), #68 (solo `supabase/`).
Le PR aperte dei lavoratori sono 3: per la regola sull'arretrato oggi non vengono creati task.
I numeri di riga di `web/lib/vehicleData.ts` dei rilievi M2-M15 si riferiscono al file prima delle PR #106-#117
(con la PR #109 le righe successive alla 1477 si spostano di 3, quelle successive alla 1844 di 7, quelle successive alla 2219 di 13;
con le PR #110-#111 le righe successive alla 453 si spostano di altre 3, alla 575 di 8, alla 596 di 16, alla 624 di 20;
con la PR #112 le righe successive alla 1157 si spostano di altre 1, alla 1508 di 2, alla 2309 di 4;
con la PR #113 le righe successive alla 2204 si spostano di altre 5, alla 2475 di 15, alla 2726 di 25;
con la PR #114 le righe successive alla 829 si spostano di altre 5, alla 869 di 6, alla 876 di 7, alla 2672 di 14;
con la PR #115, nel file del 04/11, le righe successive alla 604 si spostano di altre 4, alla 884 di 8, alla 1675 di 13, alla 2472 di 17;
con la PR #116, nel file del 05/11, le righe successive alla 452 si spostano di altre 2, alla 2772 di 7, alla 2847 di 15;
con la PR #117, nel file del 06/11, le righe successive alla 848 si spostano di altre 3, alla 1095 di 5, alla 1931 di 6
(quindi `getEngineVariants`, indicata in M18 e M19 alle righe 3181-3196, era a `web/lib/vehicleData.ts:3202-3217` nel file del 07/11);
con la PR #118, nel file del 07/11, le righe successive alla 1223 si spostano di altre 1, alla 2008 di 6, alla 2451 di 7
(quindi `getEngineVariants` era a `web/lib/vehicleData.ts:3209-3224` nel file del 08/11);
con la PR #119, nel file del 08/11, le righe successive alla 477 si spostano di altre 1, alla 727 di 2, alla 984 di 5, alla 1483 di 10
(quindi `getEngineVariants` e' ora a `web/lib/vehicleData.ts:3219-3234`).
I riferimenti di M20 si riferiscono al file del 06/11, quelli di M21 al file del 07/11, quelli di M22 al file del 08/11, quelli di M23 al file attuale.

Un problema nuovo, Minore (M23): e' un dato di catalogo da confermare, quindi va in "Richiede intervento umano" (U28).
I rilievi M1-M22 restano aperti come descritti.

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
File: `web/lib/vehicleData.ts:1589`. E' un dato di catalogo (U15).

### M3 — Catalogo: nomi delle versioni Polestar scritti in due modi diversi (invariato)
File: `web/lib/vehicleData.ts:477-484`. Solo estetico (U15).

### M4 — Pagina documenti: filtro applicato dopo `.limit(50)` (invariato)
File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:29-38`. Rimandato finche' la PR #91 (stesso file) e' aperta.

### M5-M8 — Invariati (decisioni del proprietario, vedi U3-U6)
- Chat: il testo di riserva appare come una vera risposta (`web/components/ChatPanel.tsx`) = U6.
- Chat: una risposta vuota del modello principale non passa al modello di riserva (`web/app/api/agent/chat/route.ts:249`) = U5.
- API senza sessione: il middleware risponde con un messaggio in inglese (`web/middleware.ts`) = U3.
- Chat: dopo un invio dall'esito incerto la cronologia mostrata e' diversa da quella salvata = U4.

### M9 — Catalogo: Renault 5 Turbo 3E ha un anno di inizio successivo all'anno corrente (invariato)
File: `web/lib/vehicleData.ts:2301`; calcolo degli anni: `web/app/(dashboard)/veicoli/nuovo/page.tsx:63-71`
In pratica, scegliendo la versione "Turbo 3E Elettrica 555cv" (inizio 2027), il menu degli anni propone solo il 2026, cioe'
un anno precedente all'inizio indicato, perche' l'intervallo e' chiuso sull'anno corrente. E' un dato di catalogo da
confermare (U17), non un difetto del calcolo.
Proposta: confermare l'anno di inizio reale e, se e' 2027, decidere se tenere ora la versione in catalogo.

### M10 — Catalogo: anni di inizio da confermare per due nuove versioni (invariato)
File: `web/lib/vehicleData.ts:1599` (Jeep Wagoneer S, inizio 2026) e `:1897` (AMG GLC63 S E Performance, inizio 2024);
calcolo degli anni: `web/app/(dashboard)/veicoli/nuovo/page.tsx:63-71`
In pratica il menu degli anni parte da `yearFrom`: chi ha una Wagoneer S del 2024-2025 (anno modello 2024) o una GLC 63 S E
Performance del 2023 non trova il proprio anno. La C63 AMG con lo stesso motore (`:1866`) parte dal 2023.
Proposta: confermare gli anni di inizio reali (U18).

### M11 — Catalogo: potenze e struttura da confermare per due nuove versioni (invariato)
File: `web/lib/vehicleData.ts:552-555` (BYD Seal U DM-i), `:1599` (Jeep Wagoneer S)
In pratica "319cv" (Seal U DM-i AWD) e "600cv" (Wagoneer S) sembrano valori in hp anziche' in cavalli metrici come nel resto del
file (circa 324cv e 608cv). Inoltre la DM-i e' un modello a parte ("Seal U DM-i") accanto a "Seal U", cosi' chi sceglie "Seal U"
vede solo la versione elettrica. E' una scelta di catalogo.
Proposta: confermare potenze e collocazione della DM-i (U18).

### M12 — Catalogo: potenza della Jeep Recon e dati della nuova Lancia Gamma da confermare (invariato)
File: `web/lib/vehicleData.ts:1600` (Jeep Recon, "650cv"), `:1723-1729` (Lancia Gamma 2026)
In pratica "650cv" della Recon sembra il valore in hp (circa 659cv metrici), come gia' visto in M11 per la Wagoneer S. Le potenze
delle versioni Gamma 2026 (in particolare "HF Integrale Elettrica 375cv") sono da confermare sui dati ufficiali. Il modello Gamma
mescola la versione del 1976-1984 e quelle del 2026: il menu degli anni funziona per motorizzazione, quindi non e' un difetto.
Proposta: confermare le potenze (U18).

### M13 — Catalogo: generazioni vecchie e nuove sovrapposte sotto lo stesso modello (invariato)
File: `web/lib/vehicleData.ts:1022-1025` (iX3), `:2209-2215` (Macan), `:2261-2265` (Twingo), `:1902` (GLE)
In pratica le motorizzazioni della generazione precedente restano con `yearTo: null` accanto a quelle nuove: per una iX3 del 2026
il menu offre anche "286cv" (generazione precedente), per una Twingo 2026 compaiono "Elettrica 82cv" e "Elettrica 27,5 kWh 82cv"
quasi uguali, e "2.0 Turbo 265cv" della Macan arriva fino all'anno corrente. "AMG GLE63 S 4.0 V8 612cv" parte dal 2019, mentre la
GLS63 aggiunta insieme (stessa motorizzazione) parte dal 2020. La motorizzazione scelta finisce nel testo della ricerca IA.
Proposta: confermare gli anni di fine delle generazioni precedenti e l'anno di inizio della GLE63 S (U19).

### M14 — Catalogo: "ID. Polo" affiancata a "ID.2all" e "ID. Cross" con dati da confermare (invariato)
File: `web/lib/vehicleData.ts:216` (elenco modelli Volkswagen), `:2672-2682`
In pratica "ID.2all" (nome del prototipo da cui deriva la ID. Polo) resta nell'elenco senza motorizzazioni, accanto a "ID. Polo"
che ne ha quattro: la stessa auto puo' essere salvata con due nomi di modello. Le tre versioni di "ID. Cross" sono copie di quelle
della ID. Polo e i dati di produzione non sono ancora confermati. Togliere "ID.2all" cambierebbe l'elenco anche per i veicoli gia'
salvati con quel nome: e' una scelta del proprietario.
Proposta: decidere se togliere o rinominare "ID.2all" e confermare le versioni della ID. Cross (U19).

### M15 — Catalogo: anno di passaggio della Yaris Cross Hybrid 130 da confermare (invariato)
File: `web/lib/vehicleData.ts:2508-2511`; calcolo degli anni: `web/app/(dashboard)/veicoli/nuovo/page.tsx:63-71`
In pratica la versione "1.5 Hybrid 130cv" parte dal 2026 e la "116cv" finisce nel 2025: se la 130cv e' arrivata gia' con il
model year 2025 (fine 2024), chi ha una Yaris Cross 130cv del 2025 non trova il proprio anno. E' un dato di catalogo (U20).
Proposta: confermare l'anno di inizio reale della 130cv e, se serve, anticiparlo.

### M16 — Catalogo: GWM "Ora Funky Cat" e "Ora 03" sono la stessa auto, entrambe aperte fino a oggi (invariato)
File: `web/lib/vehicleData.ts:596-600` (nel file attuale)
In pratica "Ora 03" e' il nome con cui la Funky Cat e' venduta in Europa dal 2024, ma "Ora Funky Cat" resta con `yearTo: null`:
chi ha questa auto puo' salvarla con due nomi di modello, e per un'auto del 2025 la Funky Cat propone ancora "Elettrica 171cv"
senza capacita' della batteria. Sono dati di catalogo da confermare, come per M13-M14 (anche gli anni di inizio di BYD Han
e Tang, 2023, e la batteria da 108,8 kWh della Tang dal 2025 vanno confermati sui dati ufficiali).
Proposta: confermare se chiudere la Funky Cat al 2023 e gli anni delle nuove voci BYD (U21).

### M17 — Catalogo: Citroën ë-C3 presente sia come versione di "C3" sia come modello a se' senza motorizzazioni (invariato)
File: `web/lib/vehicleData.ts:1161-1166` (nel file attuale); modello separato: `web/lib/catalogueSweep.ts:29` ("ë-C3")
In pratica la PR #112 aggiunge "Elettrica ë-C3 113cv" sotto il modello "C3", ma l'elenco modelli Citroën contiene anche "ë-C3"
(dal catalogo esteso, senza motorizzazioni): chi sceglie "ë-C3" trova solo il campo libero, chi sceglie "C3" trova la versione
elettrica, e la stessa auto puo' essere salvata con due nomi. Inoltre le tre motorizzazioni della C3 del 2016 restano con
`yearTo: null` accanto a quella della nuova generazione 2024, come gia' visto in M13. E' una scelta di catalogo (U22).
Proposta: decidere sotto quale nome tenere la ë-C3 e confermare l'anno di fine delle versioni 2016 della C3.

### M18 — Catalogo: le nuove voci di ID.7, ID. Buzz, Smart #1 e #3 si sommano a quelle gia' presenti con nomi diversi (invariato)
File: `web/lib/vehicleData.ts:2505-2514` (Smart #1/#3) e `:2773-2782` (ID. Buzz/ID.7) nel file attuale; voci gia' esistenti:
`web/lib/engineExtensions.ts:146-153` (ID.7, ID. Buzz) e `:811-818` (#1, #3); unione: `web/lib/vehicleData.ts:3181-3196`
In pratica `getEngineVariants` somma `ENGINE_DATA` ed `ENGINE_EXTENSIONS` togliendo solo le etichette identiche, e la PR #113 ha
aggiunto in `ENGINE_DATA` motorizzazioni che esistevano gia' nelle estensioni con un'etichetta diversa. Il menu mostra quindi
doppioni della stessa versione: per la ID.7 "Pro Elettrica 77 kWh 286cv" e "Elettrica 77 kWh 286cv", "Pro S Elettrica 86 kWh 286cv"
e "Elettrica 86 kWh 286cv"; per Smart #1 e #3 "Brabus Elettrica 66 kWh AWD 428cv" e "Brabus 66 kWh 428cv". Per la ID. Buzz
compaiono sia "Elettrica 79 kWh 286cv" (dal 2024) sia "Elettrica 86 kWh 286cv" (dal 2023), con batterie diverse per la stessa
versione; "Elettrica 77 kWh 204cv" ora chiude al 2024 perche' a parita' di etichetta vince la voce di `ENGINE_DATA`. Per la #1
"Elettrica 66 kWh 272cv" parte ora dal 2023 invece che dal 2022 (stesso motivo): chi ha una #1 del 2022 non trova piu' il proprio
anno per quella versione. La e-5008 non ha doppioni (nessuna voce nelle estensioni). Quali etichette e quali anni siano giusti e'
un dato di catalogo da confermare (U23).
Proposta: tenere una sola voce per versione (in `ENGINE_DATA` o nelle estensioni) dopo aver confermato batterie e anni di inizio.

### M19 — Catalogo: le nuove motorizzazioni della Kia Seltos si sommano a quelle gia' presenti nelle estensioni (invariato)
File: `web/lib/vehicleData.ts:1684-1688` (voci aggiunte dalla PR #115); voci gia' esistenti: `web/lib/engineExtensions.ts:731-734`;
unione: `web/lib/vehicleData.ts:3181-3196`
In pratica `getEngineVariants` toglie solo le etichette identiche, quindi per la Seltos il menu mostra cinque versioni:
"1.6 T-GDI 180cv", "1.6 Full Hybrid 154cv" e "1.6 Full Hybrid e-AWD 178cv" dal 2026, piu' "1.6 T-GDI 177cv" e "1.6 CRDi 136cv"
dal 2019 con `yearTo: null`. "1.6 T-GDI 180cv" e "1.6 T-GDI 177cv" sembrano la stessa versione con due potenze diverse, e le voci
della generazione 2019 restano aperte fino a oggi accanto a quelle 2026, come gia' visto in M13 e M18. Quale potenza e quale anno
di fine siano giusti e' un dato di catalogo da confermare (U24).
Proposta: tenere una sola voce per il 1.6 T-GDI e chiudere le versioni 2019 all'anno corretto, dopo averli confermati.

### M20 — Catalogo: le nuove motorizzazioni di ID.5, C40, C10 e T03 si sommano a quelle gia' presenti nelle estensioni (invariato)
File: `web/lib/vehicleData.ts:453-454` (Leapmotor C10/T03), `:2775-2779` (ID.5), `:2850-2857` (C40/EX40), voci aggiunte dalla PR #116;
voci gia' esistenti: `web/lib/engineExtensions.ts:141-145` (ID.5), `:615-618` (C40), `:837-843` (C10, T03); unione: `web/lib/vehicleData.ts:3196-3211`
In pratica `getEngineVariants` toglie solo le etichette identiche, quindi il menu mostra doppioni della stessa versione:
per la T03 "Elettrica 37.3 kWh 95cv" e "Elettrica 95cv"; per la C10 "Elettrica 69.9 kWh 218cv" e "Elettrica RWD 218cv";
per la ID.5 "GTX 4motion 299cv" (2022-2024) e "GTX 77 kWh 299cv" (dal 2021, aperta fino a oggi), accanto alle versioni 174/204cv
delle estensioni e alla "Pro 77 kWh 286cv" nuova; per la C40 "Recharge Single Motor 69 kWh 238cv" e "Recharge Twin 82 kWh AWD 408cv"
chiuse al 2024, accanto a "Elettrica 69 kWh 238cv" e "Elettrica 78 kWh 408cv" delle estensioni aperte fino a oggi (anni di fine e
batteria della Twin, 78 o 82 kWh, in contrasto tra le due fonti). Per la EX40 la versione "Single Motor Extended Range 252cv" e'
indicata con la stessa batteria da 70 kWh della Single Motor: il valore della batteria e' da confermare. Quali etichette, batterie e
anni siano giusti e' un dato di catalogo da confermare (U25), come gia' visto in M18 e M19.
Proposta: tenere una sola voce per versione (in `ENGINE_DATA` o nelle estensioni) dopo aver confermato batterie e anni.

### M21 — Catalogo: nuove motorizzazioni di Audi A5 e BMW X5 accanto a quelle della generazione precedente ancora aperte (invariato)
File: `web/lib/vehicleData.ts:846-851` (A5), `:1096-1101` (X5)
In pratica, come in M13: sotto "A5" le voci 2016 ("2.0 TDI 190cv", "2.0 TFSI 252cv") restano con `yearTo: null` accanto alle
nuove voci 2024 ("2.0 TDI mhev 204cv", "2.0 TFSI 204cv"), quindi per una A5 del 2025 il menu offre insieme motori di due
generazioni diverse; lo stesso succede sotto "X5" per una X5 del 2026 ("30d 3.0 286cv" del 2018 accanto a "40d xDrive 3.0 313cv").
La motorizzazione scelta finisce nel testo della ricerca IA. Le etichette nuove della X5 ("40d xDrive 3.0 313cv",
"40 xDrive 3.0 400cv") hanno anche un formato diverso da quelle gia' presenti ("30d 3.0 286cv"): solo estetico.
Proposta: confermare l'anno di fine delle voci della generazione precedente di A5 e X5 (U26).

### M22 — Catalogo: nuove motorizzazioni della Mini Countryman 2024 accanto a quelle della generazione 2017 ancora aperte (invariato)
File: `web/lib/vehicleData.ts:2006-2015`
In pratica, come in M13 e M21: sotto "Countryman" le voci 2017 ("1.5 Cooper 136cv", "2.0 Cooper S 178cv",
"Cooper SE Plug-in Hybrid 224cv") restano con `yearTo: null` accanto alle cinque nuove voci 2024 ("1.5 C 170cv",
"2.0 S ALL4 218cv", "John Cooper Works ALL4 300cv", le due elettriche), quindi per una Countryman del 2025 il menu offre insieme
motori di due generazioni diverse; la motorizzazione scelta finisce nel testo della ricerca IA.
Proposta: confermare l'anno di fine delle voci 2017 della Countryman (U27).

### M23 — Catalogo: nuove motorizzazioni di BMW Serie 3, Ford Explorer e Stelvio Quadrifoglio accanto a quelle precedenti ancora aperte (nuovo)
File: `web/lib/vehicleData.ts:981-990`, `web/lib/vehicleData.ts:725-730`, `web/lib/vehicleData.ts:1489-1494`
In pratica, come in M13, M21 e M22: sotto "Serie 3" le voci 2012/2019 ("318d 2.0 150cv", "320d 2.0 190cv", "330d 3.0 265cv",
"320i 2.0 184cv", "M340i 3.0 374cv") restano con `yearTo: null` accanto alle tre nuove voci 2026 ("318 2.0 Turbo 156cv",
"320 2.0 Turbo 211cv", "M350 xDrive 3.0 443cv"); sotto "Explorer" la "3.0 EcoBoost PHEV 457cv" del 2019 resta aperta accanto alle
tre elettriche 2024; sotto "Stelvio" la "2.9 V6 Bi-Turbo Quadrifoglio 510cv" resta aperta accanto alla "Quadrifoglio Q4 520cv"
del 2026. Per un veicolo del 2026 il menu offre quindi motori di generazioni o aggiornamenti diversi insieme; la motorizzazione
scelta finisce nel testo della ricerca IA.
Proposta: confermare l'anno di fine delle voci precedenti di Serie 3, Explorer e Stelvio Quadrifoglio (U28).

## Rilievi esaminati e non trasformati in task
- `web/lib/engineExtensions.ts:3-6` dice di aggiungere le nuove motorizzazioni li' "invece di gonfiare ENGINE_DATA", ma le PR di
  catalogo recenti (#99-#104) modificano direttamente `ENGINE_DATA`. Nessun effetto per l'utente; spostare i dati sarebbe
  riordino, non correzione di un difetto.
- Etichetta "AMG GLC63 S E Performance 2.0 Turbo Hybrid 680cv" (`web/lib/vehicleData.ts:1897`) con formato diverso da
  "C63 AMG ..." (`:1866`): solo estetico.
- `web/lib/chatHistory.ts:1-3`: importa i tre file di traduzione completi per leggere tre stringhe. E' usato solo lato server
  (route della chat e pagina documenti), quindi non pesa sul bundle del browser; il file e' comunque spostato dalla PR #91.
- `web/lib/validation.ts:50`: `collapseWhitespace` ha lo stesso nome di un helper di `web/lib/extractedText.ts:46` con
  comportamento diverso. E' un rischio di confusione futura, non un difetto osservato: niente refactoring.
- `maxLength={80}` ripetuto in `web/app/(dashboard)/veicoli/nuovo/page.tsx` e limite privato nella route di ricerca: riordino, non un difetto.
- `web/app/(dashboard)/veicoli/[id]/page.tsx:77-84`: il testo di ricerca predefinito non uniforma gli spazi; l'effetto si
  risolve lato server con la PR #96.
- `GlobalSearch.tsx:44-46` e `:31`: invariati rispetto allo scan del 10/10 (vedi U16).

- PR #114: le versioni della S3 compaiono ora sia sotto il modello "S3" sia sotto "A3" ("2.0 TFSI S3 ...", gia' presenti), e lo
  stesso vale per "SQ5"/"Q5" e "SQ8"/"Q8": la stessa auto puo' essere salvata con due nomi di modello, come gia' accadeva per
  altre coppie (M14, M17). Gli anni coincidono con quelli delle voci gia' esistenti; l'anno di inizio 2016 della SQ5 3.0 TDI e'
  ripreso dalla voce gia' presente sotto Q5. Scelta di catalogo, non un difetto del codice.

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
- U12 — Civic Type R (`web/lib/vehicleData.ts:1448-1449`): confermare anno 2022 e fine `null` invece di 2026.
- U13 — Valutare una pulizia una tantum delle righe di riserva gia' salvate in `chat_messages` (toglierebbe anche il confronto testuale in `web/lib/chatHistory.ts`).
- U14 — Confermare le potenze di Audi Q6 e-tron, A6 e-tron e Peugeot E-208 GTi.
- U15 — Confermare l'anno di inizio di Jeep Avenger 4xe e il formato delle etichette Polestar 3/4.
- U16 — Decidere se, quando una ricerca fallisce, i risultati precedenti vadano nascosti.
- U17 — Renault 5 Turbo 3E (`web/lib/vehicleData.ts:2301`): confermare l'anno di inizio (oggi 2027, oltre l'anno corrente).
- U18 — Confermare anni di inizio di Jeep Wagoneer S e AMG GLC63 S E Performance, potenze di Seal U DM-i AWD, Wagoneer S, Jeep Recon e Lancia Gamma 2026, e se la DM-i debba stare sotto "Seal U" (M10, M11, M12).
- U19 — Confermare gli anni di fine delle generazioni precedenti di iX3, Macan e Twingo, l'anno di inizio della AMG GLE63 S, le versioni della ID. Cross e decidere se tenere "ID.2all" accanto a "ID. Polo" (M13, M14).
- U20 — Confermare l'anno di inizio della Toyota Yaris Cross 1.5 Hybrid 130cv (M15).
- U21 — Decidere se chiudere "Ora Funky Cat" all'arrivo di "Ora 03" e confermare gli anni di BYD Han e Tang (M16).
- U22 — Decidere se la Citroën ë-C3 vada sotto "C3" o sotto il modello "ë-C3" e confermare la fine delle versioni 2016 della C3 (M17).
- U23 — Scegliere un'unica voce per ciascuna motorizzazione di ID.7, ID. Buzz, Smart #1 e #3, confermando batterie (ID. Buzz 79 o 86 kWh) e anni di inizio (Smart #1 2022 o 2023) (M18).
- U24 — Kia Seltos: confermare la potenza del 1.6 T-GDI (177 o 180cv) e l'anno di fine delle versioni 2019, tenendo una sola voce per versione (M19).
- U25 — ID.5, C40, Leapmotor C10 e T03: scegliere un'unica voce per ciascuna motorizzazione, confermando batteria della C40 Twin (78 o 82 kWh), anno di fine della C40 e batteria della EX40 Extended Range (M20).
- U26 — Audi A5 e BMW X5: confermare l'anno di fine delle motorizzazioni della generazione precedente, oggi aperte fino all'anno corrente (M21).
- U27 — Mini Countryman: confermare l'anno di fine delle motorizzazioni della generazione 2017, oggi aperte accanto a quelle 2024 (M22).
- U28 — BMW Serie 3, Ford Explorer e Alfa Romeo Stelvio: confermare l'anno di fine delle motorizzazioni precedenti, oggi aperte accanto a quelle nuove (M23).

## Gia' in PR
- #98: copia doppia di Hyundai Inster.
- #96: uniformare gli spazi nel testo della ricerca IA (copre anche il testo predefinito della pagina veicolo).
- #91: testi di riserva in un modulo dedicato e `check:cache`; stesso file di M4.
- #68: migrazione di rafforzamento della RLS (solo `supabase/`).
