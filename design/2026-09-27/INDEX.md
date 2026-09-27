# Proposte di design — 27 settembre 2026

Branch `claude/design-2026-09-27`. Brief: [`design/BRIEF.md`](../BRIEF.md), di Design 1.
Il Set A è di Design 2 ([README](set-a/README.md)) e il Set B di Design 3 ([README](set-b/README.md)).
Revisione e indice sono di Design 3. Nessun file sotto `web/` è stato modificato.

Ogni mockup è un file HTML unico, senza risorse esterne. In alto c'è l'interruttore **Prima / Dopo**:
"Prima" riproduce l'app di oggi, "Dopo" mostra la proposta. L'app ha solo il tema scuro.

## Mockup

| # | Titolo | Anteprima | In una riga | Sforzo | Raccomandazione |
|---|---|---|---|---|---|
| A1 | Dashboard come bento grid (P1) | [apri](https://raw.githack.com/edorebu00/MyVehicle/claude/design-2026-09-27/design/2026-09-27/set-a/dashboard-bento.html) | Ultimo veicolo in una cella grande, metriche e IA in celle piccole, altri veicoli compatti | M | **Approva** |
| A2 | Garage vuoto con domanda di instradamento (P2) | [apri](https://raw.githack.com/edorebu00/MyVehicle/claude/design-2026-09-27/design/2026-09-27/set-a/empty-state-routing.html) | "Auto o moto?" apre il modulo già impostato con `?tipo=` | S | **Approva** |
| A3 | Login con titolo cinetico (P3) | [apri](https://raw.githack.com/edorebu00/MyVehicle/claude/design-2026-09-27/design/2026-09-27/set-a/login-kinetic.html) | "MyVehicle" entra lettera per lettera, più bordi dei campi AA | S | **Approva** (ma separa il cambio a `.input`) |
| B1 | Chat IA: capacità e recupero (P4) | [apri](https://raw.githack.com/edorebu00/MyVehicle/claude/design-2026-09-27/design/2026-09-27/set-b/chat-capacita.html) | Cosa sa fare l'assistente, 3 domande d'esempio, errore AA con Riprova, composer da 48px | M | **Approva** |
| B2 | Risultati della ricerca IA come bento (P5) | [apri](https://raw.githack.com/edorebu00/MyVehicle/claude/design-2026-09-27/design/2026-09-27/set-b/ricerca-bento.html) | Sintesi in evidenza, indice con i conteggi, griglia di card interamente cliccabili | M | **Approva** |
| B3 | Specifiche tecniche come riquadri numerici (P6) | [apri](https://raw.githack.com/edorebu00/MyVehicle/claude/design-2026-09-27/design/2026-09-27/set-b/specifiche-dataviz.html) | Cilindrata, potenza e coppia in riquadri, il resto in elenco AA, senza scale inventate | M | **Da rivedere** |

## Ordine di priorità consigliato

1. **Correzioni di contrasto trasversali**, da estrarre da A3 e B1 in una piccola PR a sé. Tre cambi:
   - bordo di `.input` da `graphite-300` a `graphite-500` (da 1,4:1 a 4,8:1);
   - testo degli errori da `red-600` a `red-400` (da 3,9:1 a 6,8:1, in 7 file);
   - testi in `graphite-400` su fondo scuro portati a `graphite-500` o `graphite-600`: targa, stati vuoti,
     etichette delle specifiche, oggi fra 2,5 e 2,6:1.

   Sono fallimenti AA reali nell'app di oggi, costano poco (S) e rendono più piccole tutte le PR
   successive.
2. **B1 — Chat IA** (M). È il punto dove l'utente oggi si blocca di più: non sa cosa chiedere,
   l'errore è poco leggibile e i target sono piccoli. Non tocca la logica del task M1, ma conviene
   farla **dopo** la correzione M1, per non lavorare sullo stesso messaggio 401.
3. **A2 — Garage vuoto** (S). Rende meglio il primo avvio con poco lavoro.
4. **A1 — Dashboard bento** (M). Va nella stessa PR di A2 o subito dopo, perché modificano lo stesso
   file `dashboard/page.tsx`.
5. **B2 — Ricerca a bento** (M). Il componente `ResourceCategoryView` è condiviso con la scheda
   veicolo: va verificato in entrambe le schermate.
6. **A3 — Login cinetico** (S). È un miglioramento d'identità, non d'uso. Si fa quando c'è tempo, una
   volta che il cambio a `.input` è già uscito con il punto 1.
7. **B3 — Specifiche** (M). Prima serve decidere se bastano i riquadri di sintesi, che sono una
   deviazione dal brief (vedi sotto).

## Motivazioni

- **A1, Approva.** Usa solo dati che esistono già (`list[0]`, `vehicle.type`), non inventa metriche e
  corregge il contrasto della targa. I casi con 1-3 veicoli sono indicati come rischio, con una
  soluzione (`grid-auto-flow: dense`).
- **A2, Approva.** Toglie la doppia CTA e il chip "0 in garage", che non dice niente. Serve una
  piccola modifica a `veicoli/nuovo` (`?tipo=`, con un valore di ripiego sicuro) che non tocca i
  file dei task T3 e T4.
- **A3, Approva, ma il cambio globale a `.input` va separato** (punto 1). Dentro una PR "estetica"
  sul login cambierebbe l'aspetto di tutti i moduli senza che si veda dal titolo della PR.
  L'animazione rispetta `prefers-reduced-motion` e uno screen reader legge "MyVehicle" una volta sola.
- **B1, Approva.** Rende chiaro che cosa sa fare l'assistente e quali sono i suoi limiti, così chi
  arriva sa cosa chiedere e perde meno tentativi. Corregge due difetti AA (errore e campo). La
  logica di invio non cambia, salvo il pulsante "Riprova", che compare solo se la domanda non è stata
  salvata.
- **B2, Approva.** Porta il target di tocco da un link di 19-24px a una card da almeno 132px, e mette
  in evidenza la sintesi dell'IA. Non richiede dati nuovi dal modello: il dominio si ricava dall'URL
  già validato.
- **B3, Da rivedere.** Il mockup è pronto e corregge un contrasto a 2,6:1. Però, **di proposito**,
  non contiene grafici né indicatori. Una barra per "160 cv" richiede una scala di riferimento che il
  modello non fornisce, e inventarla mostrerebbe un'informazione falsa. Il proprietario deve
  confermare che i riquadri numerici bastano. Se sì, lo sforzo scende da L a M e si può approvare.
  Se invece vuole i grafici, prima serve una fonte per le scale, per esempio intervalli per
  segmento: è una decisione sui dati, non sul design.

## Revisione del Set A (Design 3)

Ho verificato con uno script Chromium/Playwright tutti e tre i mockup, a 390px e 1280px, sia su
"Prima" sia su "Dopo":

- **Coerenza visiva:** stessi token, stesso guscio, stesso interruttore e stesso stile di note del
  Set B. Il Set B è stato costruito sullo stesso schema, quindi i due set sono uniformi.
- **Contrasto:** nessun testo sotto AA nelle viste "Dopo". Nelle viste "Prima" l'unico difetto
  trovato è la targa della dashboard (2,5:1), cioè quella dell'app reale, che A1 corregge davvero.
- **Target di tocco:** nelle viste "Dopo" tutti gli elementi interattivi sono alti almeno 44px, con
  i campi di login a 44px o più. Nel "Prima" del login i campi sono alti 38px, come nell'app.
- **HTML:** tag bilanciati, nessun id duplicato, riferimenti `for` / `aria-labelledby` risolti, nessuna
  risorsa esterna, `prefers-reduced-motion` presente, nessun errore in console e nessuno scorrimento
  orizzontale.
- **Fattibilità:** tutto si può fare con Next.js, Tailwind e framer-motion, senza nuove dipendenze.
  Le note su `useSearchParams` con `<Suspense>` (A2) e su `useReducedMotion` (A3) sono corrette.
- **Correzioni applicate: nessuna.** Non ho trovato difetti evidenti. Una nota: nelle viste "Prima"
  di A1 e A2 i metric-chip hanno un `<p>` dentro `<span>`, che non è HTML valido. Il mockup è fedele
  all'app: lo stesso difetto è in `web/app/(dashboard)/dashboard/page.tsx:34-37`, e c'è anche in
  `ResourceCategoryView.tsx`. Conviene sistemarlo durante A1 e B2, non nei mockup.
