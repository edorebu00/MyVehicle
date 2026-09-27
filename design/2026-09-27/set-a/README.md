# Set A — mockup del 27 settembre 2026

Autore: Design 2. Fonte: `design/BRIEF.md` (P1, P2, P3). Nessun file sotto `web/` è stato modificato.

Ogni mockup è un unico file HTML autocontenuto (CSS inline, icone SVG inline, nessuna risorsa
esterna). In alto c'è un interruttore **Prima / Dopo** fatto solo in CSS, usabile anche da tastiera
con le frecce. I token sono copiati da `web/tailwind.config.ts` e `web/app/globals.css`: scala
`graphite` invertita, `brand`, `gold`, `.card`, `.hero-panel`, `.metric-chip`, `.icon-badge`,
`.btn-primary`, `.eyebrow`, `--ease-premium`. Fraunces e Inter li carica `next/font`, quindi nei
mockup si vedono i font di ripiego (Georgia e il sans-serif di sistema).

L'app ha solo il tema scuro (non esiste un tema chiaro né un `prefers-color-scheme`), quindi anche i
mockup sono solo scuri e dichiarano `color-scheme: dark`. Ho controllato i mockup in Chromium a
390px e a 1280px: nessuno scorrimento orizzontale e nessun errore in console.
`prefers-reduced-motion: reduce` disattiva tutte le animazioni.

| Mockup | Proposta | Sforzo |
|---|---|---|
| [`dashboard-bento.html`](dashboard-bento.html) | P1 — Dashboard come bento grid | M |
| [`empty-state-routing.html`](empty-state-routing.html) | P2 — Garage vuoto con domanda di instradamento | S |
| [`login-kinetic.html`](login-kinetic.html) | P3 — Login e registrazione con titolo cinetico | S |

---

## P1 — Dashboard come bento grid (`dashboard-bento.html`)

**Cosa cambia**
- L'hero-panel diventa un'intestazione compatta: eyebrow, titolo e il pulsante "+ Aggiungi veicolo".
  I metric-chip escono dall'hero e diventano celle del bento.
- Il bento su desktop (≥1024px) ha 4 colonne:
  - una cella 2×2 per l'**ultimo veicolo aggiunto**, cioè `list[0]` della query già ordinata per
    `created_at desc`, quindi senza dati nuovi. Contiene un'icona grande, il nome in serif e una
    riga con motore, targa e tipo;
  - una cella **In garage** con il conteggio e una barra auto/moto, calcolata da `vehicle.type`;
  - una cella **Assistente IA 24/7** che porta a `/ricerca`;
  - gli altri veicoli in celle uniformi e compatte.
- Tablet (≥640px): 2 colonne e i veicoli restano card. Mobile: la cella principale occupa tutta la
  larghezza, le due metriche stanno affiancate e i veicoli diventano righe alte 72px.
- La targa passa da `text-graphite-400` a `text-graphite-500`: su `graphite-100` il contrasto sale da
  2,5:1 (sotto AA) a 4,8:1.

**Perché:** oggi tutte le card hanno lo stesso peso visivo. Il bento dà una gerarchia con dimensioni
e spaziature invece che con bordi, e con molti veicoli si scorre meno.

**Trend (dal brief):** bento grid come layout dominante nel 2026,
[Muzli](https://muz.li/blog/best-dashboard-design-examples-inspirations-for-2026/); gerarchia data da
peso e spaziatura, [The Frontend Company](https://www.thefrontendcompany.com/posts/ui-trends);
data-viz leggera nelle dashboard (la barra auto/moto),
[925 Studios](https://www.925studios.co/blog/saas-dashboard-design-examples-2026).

**Sforzo:** M.

**File da toccare**
- `web/app/(dashboard)/dashboard/page.tsx`: layout della griglia, separazione `list[0]` / resto, conteggio
  auto/moto.
- Nuovo `web/components/VehicleBentoFeature.tsx`, oppure una prop `variant="feature" | "compact"` su
  `web/components/VehicleCard.tsx` per la cella grande e le celle compatte.
- `web/messages/it.json`, `en.json`, `de.json` (namespace `dashboard`): nuove chiavi `latestAdded`,
  `metricSplit` (plurali ICU per auto e moto), `aiCellHint`.
- Facoltativo: `web/app/globals.css` per una classe `.bento-cell` che riusi il box-shadow di `.card`.

**Rischi**
- Con **1 veicolo** il bento resta sbilanciato: la cella grande deve mostrarsi accanto alle sole
  metriche, senza celle vuote.
- Con 2 o 3 veicoli l'ultima riga può restare zoppa. Si può accettare oppure si usa
  `grid-auto-flow: dense`.
- La cella "IA" non deve sembrare un dato reale: niente numeri inventati, solo 24/7 come oggi.
- `animate-stagger` si applica ai figli diretti, quindi la cella grande entra per prima.
  Va bene così, ma va verificato.

**Criteri di accettazione**
- [ ] Con ≥2 veicoli, `list[0]` compare nella cella grande (2×2 a ≥1024px, tutta la larghezza sotto).
- [ ] Il conteggio e la ripartizione auto/moto corrispondono a `vehicle.type`, e la barra ha un
      `aria-label` testuale.
- [ ] Nessun testo sotto 4,5:1 (la targa usa `graphite-500` o più chiaro).
- [ ] Ogni cella veicolo è un link unico, con focus visibile e alta almeno 44px (72px su mobile).
- [ ] Non c'è scorrimento orizzontale tra 320px e 1440px.
- [ ] Le stringhe nuove esistono in it, en e de.
- [ ] Il ramo `list.length === 0` resta invariato oppure segue P2.

---

## P2 — Garage vuoto con domanda di instradamento (`empty-state-routing.html`)

**Cosa cambia**
- Quando il garage è vuoto, l'hero perde i metric-chip ("0 in garage" non dice niente) e il pulsante
  duplicato. Al suo posto compare un sottotitolo che spiega cosa offre l'area.
- Il vecchio riquadro con 🏁 diventa una domanda, "Che cosa vuoi aggiungere per primo?", con due
  scelte grandi (almeno 112px di altezza, icona SVG, esempi di modelli): **Un'auto** porta a
  `/veicoli/nuovo?tipo=auto`, **Una moto** a `/veicoli/nuovo?tipo=moto`.
- Il modulo nuovo veicolo si apre con il tipo già selezionato: in fondo al mockup c'è un'anteprima.
- I bordi delle scelte e del selettore tipo usano `graphite-500` (5,1:1), così non sembrano campi
  vuoti.

**Perché:** oggi il primo passo è un pulsante generico seguito da una scelta nel modulo. Con la
domanda iniziale la scelta avviene prima e il modulo si apre già impostato, con un clic in meno.

**Trend (dal brief):** l'empty state usato per l'onboarding, con una sola domanda e 2-3 opzioni,
[userTourKit](https://usertourkit.com/blog/empty-states-that-convert-onboarding-design-patterns),
[Kompassify](https://kompassify.com/blog/empty-states-guide).

**Sforzo:** S.

**File da toccare**
- `web/app/(dashboard)/dashboard/page.tsx`: ramo `list.length === 0` e hero condizionale.
- `web/app/(dashboard)/veicoli/nuovo/page.tsx`: stato iniziale di `type` letto dal parametro
  `tipo`. È un client component: con `useSearchParams` serve un `<Suspense>` attorno, altrimenti
  conviene una piccola `page.tsx` server che legga `searchParams` e passi `initialType`.
  I valori ammessi sono solo `auto` e `moto`; qualsiasi altro valore ricade su `auto`.
- `web/messages/*.json` (`dashboard`): chiavi `emptyQuestion`, `emptyHint`, `emptyChoiceAuto`,
  `emptyChoiceMoto` (con esempi), `emptyFoot`, e `subtitleEmpty` aggiornata.

**Rischi**
- `vehicleData.ts` e `engineExtensions.ts` sono oggetto dei task T3 e T4: qui **non** vanno toccati.
  Serve solo il valore iniziale di `type`, e `handleTypeChange` resta com'è.
- Gli esempi di modelli nel testo devono esistere nel catalogo (Fiat Panda, Alfa Romeo Giulia,
  Ducati Monster, Honda CB500), altrimenti chi arriva al modulo si confonde.
- La Sidebar mostra già "Nessun veicolo aggiunto." e "+ Aggiungi veicolo": è una ridondanza
  accettabile, ma va tenuta coerente.

**Criteri di accettazione**
- [ ] Con 0 veicoli non compaiono i metric-chip né il pulsante nell'hero, e compaiono le due scelte.
- [ ] `/veicoli/nuovo?tipo=moto` apre il modulo con "Moto" selezionato e l'elenco marche delle moto.
      Senza parametro, o con un valore non valido, si parte da "Auto".
- [ ] Le scelte sono link veri (`<Link>`), raggiungibili con Tab, con focus visibile e alti almeno 44px.
- [ ] Stringhe presenti in it, en e de; nessun testo scritto nel codice.
- [ ] Con almeno 1 veicolo la dashboard resta identica, oppure segue P1.

---

## P3 — Login e registrazione con titolo cinetico (`login-kinetic.html`)

**Cosa cambia**
- Il titolo "My**Vehicle**" passa da 30px a 44px ed entra **lettera per lettera**: opacità, un
  leggero spostamento in alto con rotazione e una sfocatura di 4px che si risolve, 45ms di
  sfasamento, easing `--ease-premium`.
- Subito dopo, sotto il titolo si disegna un filo champagne (`brand-500`, dissolto ai lati). Poi
  entrano in cascata tagline, modulo e link; in tutto circa 1,4s.
- Accessibilità: `aria-label="MyVehicle"` sull'`h1` e lettere `aria-hidden`, così lo screen reader
  non legge il nome lettera per lettera.
- Correzione collegata, richiesta dal §5 del brief: i bordi dei campi passano da `graphite-300`
  (1,4:1, un "campo fantasma") a `graphite-500` (4,8:1), i campi sono alti almeno 44px e il focus
  ring è più deciso. La tagline passa da `graphite-500` a `graphite-600`.

**Perché:** login e registrazione sono il primo contatto con l'app. Mettere in evidenza il serif
Fraunces, già caricato, rafforza l'identità "orologeria" senza aggiungere peso.

**Trend (dal brief):** ritorno dei serif espressivi e della tipografia cinetica,
[Design Flea](https://designflea.com/typography-trends-2026/); micro-interazioni intenzionali,
[Fuselab](https://fuselabcreative.com/mobile-app-design-trends-for-2025/); campi visibili in dark UI,
[ColorContrast.org](https://www.colorcontrast.org/blog/dark-mode-contrast-accessibility-guide/).

**Sforzo:** S.

**File da toccare**
- Nuovo `web/components/KineticWordmark.tsx`: client component con `motion.span` per ogni lettera,
  che usa `useReducedMotion()` di framer-motion e in quel caso rende il testo statico.
- `web/app/login/page.tsx` e `web/app/registrati/page.tsx`: sostituire il `motion.h1` con il
  componente e ritoccare le classi della tagline.
- `web/app/globals.css`: in `.input` il bordo passa da `border-graphite-300` a `border-graphite-500`,
  più `min-h-[44px]`. **Attenzione:** `.input` è usata in tutta l'app, quindi il cambio va verificato
  anche nel modulo nuovo veicolo e nelle altre pagine. In alternativa si usa una classe `.input-strong`
  solo per l'autenticazione.

**Rischi**
- `filter: blur()` su molte lettere può scattare su telefoni lenti. In quel caso basta togliere la
  sfocatura e tenere opacità e spostamento.
- Il cambio globale di `.input` modifica l'aspetto di tutti i moduli. È un miglioramento AA, ma è
  un cambiamento visibile.
- Il nome del marchio non si traduce, ma in de ed en va controllato che la tagline più lunga non
  vada a capo in modo brutto sotto il filo.
- L'animazione non deve ritardare l'interazione: il modulo è attivo da subito e l'ingresso è solo
  visivo.

**Criteri di accettazione**
- [ ] In login e in registrazione il titolo entra lettera per lettera in meno di 1s, e tutto è
      visibile entro 1,5s.
- [ ] Con `prefers-reduced-motion: reduce` il titolo e il resto compaiono subito, senza movimento.
- [ ] Uno screen reader legge "MyVehicle" una volta sola (h1 con nome accessibile corretto).
- [ ] I bordi dei campi hanno un contrasto di almeno 3:1 con lo sfondo del pannello, i campi sono
      alti almeno 44px e il focus è visibile.
- [ ] Nessuna nuova dipendenza e nessun nuovo font.
- [ ] Nessuna regressione nello stato di successo (overlay ✓) e nel messaggio d'errore.

---

## Note comuni

- Nessuna proposta tocca `web/middleware.ts`, `web/lib/motorsport.ts`, `web/lib/vehicleData.ts` o
  `web/lib/engineExtensions.ts`, che sono oggetto dei task T1-T4.
- P1 e P2 modificano lo stesso file, `dashboard/page.tsx`: conviene implementarle nella stessa PR
  o una dopo l'altra.
