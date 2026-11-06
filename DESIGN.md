---
name: Pescare Admin
description: Category-standard PrimeReact Lara light back office for the Pescare team, finished to AA on a 14px root and a 4px grid.
colors:
  primary: "#2563eb"
  primary-hover: "#1d4ed8"
  primary-active: "#1e40af"
  primary-soft: "#eff6ff"
  primary-ink: "#1d4ed8"
  focus-halo: "#bfdbfe"
  ground: "#f9fafb"
  surface: "#ffffff"
  line: "#dfe7ef"
  row-line: "#e5e7eb"
  control-border: "#d1d5db"
  hover-wash: "#f3f4f6"
  ink: "#111827"
  ink-muted: "#4b5563"
  ink-soft: "#6b7280"
  ink-secondary: "#64748b"
  danger: "#b91c1c"
  danger-soft: "#fef2f2"
  danger-line: "#fecaca"
  invalid-border: "#e24c4c"
  success-icon: "#15803d"
  status-active-bg: "oklch(98.2% 0.018 155.826)"
  status-active-ink: "oklch(44.8% 0.119 151.328)"
  status-active-ring: "oklch(92.5% 0.084 155.995)"
  status-active-dot: "oklch(62.7% 0.194 149.214)"
  status-inactive-bg: "oklch(96.8% 0.007 247.896)"
  status-inactive-ink: "oklch(37.2% 0.044 257.287)"
  status-inactive-ring: "oklch(92.9% 0.013 255.508)"
  status-inactive-dot: "oklch(55.4% 0.046 257.417)"
typography:
  display:
    fontFamily: "Inter var, ui-sans-serif, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
    fontFeature: "'cv02', 'cv03', 'cv04', 'cv11'"
  headline:
    fontFamily: "Inter var, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
    fontFeature: "'cv02', 'cv03', 'cv04', 'cv11'"
  title:
    fontFamily: "Inter var, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.3333
  title-sm:
    fontFamily: "Inter var, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Inter var, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4286
    fontFeature: "'cv02', 'cv03', 'cv04', 'cv11'"
  body-strong:
    fontFamily: "Inter var, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4286
  caption:
    fontFamily: "Inter var, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.3846
  label-table:
    fontFamily: "Inter var, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.3846
  label-tag:
    fontFamily: "Inter var, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3333
  label-nav-group:
    fontFamily: "Inter var, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3333
    letterSpacing: "0.025em"
  wordmark:
    fontFamily: "Inter var, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "-0.025em"
rounded:
  md: "6px"
  full: "9999px"
spacing:
  "0.5": "2px"
  "1": "4px"
  "1.5": "6px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "10.5px 17.5px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
  button-small:
    rounded: "{rounded.md}"
    padding: "9.2px 15.3px"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
  button-text-hover:
    backgroundColor: "rgb(37 99 235 / 0.06)"
    textColor: "{colors.primary-hover}"
  button-secondary-text:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.md}"
  button-secondary-outlined:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.md}"
  segmented-filter:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "10.5px 17.5px"
  segmented-filter-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10.5px"
  status-tag-active:
    backgroundColor: "{colors.status-active-bg}"
    textColor: "{colors.status-active-ink}"
    typography: "{typography.label-tag}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
  status-tag-inactive:
    backgroundColor: "{colors.status-inactive-bg}"
    textColor: "{colors.status-inactive-ink}"
    typography: "{typography.label-tag}"
    rounded: "{rounded.md}"
    padding: "2px 8px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
  nav-item-hover:
    backgroundColor: "{colors.hover-wash}"
    textColor: "{colors.ink}"
  nav-item-active:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-ink}"
  sidebar:
    backgroundColor: "{colors.surface}"
    width: "224px"
  top-bar:
    backgroundColor: "{colors.surface}"
    height: "60px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
  card-toolbar:
    padding: "16px"
  table-header-cell:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-table}"
    padding: "12px 16px"
  table-cell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    padding: "8px 16px"
  table-sorted-header:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-ink}"
  paginator-page-active:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.full}"
    size: "42px"
  inline-alert:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  toast:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px"
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "21px"
  empty-state-icon:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.full}"
    size: "48px"
---

# Design System: Pescare Admin

## Overview

**Creative North Star: "The Well-Kept Ledger"**

Pescare Admin uses the admin-panel category standard on purpose: PrimeReact's Lara light theme, a white sidebar, a blue primary, and tables inside cards. That is the panel a small expert team already knows how to read, so the system does not reinvent it. It refuses only sloppiness. Every state is designed (loading skeleton, empty catalog, empty filter result, load error with retry, field-level conflict, toast confirmation), every text color passes WCAG AA, and layout spacing stays on a 4px grid. Sakai sets the bar for structure; Stripe Dashboard sets the bar for the finish of tables, states, and messages.

The density is a back-office density. The root font size is 14px, as in Sakai. Lara is written entirely in rem, so its controls shrink with the root and land at panel scale without restyling each component. Surfaces are white on a near-white ground, separated by thin cool borders, with very little elevation. Color is used sparingly: blue marks action and the current place, soft green and slate mark status, dark red marks errors. Copy uses the domain's own pt-BR vocabulary (método de pesca, defeso, grupo-alvo), and confirmations name where a change lands in the fishers' app.

Lara is the base, and the system changes it only where it falls short of AA or of the finish bar: the primary steps one shade darker, error red darkens, toasts lose their tinted fill and side stripe, solid status tags become soft tags, and table rows get tighter. Everything else is inherited Lara.

**Key Characteristics:**
- Lara light, executed rather than reinvented; overrides exist only for contrast and finish.
- 14px root and a 4px grid; text scale 12/13/14/16/18/24px.
- White surfaces on #f9fafb ground, 1px #dfe7ef borders, 6px corners.
- One blue (#2563eb) for action and current location; status in soft tinted tags.
- Every list state designed, with recovery paths inside the message.

## Colors

The palette is cool neutrals with one working blue, plus semantic tints that carry status and errors and are never used as decoration.

### Primary
- **Working Blue** (primary): Lara's #3b82f6 darkened one step. Used for primary buttons, text-button labels, the selected segment of the status filter, the focus outline, the caret, and the "Admin" half of the wordmark. With white text it passes AA, which Lara's blue (3.7:1) does not.
- **Pressed Blue** (primary-hover, primary-active): the next two steps down the same ramp, for hover and pressed states of filled blue controls.
- **Current-Place Wash** (primary-soft) with **Current-Place Ink** (primary-ink): the "you are here" pair, used for the active sidebar item, the sorted table column header, the current paginator page, and the empty-state icon disc.
- **Focus Halo** (focus-halo): Lara's 0.2rem focus ring on controls and the text-selection background.

### Neutral
- **Ground** (ground): the page background behind every card, and the table header row fill.
- **Surface** (surface): sidebar, top bar, cards, dialogs, toasts, inputs.
- **Hairline** (line): every structural 1px border, including the sidebar edge, top bar bottom, card outline, toolbar divider, paginator top, and toast outline.
- **Row Line** (row-line): Lara's table row divider, inherited.
- **Control Border** (control-border): Lara's input and segmented-filter stroke, inherited.
- **Hover Wash** (hover-wash): hover fill for sidebar items, toast close, and paginator pages.
- **Ink** (ink): headings, item names, labels, the current breadcrumb, and the signed-in user name.
- **Muted Ink** (ink-muted): body text (the default `body` color), descriptions, and table header text.
- **Soft Ink** (ink-soft): captions, nav group headings, breadcrumb separators, and unbuilt nav items.
- **Secondary Ink** (ink-secondary): Lara's secondary severity, used for Cancelar, Sair, the menu toggle, and "Desativar".

### Semantic
- **Error Red** (danger): form error text and inline alert text and icon. It replaces Lara's #e24c4c (3.9:1) as a text color. **Error Wash** (danger-soft) and **Error Hairline** (danger-line) are the inline alert's fill and border. **Invalid Border** (invalid-border) stays Lara's red on invalid input strokes, where the 3:1 non-text threshold applies.
- **Success Green** (success-icon): only the success toast icon.
- **Status tag pairs** (status-active-*, status-inactive-*): Tailwind v4 green-50/200/600/800 for "Ativo" and slate-100/200/500/700 for "Inativo". The source values are oklch and are kept as oklch.

### Named Rules
**The One-Step-Down Rule.** Wherever text sits on blue or is blue, use the primary (#2563eb) ramp, not Lara's #3b82f6. Lara's blue may appear only in non-text roles it already owns (input hover and focus border).

**The Color-Plus-Shape Rule.** Status is never conveyed by color alone. A filled dot means active and a hollow dot means inactive, and the word is always printed.

## Typography

**Display Font:** none (no display face; the page H1 is the top of the scale)
**Body Font:** Inter var (with ui-sans-serif, system-ui, sans-serif), self-hosted by the Lara theme
**Label/Mono Font:** Inter var; numeric counts use tabular figures

**Character:** a single variable grotesque with the cv02/cv03/cv04/cv11 alternates (open digits, single-story a). It is neutral and dense, so hierarchy comes from weight and ink rather than from size jumps.

### Hierarchy
- **Headline** (600, 24px, 1.25, -0.025em): the page H1 in the content area and the 404 page. One per screen.
- **Display** (600, 30px, 1.2, -0.025em): the sign-in greeting "Bem-vindo de volta" only — the panel's single welcome moment.
- **Title** (600, 18px, 1.3333): card-level headings.
- **Title Small** (600, 16px, 1.5): empty-state titles.
- **Body** (400, 14px, 1.4286): all running text, table cells, and inputs. Empty-state descriptions cap at 40ch.
- **Body Strong** (500, 14px): form labels, item names in tables, the current breadcrumb, the user name, and button labels.
- **Caption** (400, 13px, 1.3846): field errors, the paginator report, and footnotes. Counts use `tabular-nums`. No explanatory meta text: no count summary under the H1 and no helper hints under fields — the team knows the domain (user decision, 2026-10-12).
- **Table Label** (600, 13px): column headers. This overrides Lara's 700.
- **Tag Label** (600, 12px): status tags.
- **Nav Group Label** (600, 12px, 0.025em, uppercase): sidebar group headings (Catálogos, Regras e avisos, Administração) only.
- **Wordmark** (700, 16px, -0.025em, "Pescare" in ink) followed by 500/14px "Admin" in Working Blue. There is no logo yet; the name is the mark.

### Named Rules
**The Six-Step Rule.** Text sizes come only from 12/13/14/16/18/24px (Tailwind `text-xs` to `text-2xl`, recalculated for the 14px root). Avoid arbitrary sizes.

**The Weight-Not-Size Rule.** Inside a screen, separate levels with weight (400/500/600) and ink (ink / ink-muted / ink-soft) before reaching for a larger size.

## Layout

The root is 14px, and Tailwind's `--spacing` is recalculated to 0.2857rem so every spacing step is a whole 4px multiple (2, 4, 6, 8, 12, 16, 20, 24, 32, 48px). Layout, custom components, and gaps follow this grid. PrimeReact control internals keep Lara's rem metrics (for example, 10.5px button and input padding) and are not forced onto the grid.

**Shell.** At 1024px and wider, a two-column grid: a 224px (16rem) sticky white sidebar at full viewport height, then the content column. The sidebar's wordmark row is 60px high, matching the 60px sticky white top bar, and both sit on the same hairline. Sidebar body padding is 20px vertical and 12px horizontal, with 24px between nav groups and 2px between items. Below 1024px the sidebar becomes a PrimeReact drawer (288px, max 85vw) opened by a menu button in the top bar.

**Content.** Content is full width with no max-width container. Its horizontal padding matches the top bar (16 / 24 / 32px at base / 640 / 1024px) so the H1 aligns with the breadcrumb above it. Vertical padding is 24px, or 32px from 1024px up. Page sections stack with a 24px gap. The page header puts the title block left and actions right from 640px up, and stacks below that.

**List card.** The toolbar row has 16px padding and a hairline below it. Search is capped at 320px. The segmented status filter sits right from 768px up, and below that it stacks full width with equal segments. Table headers use 12px × 16px padding and cells use 8px × 16px, so the cells' 16px side inset matches the toolbar's. The status column is 144px and the actions column 240px. Both widths are fixed so the header does not shift when the list is empty. Pagination appears only past 10 rows.

**Phone (below 640px).** The breadcrumb and user name hide, and the wordmark takes the top bar. The status column hides and the tag moves under the item name. Row actions are icon-only at every width. Dialogs are `min(32rem, 100vw − 2rem)` wide (confirm: 30rem).

### Named Rules
**The Shared-Inset Rule.** Anything stacked vertically shares its horizontal inset: content padding equals top-bar padding, and table-cell padding equals toolbar padding (16px).

**The Map-Not-Hide Rule.** Sections without a screen yet stay in the sidebar at 60% opacity, are marked `aria-disabled`, and are explained by a visible footnote ("Seções apagadas ainda estão em construção.") rather than a per-item badge. The menu shows the whole panel from day one.

## Elevation & Depth

The system is mostly flat. Hairline borders and the ground-versus-surface contrast separate regions. Shadows are soft, cool (slate-tinted rgb(15 23 42)), and offset downward. They appear only on cards and on things that float above the page (toasts, dialogs, the drawer). There are no hard or zero-blur shadows.

### Shadow Vocabulary
- **Card Rest** (`box-shadow: 0 1px 2px rgb(15 23 42 / 0.04)`): the list card, which is barely lifted and paired with a hairline.
- **Toast** (`box-shadow: 0 12px 24px -12px rgb(15 23 42 / 0.25), 0 2px 6px rgb(15 23 42 / 0.06)`): toasts, which float bottom-right.
- **Lara Overlay** (`box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3)`): dialogs and the mobile drawer, inherited, over a `rgba(0, 0, 0, 0.4)` mask.

### Named Rules
**The Border-First Rule.** Every surface gets a hairline before it gets a shadow. A shadow is added only when the surface sits apart from the page flow.

## Shapes

The form language is soft rectangles. Controls, cards, dialogs, toasts, tags, inline alerts, and nav items use gently rounded corners (6px, Lara's `--border-radius`). Full circles are reserved for small round markers: paginator pages, the empty-state icon disc, and status dots. Borders are always 1px, and status tags use an inset 1px ring in their own tint. Nothing is clipped, angled, or decorated.

## Components

### Buttons
Lara buttons with the One-Step-Down primary. They are confident and plain.
- **Shape:** gently rounded (6px), 1px border in the fill color.
- **Primary:** Working Blue fill, white 14px label, 10.5px × 17.5px padding. One primary per region (the page action "Novo método", the dialog submit, the sign-in submit).
- **Hover / Active:** primary-hover, then primary-active, with Lara's 0.2s color transitions. Keyboard focus shows the 2px primary outline at a 2px offset (global `:focus-visible`), plus Lara's 0.2rem halo on controls.
- **Text:** row actions ("Editar", "Ativar") use blue labels on a transparent fill, and hover adds a 6% blue wash. Use small size in tables.
- **Secondary:** secondary-text for Cancelar, "Desativar", and the menu toggle; secondary-outlined for "Sair". Both use Secondary Ink, which stays quieter than the primary path.
- **Outlined (blue):** recovery actions inside messages ("Tentar novamente", "Limpar filtros"), at small size.
- **Loading:** buttons show Lara's inline spinner in place, and the row's toggle button carries the loading state while it saves.

### Status Tags
Outlined pills that replace Lara's solid severities (below AA) and read lighter than filled tags (team preference, 2026-10-20).
- **Style:** 13px/500 label, 2px × 10px padding, fully rounded, 1px border, white fill. No dot.
- **Ativo / Vigente:** green-600 border, green-700 text.
- **Inativo / Encerrado:** slate-400 border, slate-600 text. Neutral, not red: deactivating is not an error, the record only leaves the app.
- **Rascunho:** amber-600 border, amber-700 text (5.0:1). Something saved that does not count in the app yet.
- **Agendado:** Working Blue border, Primary Ink text (6.7:1). Active, but its validity starts on a future date.

### Cards / Containers
- **Corner Style:** 6px, with contents clipped to the corner.
- **Background:** Surface on Ground.
- **Shadow Strategy:** Card Rest for in-flow cards (see Elevation & Depth).
- **Border:** 1px Hairline. Inner sections (toolbar, paginator) are divided by hairlines too, and the last table row drops its bottom border so it does not double the card edge.
- **Internal Padding:** 16px in the toolbar.

### Inputs / Fields
- **Style:** Lara inputs with a white fill, 1px Control Border, 6px corners, 10.5px padding, and Muted Ink text. The search field shows a leading search icon and the placeholder "Pesquisar"; its specific name lives in `aria-label`.
- **Field pattern:** label above (Body Strong, Ink) with an 8px gap to the control, then the error as a 13px Error Red caption linked through `aria-describedby`. No helper hints under fields.
- **Focus:** Lara blue border plus the 0.2rem Focus Halo, and a Working Blue caret.
- **Error / Disabled:** Invalid Border stroke with Error Red text. Server conflicts (for example, a duplicate name) land on the field and take focus. Disabled controls fall to Lara's 60% opacity.

### Full-Page Form
Use a page instead of a dialog when a form is too big for one: the period of defeso has four groups of fields (norma, period, scope, municipalities), and one of them picks hundreds of municipalities.
- **Header:** the page header holds the H1 only, with no action.
- **Sections:** each group of fields is a Form Section card stacked 24px apart. The card has a Surface fill, a 1px Hairline, 6px corners and Card Rest. Padding is 16px, or 24px from 640px up. Each card has a Title (18px/600) `h2` and fields 20px apart.
- **Paired fields:** paired fields sit in two columns from 768px up, for example start/end and from/until.
- **Repeating rows:** a group that can repeat (the windows of a period) stacks one row per item, a 40px round secondary trash button at the end of each row once there is more than one, and a small text "Adicionar …" button with a plus below. Labels number the rows ("Início da janela 2") so each field has a unique name.
- **Bottom of the form:** a server error appears as an inline alert just above the actions, next to the button that caused it. The actions are the same footer as dialogs ("Cancelar" + primary), right-aligned. When saving can leave the record inactive, a switch with its label sits at the left of the same row ("Ativar agora", on by default).
- **Loading and missing data:** loading shows one skeleton block per section. A missing record shows the Empty State inside a card, with a way back to the list.

### Record Page (read-only, with versions)
A record that keeps a history (the period of defeso) opens on a read-only page before any form.
- **Header:** the H1 is the record's name, followed on the same line by its status tag and "Versão N" in Muted Ink. The actions sit on the right: outlined "Editar" and the other secondary actions, then one primary ("Nova versão", "Abrir rascunho" or "Ativar"). An old version has no actions.
- **Tabs:** the same Lara TabView as the home page: "Período" shows the version as Form Section cards with read-only fields (label above in Ink, value in Muted Ink, never disabled inputs), and "Versões" lists the history in a table card (Versão, Portaria, Janela, Vigência, Status), with "Atual" under the current version number and "Aberta" in place of the action on the open row.
- **Long lists:** hundreds of municipalities collapse into one row per UF ("PA · 44 municípios"), each a native disclosure with a chevron that rotates when open.

### Many-Item Picker
- **When:** a choice from thousands of items grouped by UF, here municipalities.
- **Controls:** a UF dropdown (168px from 768px up) beside a filtered, virtual-scroll MultiSelect of that UF's items. Its "select all" checkbox selects the whole UF.
- **Selected UFs:** below the controls, one pill per UF with selections ("PB · 66", tabular count) and a 24px round remove button. The pill of the open UF uses the Current-Place pair (Primary Wash fill, Working Blue border, Working Blue Ink text). Clicking a pill opens that UF.
- **Copy rule:** the per-UF counts are part of the control, not a count summary.

### Segmented Status Filter
A Lara SelectButton with three segments ("Todos (n)", "Ativos (n)", "Inativos (n)") and tabular counts. The selected segment is a Working Blue fill with white text. The filter disables, and drops its counts, while the list is loading or has failed. Lists whose states are not active/inactive rename the segments. Periods of defeso have five: "Todos", "Vigentes", "Agendados", "Rascunhos", "Encerrados", and their status tag reads "Vigente", "Agendado", "Rascunho" or "Encerrado". Below 768px, up to three segments share the full width; with more, segments keep their natural width and the row scrolls sideways, so no label is cut.

### Data Table
- Lara DataTable in a card, sorted by name by default. The sorted header takes the Current-Place pair.
- Header cells: Ground fill, 13px/600 Muted Ink, 12px × 16px padding. Body cells: 8px × 16px padding.
- Loading shows six skeleton rows with varied name widths rather than a spinner.
- Row actions: round icon-only text buttons (magnifier for Visualizar, which opens the item where it is also edited; eye-slash / eye for Desativar / Ativar; calendar-minus for Encerrar vigência), the label in a tooltip above the button (300ms delay) and in `aria-label` with the item name. Icons at 1.125rem (Lara small is 0.875rem), centered under a visible "Ações" header. 112px column.
- Paginator: previous, page numbers, next, and "Mostrando {first}–{last} de {totalRecords}". There are no first/last arrows. The current page is a 42px Current-Place circle.

### Navigation
- **Sidebar items:** 40px high, 12px side padding, 12px icon-to-label gap, 6px corners, primeicons at body size. The default is Muted Ink, hover is Hover Wash with Ink, and the active item is Current-Place Wash with Current-Place Ink at 600 weight.
- **Group headings:** Nav Group Label in Soft Ink, 8px above the item list.
- **Breadcrumb (top bar):** Muted Ink trail, a 12px angle-right separator in Soft Ink, and the current page in Body Strong Ink.
- **Mobile:** the same nav in a PrimeReact drawer, which closes when an item is chosen.

### Feedback Messages
- **Inline Alert:** an in-flow error with Error Wash fill, Error Hairline border, 6px corners, 12px × 16px padding, a leading exclamation-circle icon, an optional bold title, and an optional recovery action aligned right from 640px. It replaces Lara's Message (#ff5757, below AA).
- **Toast:** bottom-right, a white card with a 1px Hairline and the Toast shadow, Ink summary, Muted Ink detail, and a 20px colored icon (Success Green or Error Red). There is no tinted fill and no 6px side stripe.
- **Confirm Dialog:** Lara dialog, 30rem wide. The title names the item, the body names the consequence in the fishers' app, the reject action is secondary-text, and the accept action is primary with a verb + object label ("Desativar método").

### Sign-in
- **Layout:** two columns from 1024px. Left: white, with one centered block (max 364px) holding the wordmark, the Display greeting "Bem-vindo de volta" 40px below it, and the form 32px below that. No card around the form. Right: a Working Blue (#2563eb) panel inset 16px with 6px corners. Below 1024px the panel is hidden and only the form shows.
- **Porthole:** the illustration sits in a white circle (76% of the panel width, max 588px) like a boat's round window, with a 14px white ring at 15% opacity and a deep soft shadow (`0 24px 48px -24px rgb(15 23 42 / 0.45)`). The image fills the whole circle: a square PNG whose own white is the circle, so a browser's forced dark mode (which darkens CSS backgrounds but not images) cannot leave dark bands above and below the scene. The round clip hides the scene's loose edge lines.
- **Waves:** three wave bands at the panel foot, white at 6% / 8% fills and a 25% stroke, stretched to the panel width.
- **Illustration:** `src/assets/fishing-illustration-porthole.png`, the original `src/assets/fishing-illustration.png` (648×432) padded to 648×648 with its own white and the same metadata, chosen by the team (a fisher reeling in a fish; flat style, light blue and dark slate). Decorative only (`alt=""`, `aria-hidden`), and the panel carries no text. Origin and license are recorded in the PNG metadata; the style matches the Storyset library, whose free license requires a visible credit.

### Page Header
The H1 and the page's primary action, nothing else: no description or summary line under the title (team decision).

### Module Cards (Início)
The home page shows the modules from the same groups as the sidebar (`app/nav-groups.ts`), one tab per group, in a 1/2/3-column grid with 16px gaps.
- **Tabs:** Lara TabView restyled to sit on the page ground. 600-weight labels with the group icon (hidden below 640px so the three tabs fit), 12px × 16px padding (12px sides on phones), a Hairline baseline, and the active tab in Working Blue with a 2px underline. The tab panel has no box: the cards carry their own borders.
- **Card:** white with a 1px Hairline, 6px corners and 24px padding. A 30px outlined primeicon in Working Blue, then the Title (18px/600), then a one-line description in Muted Ink, then "Acessar página" with an arrow pinned to the card foot, so the links line up across a row. The whole card is the link; hover tints the border and lifts the shadow.
- **Not built yet:** gray-300 icon, Muted Ink title, the same description, and "Em breve" in Soft Ink instead of the link. Not focusable.
- **Copy:** the card description is the one place the panel uses explanatory text: on a hub, it tells the team what each module does before they open it.

### Empty State
A centered column with 48px vertical and 24px horizontal padding. It has a 48px Current-Place circle holding a primeicon, a Title Small heading in Ink, a 40ch Muted Ink description, and one small action 20px below. There are two variants: an empty catalog (create action) and an empty filter result ("Limpar filtros").

## Do's and Don'ts

### Do:
- **Do** use #2563eb (primary) for every blue that carries or sits behind text, with #1d4ed8 for hover and #1e40af for pressed.
- **Do** put Lara overrides inside `@layer primereact`, after the theme import, so variant selectors (`.p-button-secondary.p-button-text`, outlined, severity) still win by specificity. Keep the layer order `theme, base, primeicons, primereact, components, utilities`, and import the Lara theme without `layer()`, because it already declares `@layer primereact`.
- **Do** keep the 14px root and take sizes from the 12/13/14/16/18/24px scale and spacing from the 4px grid.
- **Do** wrap lists in a white card with a 1px #dfe7ef border, a 16px-padded toolbar, and 12px × 16px header / 8px × 16px body cells.
- **Do** design loading (skeleton rows), empty, filtered-empty, and error-with-retry states for every list.
- **Do** pair every status color with a shape (filled or hollow dot) and the printed word.
- **Do** keep unbuilt sections visible in the sidebar at 60% opacity with the shared footnote.
- **Do** write confirmation and toast copy that says where the change lands for fishers.

### Don't:
- **Don't** use Lara's #3b82f6 behind white text, #e24c4c as a text color, or Lara's solid Tag severities. All three fall below AA.
- **Don't** give toasts a tinted background or a colored side stripe. Color belongs to the icon only.
- **Don't** import the PrimeReact theme with `layer(...)` or move overrides outside `@layer primereact`. The first nests the theme in a sublayer, and the second flattens every variant.
- **Don't** add first/last page arrows to short catalog paginators.
- **Don't** put a max-width container on the content area. Content runs full width with the top bar's inset.
- **Don't** use hard, zero-blur, or colored shadows. Depth is a hairline first and a soft slate shadow second.
