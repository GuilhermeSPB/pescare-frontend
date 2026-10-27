# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: the Pescare team**, signed in with the `ADMIN` role. They keep the reference data and the regulatory content that the fishers' app depends on. Back-office work in a desktop browser.
- **Fishers (`FISHER` role) do not use this panel.** They use a separate mobile app (outside this repository) that consumes the same backend (`../pescare-backend`).

## Product Purpose

Pescare lets fishers record their own production — fishing trips (date, municipality, location type, fishing method), catches by species and quantity, and sales to buyer types — so they build a history of what they caught and sold. It also tells them which fishing bans (defesos) and alerts apply to their municipality.

This admin panel ("Pescare Admin") exists so the Pescare team can keep the data behind that app correct and current. Success means the catalogs, defesos, and alerts the fishers see in the app are accurate, and the team can maintain them without errors.

## Positioning

Open decision — not defined yet. Confirmed so far: for the fisher, the core value is recording their own production (catches and sales); defeso and alert information supports it.

## Operating Context

- Academic project, built by a small team (repositories `pescare-frontend` and `pescare-backend`).
- No region, partner institution, or deployment target defined yet.
- Everything the team changes here reaches fishers through the mobile app:
  - **Alerts** have a lifecycle `DRAFT` → `PUBLISHED` → `ARCHIVED`, a type (`FISHING_BAN`, `NEWS`, `EVENT`, `SYSTEM`), and a scope: `GLOBAL` (every municipality) or `MUNICIPAL` (a list of municipalities). Fishers choose which alert types they want to receive.
  - **Defesos** are instituted by a norm (portaria / instrução normativa), are `CONTINENTAL` or `MARINHO`, and have date periods, affected species, covered municipalities, and restricted location types (or all location types).
- Municipalities are identified by the 7-digit IBGE code.
- Catalog entries (fishing methods, location types, buyer types, target groups) with `is_active = false` stop appearing as options in the fishers' app; records already registered keep them (confirmed by the team).

## Capabilities and Constraints

Jobs the admin panel covers (confirmed):

- **Catalogs**: species (scientific name, main name, description, target group), target groups, fishing methods, fishing location types, buyer types.
- **Defesos**: norms, periods, species, municipalities, and location types.
- **Alerts**: create, publish, and archive; global or per municipality.
- **Users**: list, create, and activate/deactivate fishers and admins.
- **Municipalities**.

Not chosen as admin-panel jobs: browsing fishing records and commercialization data, reports, or indicators. Treat them as out of scope unless the team confirms otherwise.

Constraints from the backend:

- Nothing is deleted. The API has no delete routes: records are deactivated (`is_active`) and alerts are archived.
- Every write requires `ADMIN`. Sessions use a JWT that expires after 1 day.
- The defeso API does not exist yet (`pescare-backend/src/modules/fishing-ban/` is empty).
- The municipalities API is read-only today (list and get by IBGE code), although managing municipalities is a panel job.
- Some database values are still provisional (fishing record status, catch unit of measure are marked "ajustar valores reais" in the schema).

Terminology (pt-BR UI): defeso, norma, período, espécie, grupo-alvo, método de pesca, tipo de local, tipo de comprador, município, alerta, pescador, administrador.

## Brand Commitments

- Name: **Pescare**. Panel title: **Pescare Admin**.
- Interface language: Brazilian Portuguese (pt-BR).
- No logo or voice guidelines exist yet.
- Visual direction (standing preference, chosen by the team on 2026-10-12): the admin-panel category standard — PrimeReact Lara light, white sidebar, blue primary, tables inside cards — executed at full craft, not reinvented. Craft bar: Sakai (PrimeReact's official admin template) for structure; Stripe Dashboard for the finish of tables, states, and messages.

## Evidence on Hand

- Database schema: `../pescareSQL_v1.sql`. API contract: `../pescare-backend`.
- No real content, logos, screenshots, usage data, user research, partners, or testimonials exist. Do not invent numbers of fishers, regions, institutions, or results.

## Product Principles

1. **The panel serves the app.** Every admin action exists to make what fishers see correct; it should be clear where a change lands (scope, status, municipalities) before it is published.
2. **Accuracy over speed of entry.** A wrong species, defeso period, or municipality misinforms fishers' records and their compliance.
3. **Nothing is destroyed.** Deactivate and archive instead of deleting, so history stays intact.
4. **Built for a small, expert team.** Optimize for repeated back-office work with the domain's own vocabulary, not for persuasion or first-time onboarding.
