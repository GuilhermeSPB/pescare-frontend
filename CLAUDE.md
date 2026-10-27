# CLAUDE.md

Pescare Admin — web admin panel for the Pescare fishing-management system (species, fishing bans, fishing methods, fishing locations, buyers, alerts). Consumes the REST API in `../pescare-backend`.

## Development philosophy

- **Functional over OOP**: prefer functions, hooks, and composition. Do not create classes — the project uses no inheritance or instantiation.
- **SRP**: each component, hook, API file, and function does one thing only. If you need "and" to describe what it does, split it.
- **ISP**: keep interfaces and props small and specific. Avoid generic props that accumulate responsibilities.
- **DIP**: pure logic (`utils/`, helpers) receives its dependencies as parameters. The only sanctioned singletons are the axios instance (`@/lib/api-client`) and the `queryClient` (`@/lib/react-query`) — import them, never create new instances inside features.
- **KISS**: the simplest solution that solves the problem is the right one. Do not anticipate abstractions.
- **DRY**: logic duplicated in two places is a candidate for extraction. In three places, extraction is mandatory.
- **Type safety**: no `any` in API request/response types — define them in `features/[feature]/types/` (or `src/types/` when shared by several features). `any` in other contexts requires a justifying comment.
- **Before generating code**: identify the correct layer (`app/routes/`, `features/[feature]/api|components|hooks|pages|stores|types|utils`, or a shared folder), the target file, and the types involved. Only then implement.

### Components

- **Reuse first**: before creating a component, search `src/components/` and the current feature's `components/` for one that already solves the problem. Always prefer an existing component over writing new markup.
- **Build for reuse**: whenever possible, design components to be reused across the project — driven by props, with no hard-coded domain data, no data fetching, and no knowledge of the route they live in. Feature-specific logic stays in the parent.
- **Where they live**: reusable UI goes in `src/components/` and is used throughout the project. A component goes in `features/[feature]/components/` only when it is tied to that feature's domain. When another feature needs it, move it to `src/components/` (features cannot import from each other).
- **Wrap recurring PrimeReact patterns**: patterns that repeat (form field with label + error, data table, confirmation dialog, page header) become shared components in `src/components/` instead of repeating PrimeReact configuration in each feature.
- **Extend, don't copy**: if an existing component almost fits, extend it with a small, specific prop instead of creating a near-duplicate — without turning it into a catch-all component (ISP).
- **Composition**: routes orchestrate feature components; feature components compose shared components.

## Stack

- Build/dev: Vite 6 + TypeScript 5.6 (`strict`, `noUnusedLocals`, `noUnusedParameters`). Standalone SPA.
- UI framework: React 19.
- Routing: React Router 7 (data router — `createBrowserRouter` in `src/app/router.tsx`). Import from `react-router`, not `react-router-dom`.
- Server state: TanStack Query 5 (+ `@tanstack/react-query-devtools` in dev).
- HTTP: axios, through a single instance in `src/lib/api-client.ts`.
- Client state: Zustand — not installed yet; add it (`npm i zustand`) when the first global client state appears. Do not use Context for global state, and never copy server data into a store (that belongs to TanStack Query).
- UI: PrimeReact 10 + primeicons, styled with Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss-primeui`). No `tailwind.config.js` — Tailwind v4 is configured in CSS (`src/index.css`).
- Forms: react-hook-form + zod 3 (`@hookform/resolvers/zod`). The backend uses zod 4 — schemas are not shared; redefine them on the frontend.
- Backend contract (`../pescare-backend`): Express, routes under `/api/v1`, JWT auth (`POST /auth/sign-in` → `{ token, user }`, sent as `Authorization: Bearer <token>`, expires in 1 day), roles `ADMIN` | `FISHER` (write operations require `ADMIN`). Errors come as `{ message, issues?: { path, message }[] }` — show `message` to the user. Fields are snake_case (`main_name`, `is_active`, `fk_target_group_id`); keep them as-is in API types, do not rename.

## Structure

Feature-based architecture (Bulletproof React). Path alias: `@/` → `src/`.

```
src/
  app/             # application layer
    routes/        # app-level pages (shell, home, 404) and cross-feature composition only — no business logic
    router.tsx     # route tree (createBrowserRouter)
    provider.tsx   # global providers (QueryClientProvider, PrimeReact, ...) — to be created
    index.tsx      # App root
  features/
    [feature]/     # alerts, auth, buyer-types, buyers, fishing-bans, fishing-location-types, fishing-methods, location-fishings, species, target-groups
      api/         # one file per endpoint: request fn + queryOptions + hook
      components/  # components exclusive to this feature
      hooks/       # feature hooks not tied to a single endpoint
      pages/       # one page per feature route (`*-page.tsx`, owns its `<title>`); router.tsx imports it directly
      stores/      # Zustand stores of this feature
      types/       # API request/response and domain types
      utils/       # pure helpers of this feature
  components/      # shared UI components (used by 2+ features)
  hooks/           # shared hooks
  lib/             # preconfigured libraries (api-client.ts, react-query.ts)
  stores/          # global Zustand stores
  types/           # shared types
  utils/           # shared pure helpers
  config/          # env/config (read `import.meta.env` only here)
  assets/          # static files
```

Only create the subfolders a feature actually needs.

### Import rules (enforced by ESLint `import/no-restricted-paths`)

- A feature never imports from another feature. When two features must interact, compose them in `app/routes/`.
- `features/` never imports from `app/`.
- Shared folders (`components`, `hooks`, `lib`, `stores`, `types`, `utils`, `config`) never import from `features/` or `app/`.
- Code flows one way: shared → features → app.
- Use the `@/` alias for imports outside the current folder. Import files directly; do not create barrel `index.ts` files.

### API files

One file per endpoint, named by action: `get-species.ts`, `get-species-by-id.ts`, `create-species.ts`, `update-species.ts`. Each file contains:

```ts
// features/species/api/get-species.ts
export const getSpecies = (): Promise<Species[]> => api.get('/species')

export const getSpeciesQueryOptions = () =>
  queryOptions({ queryKey: ['species'], queryFn: getSpecies })

export const useSpecies = () => useQuery(getSpeciesQueryOptions())
```

- Query keys: `['<resource>']` for lists, `['<resource>', id]` for a single item.
- Mutations invalidate the related query keys in `onSuccess`.
- Decision rule: if it calls a React hook → hook (`use...`) inside the API file or in `hooks/`. If it's a pure function with no React → `utils/`.

## Commands

### Prerequisites to run locally

- Node + npm. Copy `.env.example` to `.env` (`VITE_API_BASE_URL=http://localhost:3000/api/v1`).
- Backend running from `../pescare-backend`: PostgreSQL with the schema in `../pescareSQL_v1.sql`, then `npm run dev` (port 3000). Create an admin user with `npm run create-admin`.

### Inside pescare-frontend

- `npm install` — install dependencies.
- `npm run dev` — Vite dev server on http://localhost:5173.
- `npm run build` — type check (`tsc -b`) + production build. Use `npx tsc -b` for type check only.
- `npm run preview` — serve the production build.
- `npm run lint` — ESLint over the project.
- `npm run format` — Prettier write. Check only: `npx prettier --check .`.

## Current state

- Built: sign-in (`/entrar`), the authenticated shell (`app/routes/app-layout.tsx`: sidebar, top bar, route guard), the home page (`/`, module cards) and every catalog under `/catalogos/`: **Espécies**, **Grupos-alvo**, **Métodos de pesca**, **Tipos de local** and **Tipos de comprador**. `app/nav-groups.ts` is the single list of modules: it feeds both the sidebar and the home cards. Modules without a `to` render as "Em breve" — when a screen ships, create its page in `features/[feature]/pages/`, add its `to` there and its route in `app/router.tsx`.
- UI copy rule (team decision): no explanatory text — no description under page titles, no count summaries, no field hints. Exceptions: the one-line description on each home module card (`description` in `app/nav-groups.ts`) and the "Pesquisar" placeholder in the catalog search field.
- Simple catalogs — métodos de pesca, tipos de local, tipos de comprador, grupos-alvo — share one contract (`{ id, name, is_active }`, `?isActive=`, POST `{ name }`, PUT partial, no delete, 409 on duplicate name) and one screen: `src/components/named-catalog-screen.tsx`. Each feature only adds its `api/` files, types, and a `pages/*-page.tsx` with its copy (`NamedCatalogScreenCopy`) that passes its query and mutations (two update instances: rename and activate/deactivate) to `NamedCatalogScreen`. Use `fishing-methods` as the reference.
- Catalogs with their own shape (Espécies so far) build their screen in the feature but reuse the `catalog-*` pieces (`catalog-section`, `catalog-toolbar`, `catalog-empty-state`, `catalog-row-actions`), `form-dialog`, `active-status-tag`, `hooks/use-catalog-filter`, `utils/catalog-paginator` and `lib/confirm-deactivation`.
- Espécies needs target groups (names in the table, options in the form). Features cannot import each other, so `app/routes/species.tsx` calls `useTargetGroups()` and passes the query to `SpeciesPage`. The species API reads `fk_target_group_id` but writes `target_group_id`.
- Visual direction: PrimeReact Lara light (category standard), adjusted for AA contrast and density in `src/index.css`. Root font-size is 14px and Tailwind `--spacing` is 4px. PrimeReact styles live in `@layer primereact` (theme and runtime-injected styles), below Tailwind utilities — import PrimeReact CSS without `layer()` and put Lara overrides inside `@layer primereact`. Design system: `DESIGN.md`.
- `npm run create-admin` is referenced above but the script does not exist in `../pescare-backend` yet.
- JWT: stored in `localStorage`. The signed-in user's data comes from `GET /users/me` (server state, TanStack Query) — do not persist the `user` from sign-in. Because any injected script can read `localStorage`, never render API content with `dangerouslySetInnerHTML`. On a `401`, clear the stored token and redirect to the login.
- CORS: enabled in the backend (`cors` middleware, allowed origins from `CORS_ORIGINS` in `../pescare-backend/.env`). No Vite dev proxy.

## Code style

- Functions: preferably 4-30 lines. Split if longer.
- Files: preferably under 500 lines. Split by responsibility.
- One thing per function, one responsibility per module (SRP).
- Names: specific and unique. Avoid `data`, `handler`, `Manager`.
  Prefer names that return <5 grep hits in the codebase.
- Types: explicit. No `any` and untyped functions.
- No code duplication. Extract shared logic into a function/module.
- Early returns over nested ifs. Max 2 levels of indentation.
- Exception messages must include the offending value and expected shape.

## Naming conventions

- **PascalCase**: components (`SpeciesList`) and types/interfaces (`SpeciesFormValues`). Do not use the `T` suffix.
- **kebab-case**: all directory and file names, including components (`species-list.tsx` exports `SpeciesList`, `use-species-filter.ts`, `get-species.ts`).
- **camelCase**: variables, functions, methods, and props.
- Prefix `handle` on event handlers: `handleClick`, `handleFormSubmit`.
- Prefix `is/has/can` on booleans, always with context in the name: `isSpeciesLoading`, `hasFormError` — never just `isLoading`.
- Prefix `use` on custom hooks: mandatory — any function that calls hooks internally must start with `use`.

## Language

- Comments and UI strings: pt-BR.
- Variable/function/file/folder names: English (standard for code).

## Comments

- JSDoc (`/** ... */`) is required on all exported functions in `features/*/api/`, `hooks/`, `utils/`, and `lib/`.
- Include: one-line intent, `@param` for non-obvious parameters, `@returns` when the return value needs context.
- Do not use JSDoc on React components — document complex props with inline TypeScript comments instead.
- Keep your own comments. Don't strip them on refactor — they carry intent and provenance.
- Write WHY, not WHAT. Skip `// increment counter` above `i++`.
- Docstrings on public functions: intent + one usage example.
- Reference issue numbers / commit SHAs when a line exists because of a specific bug or upstream constraint.

## Formatting

- Prettier with the repo's `.prettierrc`: no semicolons, single quotes, trailing commas, `printWidth: 100`. Don't discuss style beyond that.

## Logging

- `console.error` for caught exceptions, always with context (`console.error('Sign-in error:', error)`).
- `console.warn` for non-fatal situations (e.g. timeouts, activated fallbacks).
- Use a bracketed prefix to identify the source: `console.warn('[api] token expirado — redirecionando para login')`.
- No structured logging infra exists yet — do not introduce one without a team decision.

## Accessibility

- Use semantic HTML (`<button>`, `<main>`, `<nav>`, `<section>`) instead of generic `<div>`.
- Apply ARIA (`aria-label`, `role`, `aria-describedby`) only when semantic HTML or the PrimeReact component is not sufficient.
- Custom interactive elements must support keyboard navigation (`tabIndex`, `onKeyDown`).
- Follow a logical heading hierarchy: `<h1>` → `<h2>` → `<h3>`, without skipping levels.
- Form errors must be associated with their field via `aria-describedby`, not only displayed visually.

## Response

- Always reply to the user in Portuguese (pt-BR).
