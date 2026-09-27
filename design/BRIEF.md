Data (UTC): 2026-09-27

# Brief settimanale design — MyVehicle

Preparato da Design 1 per Design 2 (Set A) e Design 3 (Set B). Nessun codice sotto `web/` è stato
modificato da questo agente: solo ricerca, lettura del codice e questo documento.

## 1. Stato dell'app

**Bug scan notturno** (`claude/nightly-bug-scan`, dati al 2026-09-27 01:20 UTC, `BUG_SCAN.md` +
`cascade/TASKS.md`): 0 bloccanti, 0 importanti, 4 minori già assegnati a lavoratori di correzione bug
(non a noi):
- M1/T1 `web/middleware.ts:44-49` — messaggio 401 in inglese + cookie non propagati.
- M2/T2 `web/lib/motorsport.ts:96-126,170` — cache di un `submit_briefing` troncato.
- M3/T3 `web/lib/engineExtensions.ts:526` — doppione motorizzazione Toyota bZ4X.
- M4/T4 `web/lib/vehicleData.ts:2006` — dati errati Peugeot e-3008 Dual Motor.

Nessuna PR aperta al momento (`gh pr list --state open` → lista vuota). Di conseguenza **non ci sono
file "bloccati" da PR in corso**, ma i quattro file sopra sono comunque oggetto di task di correzione
già pianificati: le proposte di design non devono cambiarne la logica dati/traduzione (possono toccare
solo markup/stile dei componenti che li consumano, es. `ChatPanel.tsx`, senza intervenire su
`middleware.ts` o `motorsport.ts`).

**Schermate reali** (Next.js App Router, route group `(dashboard)` = area autenticata, `(public)` =
marketing):
- `web/app/(public)/page.tsx` — home pubblica (hero, discipline motorsport, CTA).
- `web/app/(public)/circuiti/page.tsx` e `[slug]/page.tsx` — elenco e dettaglio circuiti.
- `web/app/login/page.tsx`, `web/app/registrati/page.tsx` — autenticazione (glass-panel centrato,
  animazioni framer-motion, stato di successo).
- `web/app/(dashboard)/dashboard/page.tsx` — hero-panel + metric-chip + griglia `VehicleCard`.
- `web/app/(dashboard)/veicoli/nuovo/page.tsx` — form aggiunta veicolo (toggle auto/moto, select a
  cascata marca→modello→motorizzazione→anno da `lib/vehicleData.ts`, overlay di conferma).
- `web/app/(dashboard)/veicoli/[id]/page.tsx` + `VehicleDetailTabs.tsx` — hero veicolo, card "bollo",
  card-link dorate (ricambi/manutenzione/annunci), barra di ricerca IA, tab sezioni tecniche +
  documenti/forum/video.
- `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx` — documenti + `ChatPanel.tsx` (chat IA sui
  documenti del veicolo).
- `web/app/(dashboard)/ricerca/page.tsx` + `GlobalSearch.tsx` — ricerca IA libera, stessi tab categoria.
- `Sidebar.tsx` — nav laterale con pillola attiva animata (`layoutId` framer-motion).

**Palette** (`web/tailwind.config.ts`): tema scuro "orologeria/casa automobilistica di lusso".
`brand` = champagne/bronzo smorzato (500 `#cca558`) per CTA e accenti primari; `graphite` = scala
neutra calda **invertita** (50 = nero più profondo, 900 = avorio più chiaro — commento nel file avverte
di non "correggere" l'ordine); `gold` = rame/ambra per link "di valore" (card ricambi/manutenzione).

**Tipografia**: `font-display` (serif, fallback Georgia) su tutti gli h1-h3 e titoli card; `font-sans`
per il corpo testo. Coerente con il trend serif/editoriale 2026 (vedi §2) — già ben posizionata.

**Pattern già presenti** (`web/app/globals.css`): `hero-panel` (bagliore radiale caldo su fondo scuro),
`card` / `card-gold-link`, `glass-panel` (vetro smerigliato + blur, usato in login/registrati),
`btn-primary` (gradiente metallico champagne), `metric-chip`, `icon-badge`, `eyebrow`, `.spinner`,
`.skeleton-line` (shimmer), `animate-stagger`/`animate-rise-in` con easing "premium" (`--ease-premium`),
scrollbar sottile personalizzata. Motion via `framer-motion`: pillola di navigazione attiva,
`VehicleCard` con hover-lift, overlay di conferma in login e in "veicolo aggiunto".

**Lingue**: `it` (default), `en`, `de` (`web/i18n/locales.ts`, `web/messages/*.json`, `next-intl`).

## 2. Trend rilevati (ultimi 3-6 mesi, fonti reali)

- **Bento grid come layout dominante per dashboard/prodotto 2026** — card modulari asimmetriche per
  gerarchia visiva senza scroll aggressivo.
  [Muzli — 50 Best Dashboard Design Examples 2026](https://muz.li/blog/best-dashboard-design-examples-inspirations-for-2026/)
- **Dashboard "AI-native"**: l'IA riassume e prioritizza al posto dell'utente invece di lasciargli
  costruire la vista; minimalismo con densità informativa in aumento, gerarchia da peso tipografico e
  spaziatura più che da bordi/ombre.
  [The Frontend Company — UI Trends 2026 for SaaS](https://www.thefrontendcompany.com/posts/ui-trends)
- **Dark mode "power user" e legame con il lusso**: il nero/scuro comunica qualità premium (strategia
  storica del settore lusso); profondità ottenuta con sfumature scure sottili + glassmorphism, non
  fondo piatto.
  [tech-rz — Dark Mode UI Design in 2026](https://www.tech-rz.com/blog/dark-mode-ui-design-in-2026-user-experience-and-ai-powered-interfaces/)
- **Micro-interazioni intenzionali**: feedback minimo che chiarisce cosa è successo senza rallentare,
  trend cross-piattaforma per il 2026.
  [Fuselab Creative — Future of App Design 2026](https://fuselabcreative.com/mobile-app-design-trends-for-2025/)
- **Interfacce chat IA**: 4 proprietà chiave — trasparenza sulle capacità, pattern di recupero errore,
  segnali di incertezza, accessibilità; per contenuti lunghi line-height ~1.6 e ~65-72 caratteri per
  riga; su mobile composer "dockato", tasti invio/stop ≥44px.
  [Setproduct — Designing AI chat interfaces](https://www.setproduct.com/blog/ai-chat-interface-ui-design)
- **Pattern "chat come motore, documento come dashboard"**: la conversazione elabora, ma il lavoro reale
  dell'utente vive in una vista stabile e visibile (non solo nello stream di messaggi).
  [GitNexa — Designing AI Chat Interfaces 2026](https://www.gitnexa.com/blogs/ai-chatbot-design-guide)
- **Empty state come leva di onboarding**: una singola domanda di instradamento ("cosa vuoi fare?") con
  2-3 opzioni verso flussi dedicati, invece del semplice "aggiungi elemento".
  [userTourKit — Empty states that convert (2026)](https://usertourkit.com/blog/empty-states-that-convert-onboarding-design-patterns)
  [Kompassify — Empty States Guide 2026](https://kompassify.com/blog/empty-states-guide)
- **Revival dei serif espressivi + font variabili**: i display serif tornano protagonisti in ambito
  editoriale, i font variabili sostituiscono più file di peso con uno solo, più leggero e flessibile.
  [Design Flea — Typography Trends 2026](https://designflea.com/typography-trends-2026/)
- **Contrasto WCAG 2.2 in dark UI**: evitare nero puro (`#121212` o simili è più confortevole di
  `#000`); l'errore più comune non è il testo ma i campi/focus ring "fantasma" che spariscono sullo
  sfondo scuro — vanno sempre bordati o con stato pieno visibile.
  [ColorContrast.org — Dark Mode Contrast Guide 2026](https://www.colorcontrast.org/blog/dark-mode-contrast-accessibility-guide/)
- **Data-viz avanzata nelle dashboard**: radial chart, heat map, animazioni di tendenza per rendere
  leggibili dati complessi, ormai componente centrale e non più opzionale della UX.
  [925 Studios — SaaS Dashboard Examples & Trends 2026](https://www.925studios.co/blog/saas-dashboard-design-examples-2026)

## 3. Proposte

Ogni proposta è realizzabile in Next.js + Tailwind con i token esistenti (`brand`/`graphite`/`gold`,
`font-display`/`font-sans`, classi `.card`/`.hero-panel`/`.glass-panel`/`.btn-primary` ecc.), senza
toccare la logica dei file oggetto dei task di bug-fix elencati al §1.

### P1 — Dashboard come bento grid (Set A)
**Schermata**: `web/app/(dashboard)/dashboard/page.tsx`.
**Trend**: bento grid dominante 2026 (Muzli); gerarchia da spaziatura/peso più che da bordi.
**Proposta**: riorganizzare hero-panel + metric-chip + griglia veicoli in un bento grid reale (celle di
dimensioni diverse: una cella grande per l'ultimo veicolo aggiunto/il preferito, celle piccole per i
metric-chip, celle uniformi per gli altri veicoli), mantenendo `hero-panel`/`card`/`metric-chip` come
sono.
**Beneficio**: colpo d'occhio più chiaro su "quanti veicoli ho, quale ho aperto di recente", meno
scroll su garage numerosi.
**Sforzo**: M. **Rischio**: basso (solo layout Tailwind, nessun nuovo dato). Nessun conflitto con task
di bug-fix.

### P2 — Empty state con domanda di instradamento (Set A)
**Schermata**: `web/app/(dashboard)/dashboard/page.tsx` (ramo `list.length === 0`) →
`web/app/(dashboard)/veicoli/nuovo/page.tsx`.
**Trend**: empty state come leva di onboarding, domanda singola con 2-3 opzioni (userTourKit,
Kompassify).
**Proposta**: sostituire il singolo CTA "aggiungi veicolo" con due card scelta rapida — "🚗 Aggiungi la
tua prima auto" / "🏍️ Aggiungi la tua prima moto" — che linkano a `/veicoli/nuovo?tipo=auto|moto`;
`NewVehiclePage` pre-seleziona `type` da query string (stato iniziale già gestito da `handleTypeChange`,
basta leggere `searchParams`).
**Beneficio**: un click in meno al primo veicolo, coerente con l'eyebrow/tone attuale.
**Sforzo**: S. **Rischio**: basso.

### P3 — Login/registrati: titolo con tipografia cinetica (Set A)
**Schermata**: `web/app/login/page.tsx`, `web/app/registrati/page.tsx` (già usano `framer-motion` con
`containerVariants`/`itemVariants`).
**Trend**: revival dei display serif espressivi + tipografia cinetica in ingresso (Design Flea).
**Proposta**: animare il titolo "My**Vehicle**" lettera per lettera o parola per parola in ingresso
(stagger già presente a livello di blocco, va solo raffinato a livello di testo), enfatizzando il serif
di `font-display` già scelto — nessun nuovo font necessario.
**Beneficio**: rinforza l'identità "lusso/orologeria" nel primo touchpoint dell'app senza aggiungere
peso (font già caricato).
**Sforzo**: S. **Rischio**: basso — verificare che l'animazione rispetti `prefers-reduced-motion` (già
gestito altrove in `globals.css`, riusare lo stesso pattern).

### P4 — Chat IA: trasparenza sulle capacità e rifiniture di recupero (Set B)
**Schermata**: `web/components/ChatPanel.tsx` (usato in
`web/app/(dashboard)/veicoli/[id]/documenti/page.tsx`).
**Trend**: le 4 proprietà di una chat IA solida — trasparenza capacità, pattern di recupero, segnali di
incertezza, accessibilità (Setproduct); target touch ≥44px; riga leggibile 65-72 caratteri.
**Proposta**: aggiungere una riga di suggerimento sopra il campo (es. "Posso rispondere su motore,
carrozzeria, documenti caricati…", da `messages/*.json`) quando `messages.length === 0`; aumentare
l'altezza minima di input/bottone invio per il touch; verificare `max-w-[80%]` sulle bolle assistente
rispetto alla larghezza di lettura consigliata. **Non toccare** la gestione degli errori 401/redirect
già presente (`res.redirected`, righe 56-68) né `web/middleware.ts`: quella logica è del task di bug-fix
M1/T1, qui si tocca solo markup/copy/stile.
**Beneficio**: l'utente capisce subito cosa può chiedere, meno tentativi a vuoto; migliore usabilità
mobile.
**Sforzo**: M. **Rischio**: basso-medio (attenzione a non duplicare/contraddire la stringa d'errore che
il bug-fix M1 sta già correggendo).

### P5 — Risultati ricerca IA come bento per categoria (Set B)
**Schermate**: `web/components/GlobalSearch.tsx` (usato in `web/app/(dashboard)/ricerca/page.tsx`) e
`web/components/ResourceCategoryView.tsx` (condiviso anche da `VehicleDetailTabs.tsx`).
**Trend**: bento grid + densità informativa con gerarchia da spaziatura (Muzli, The Frontend Company).
**Proposta**: sostituire l'elenco verticale `<ul className="space-y-2">` con una griglia 2-3 colonne di
card compatte (icona categoria già mappata in `CATEGORY_ICON`, titolo, descrizione troncata); lo
skeleton di caricamento esistente (`.skeleton-line`) si adatta alla stessa griglia.
**Beneficio**: più risultati leggibili a colpo d'occhio, coerente sia in `ricerca` sia nella scheda
veicolo.
**Sforzo**: M. **Rischio**: basso — componente unico condiviso da due schermate, testare in entrambe.

### P6 — Specifiche tecniche come mini data-viz (Set B)
**Schermata**: `web/components/SectionEditor.tsx` (specifiche di sola lettura trovate dall'IA, prop
`specs?: Record<string, string>`, usato da `VehicleDetailTabs.tsx`).
**Trend**: data-viz avanzata anche per dataset piccoli — radial/heat map per rendere leggibili valori
tecnici (925 Studios).
**Proposta**: per le specifiche numeriche riconoscibili (es. potenza in cv, cilindrata in cc) mostrare
un piccolo stat-tile/badge con icona coerente con `icon-badge`, invece di solo testo chiave/valore;
mantenere il fallback testuale per valori non numerici (marca cambio, tipo alimentazione, ecc.).
**Beneficio**: le schede tecniche diventano più scansionabili, rinforza il posizionamento "premium".
**Sforzo**: L (serve capire quali chiavi sono numeriche/unità senza inventare dati — nessuna modifica ai
dati stessi, solo alla presentazione). **Rischio**: medio — le chiavi di `specs` arrivano libere dal
modello IA, quindi il parsing per il render deve degradare in sicurezza al semplice testo se il formato
non è riconosciuto.

## 4. Assegnazione

- **Set A** (Design 2, 05:50 UTC) — dashboard / lista veicoli / onboarding / autenticazione:
  P1 (dashboard bento, M), P2 (empty state routing, S), P3 (login/registrati tipografia cinetica, S).
- **Set B** (Design 3, 06:40 UTC) — scheda veicolo / form / ricerca IA / chat:
  P4 (chat capacità e recupero, M), P5 (risultati ricerca bento, M), P6 (specifiche mini data-viz, L).

Carico bilanciato: Set A più leggero in sforzo singolo ma tocca 3 schermate distinte (dashboard, form,
auth); Set B ha meno schermate ma include la proposta più impegnativa (P6).

## 5. Vincoli per i mockup

- Solo Next.js (App Router) + Tailwind CSS con i token esistenti in `web/tailwind.config.ts` e le
  classi utility in `web/app/globals.css`: niente nuove dipendenze UI, niente nuovi colori fuori da
  `brand`/`graphite`/`gold` senza discuterne prima.
- Contrasto testo/sfondo minimo WCAG 2.2 AA (4.5:1 testo normale, 3:1 testo grande e componenti non
  testuali come bordi di campi/focus ring) — attenzione particolare ai "campi fantasma" su sfondo scuro
  segnalati dal trend dark-mode-accessibility: ogni input/focus visibile deve avere bordo o stato pieno,
  non solo colore di sfondo leggermente diverso.
  [ColorContrast.org — Dark Mode Contrast Guide 2026](https://www.colorcontrast.org/blog/dark-mode-contrast-accessibility-guide/)
- Rispettare le 3 lingue supportate (`it`/`en`/`de`, `next-intl`): ogni nuova stringa va aggiunta a
  `web/messages/it.json`, `en.json`, `de.json`, non hardcoded nei componenti.
- Animazioni con `framer-motion` o `@keyframes` esistenti devono rispettare
  `@media (prefers-reduced-motion: reduce)` come già fatto per `.skeleton-line` in `globals.css`.
- Non modificare la logica di `web/middleware.ts`, `web/lib/motorsport.ts`, `web/lib/vehicleData.ts`,
  `web/lib/engineExtensions.ts` (oggetto dei task di bug-fix T1-T4): solo markup/stile dei componenti
  che li consumano, se necessario.
- Restare compatibili con la scala `graphite` invertita (50 = più scuro, 900 = più chiaro): non
  rinominare né "correggere" l'ordine.
