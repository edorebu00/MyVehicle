# Set A — Mockup del 2026-10-04 (Design 2)

Proposte A1, A2 e A3 di `design/BRIEF.md`. Ogni mockup è un unico file HTML autocontenuto, con CSS inline, senza script
e senza risorse remote. Usa i token reali di `web/tailwind.config.ts` e `web/app/globals.css`: palette `brand`, `graphite`
(scala invertita) e `gold`, poi `.card`, `.hero-panel`, `.btn-primary`, `.metric-chip`, `.icon-badge`, `.eyebrow` e
`--ease-premium`. I font sono Fraunces e Inter, come in `app/layout.tsx`; se non sono installati si passa a
Georgia/system-ui. Il pulsante **Prima / Dopo** in alto funziona solo con CSS (radio + label alti 44px).

L'app ha soltanto il tema scuro (`body` su `graphite-50`, nessuna variante `prefers-color-scheme` o `dark:`), quindi anche
i mockup sono solo scuri (`color-scheme: dark`). Con `prefers-reduced-motion: reduce` sono spente tutte le animazioni,
compresi glow, scuotimento e riflesso.

Verifiche fatte: screenshot con Chromium headless a 390px (in iframe) e a 1280px, senza scroll orizzontale. Contrasti
calcolati con la formula WCAG:

| Coppia | Rapporto |
|---|---|
| `graphite-500` su `graphite-100` | 4,82:1 |
| `graphite-600` su `graphite-100` | 7,08:1 |
| `gold-600` su `graphite-50` | 8,23:1 |
| testo `graphite-50` su `brand-400` (bottone) | 6,74:1 |
| testo dell'avviso d'errore | ≈12:1 |
| `graphite-400` su `graphite-100`, usato **oggi** per targa e "Almeno 6 caratteri." | **2,48:1, sotto AA** |

Nei "Dopo" quei testi passano a `graphite-500`/`600`.

---

## A1 — Garage a griglia con gerarchia (bento leggero) · `garage-bento.html`

**Cosa cambia e perché.** Oggi in `/dashboard` le card sono tutte identiche (1/2/3 colonne). Nella proposta:
- il veicolo aggiunto più di recente diventa una **tile grande** (4/6 delle colonne su desktop) con tre segnali: ricerca IA
  completata o no, numero di documenti, bollo stimato;
- accanto c'è il riquadro **"Da completare"**, che elenca i veicoli senza documenti o senza ricerca IA. Ogni riga è un link
  alto 56px alla scheda;
- gli altri veicoli sono tile compatte con chip di stato (verde = fatto, rame `gold` = da fare);
- l'emoji 🚗/🏍️ è sostituita da icone SVG.

Su mobile c'è una sola colonna, ordinata per priorità: recente → da completare → altri.
Con un solo veicolo si vede solo la tile grande. "Da completare" non compare se non c'è nulla da fare.

**Trend.** #1 Bento grid. Fonti: [SaaSFrame — Bento Grid pattern](https://www.saasframe.io/patterns/bento-grid) ·
[SaaSFrame — Designing Bento Grids](https://www.saasframe.io/blog/designing-bento-grids-that-actually-work-a-2026-practical-guide).

**Sforzo.** M

**File reali da toccare.**
- `web/app/(dashboard)/dashboard/page.tsx`: due query aggregate in più, leggibili con la RLS già esistente:
  `documents` (conteggio per `vehicle_id`) e `search_results` (presenza per `vehicle_id`). Poi il layout a griglia
  `grid-cols-1 sm:grid-cols-2 lg:grid-cols-6` con gli span.
- `web/components/VehicleCard.tsx`: variante `featured` / `compact` e chip di stato. Nuovo componente
  `GarageTodoPanel.tsx`.
- `web/messages/{it,en,de}.json`: nuove chiavi in `dashboard` / `vehicleCard`, per esempio `recentlyAdded`, `todoTitle`,
  `todoNoDocs`, `todoNoSearch`, `docsCount` (plurale ICU), `searchDone`, `searchTodo`.

**Rischi.**
- Due query in più a ogni caricamento della dashboard: basta `select vehicle_id` con `count`, nessun join pesante.
- Il "bollo stimato" è una stringa libera prodotta dall'IA (`vehicles.bollo_stimato`). Va mostrata così com'è, troncata,
  senza parsing.
- Non introdurre scadenze o un bollo "in scadenza": oggi quei dati non esistono.
- La seconda tile grande deve restare un link unico e accessibile (`aria-label` come oggi).

**Criteri di accettazione.**
- Con 0 veicoli → si vede l'empty state (A2).
- Con 1 veicolo → solo la tile grande.
- Con 2 o più veicoli → tile grande + compatte, e "Da completare" solo se almeno un veicolo ha 0 documenti o nessuna
  ricerca IA.
- Ordine DOM = ordine visivo = priorità, così la tastiera e i lettori di schermo seguono lo stesso percorso.
- Nessun testo sotto 4,5:1. Tutti gli elementi cliccabili sono alti almeno 44px.
- `animate-stagger` è mantenuto e rispetta reduced-motion.
- Stringhe presenti nelle tre lingue.

---

## A2 — Empty state del garage come primo momento di attivazione · `garage-empty-state.html`

**Cosa cambia e perché.** Oggi la dashboard vuota mostra due bottoni "Aggiungi" identici (hero + card), le metriche
"0 in garage / 24/7 pronto" e un'emoji 🏁 con una sola frase. Nella proposta:
- con garage vuoto l'hero perde metriche e bottone, e il sottotitolo diventa di benvenuto;
- la card centrale spiega in una riga perché aggiungere un veicolo;
- un'anteprima in tre passi (Scheda tecnica · Ricerca IA · Chat sui documenti) mostra le funzioni reali dell'app;
- c'è **una sola** CTA primaria (48px), con la nota "Bastano tipo, marca, modello e anno.";
- l'icona del garage ha un leggero "respiro", spento con reduced-motion.

**Trend.** #6 Empty state come attivazione. Fonte: [SetProduct — Empty state UI design](https://www.setproduct.com/blog/empty-state-ui-design).

**Sforzo.** S

**File reali da toccare.**
- `web/app/(dashboard)/dashboard/page.tsx`: nel blocco `list.length === 0` va il nuovo contenuto; la stessa condizione
  nasconde metriche e CTA dell'hero.
- `web/messages/{it,en,de}.json`: chiavi `dashboard.emptyTitle`, `emptyLead`, `emptyStep{1,2,3}Title/Text`, `emptyHint`,
  `subtitleWelcome`.
- Facoltativo: una piccola keyframe `breathe` in `globals.css`, dentro il blocco reduced-motion già esistente.

**Rischi.**
- Minimo, nessuna logica cambia.
- I testi dei tre passi non devono promettere funzioni che non esistono. Sono stati presi dalle sezioni reali: scheda
  tecnica, "Piano di manutenzione", ricerca IA per categorie, chat sui documenti.
- In tedesco le frasi si allungano: le card dei passi vanno a capo su 3 colonne solo da 720px in su.

**Criteri di accettazione.**
- Con 0 veicoli, nella pagina c'è un solo link a `/veicoli/nuovo`.
- Il titolo dell'empty state è un heading collegato via `aria-labelledby`, i passi sono una lista ordinata e le icone
  sono `aria-hidden`.
- AA su tutti i testi. Stringhe presenti in `it`, `en` e `de`.

---

## A3 — Micro-interazioni e glow su login/registrazione · `auth-glow.html`

**Cosa cambia e perché.** Oggi l'errore è una riga `text-red-400` staccata dai campi e non annunciata. Gli input sono
alti 40px con testo a 14px (iOS fa lo zoom quando si tocca il campo). "Almeno 6 caratteri." è a 2,48:1 e il bottone in
caricamento cambia solo il testo. Nella proposta:
- **bordo-luce** champagne sul `.glass-panel`, fatto con una maschera sul bordo: è decorativo e non tocca il testo;
- **glow sul focus** dei campi: un alone esterno che lascia invariato il contrasto testo/sfondo;
- **errore** in un riquadro con icona e `role="alert"`; i campi ricevono `aria-invalid` + `aria-describedby`, con un breve
  scuotimento;
- in registrazione, errore **sotto il campo** "Conferma password";
- campi alti 48px con testo a 16px, bottone "mostra password" (44px), misuratore di robustezza a 3 tacche (solo
  visivo, la regola dei 6 caratteri resta quella di Supabase);
- **spinner** dentro il bottone durante l'invio (`aria-busy`);
- riflesso al passaggio del mouse sul bottone primario;
- nello stato di **successo**, un anello e una barra di 600 ms allineata al `setTimeout(…, 600)` del redirect che esiste
  già.

**Trend.** #3 Glow su fondo scuro ([AufaitUX — Web Design Trends 2026](https://www.aufaitux.com/blog/web-design-trends-2026/))
e #4 Micro-interazioni come segnali di fiducia ([Yellowslice — UI/UX Design Trends 2026](https://www.yellowslice.in/blog/ui-ux-design-trends)).

**Sforzo.** S/M

**File reali da toccare.**
- `web/app/login/page.tsx` e `web/app/registrati/page.tsx`: markup dell'errore, `aria-*`, toggle della password,
  spinner, stato di successo (Framer Motion già presente).
- `web/app/globals.css`: estendere `.input` (altezza minima, `text-base` su mobile, glow nel `:focus`, stato
  `[aria-invalid=true]`), `.glass-panel` (variante con bordo-luce, per esempio `.glass-panel-lit`) e un riflesso
  facoltativo su `.btn-primary`, aggiungendo tutto al blocco reduced-motion.
- `web/messages/{it,en,de}.json` (`auth`): `invalidCredentialsHint`, `showPassword`, `hidePassword`,
  `passwordStrength{Weak,Fair,Strong}`.

**Rischi.**
- Il glow non deve sostituire l'anello di focus: resta il bordo `brand-500` più l'anello a 3px, quindi è visibile anche
  senza glow.
- `mask-composite` non funziona sui browser vecchi: in quel caso resta solo il bordo attuale, che va bene.
- Il misuratore non deve far credere che esista una regola più severa di quella del server.
- `.input` è usato ovunque, anche nel form "Nuovo veicolo" (B3 del Set B): le modifiche globali, cioè altezza e
  dimensione del testo, vanno coordinate con il Set B, oppure limitate con una variante `.input-lg`.

**Criteri di accettazione.**
- Gli errori di login e registrazione sono annunciati dai lettori di schermo (`role="alert"`).
- I campi in errore hanno `aria-invalid="true"` e sono collegati al messaggio.
- Su un iPhone non c'è zoom quando si tocca un campo (testo ≥ 16px).
- Tutti i controlli sono ≥ 44px. Il suggerimento sotto la password è ≥ 4,5:1.
- Con reduced-motion non ci sono glow pulsante, scuotimento né riflesso.
- Il redirect dopo il login continua ad avvenire dopo circa 600 ms.
- Stringhe presenti nelle tre lingue.
