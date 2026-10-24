# Meta Investimentos

Institutional investment portfolio management for Brazilian asset
managers. The app tracks portfolios, positions, applications,
withdrawals, fund quotas, regulatory norms and benchmark history,
then turns that ledger into daily performance series and monthly
PDF statements.

The product is written in Portuguese (`pt-BR`). The source code,
the code comments and this document are written in English.

---

## Table of contents

- [What it does](#what-it-does)
- [Features](#features)
- [Stack](#stack)
- [Architecture](#architecture)
  - [Layers](#layers)
  - [Directory map](#directory-map)
  - [Request flow](#request-flow)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Environment variables](#environment-variables)
  - [Database](#database)
  - [Run](#run)
- [Commands](#commands)
- [Tests](#tests)
- [Conventions](#conventions)
- [Continuous integration](#continuous-integration)
- [Known gaps](#known-gaps)

---

## What it does

An asset manager holds several portfolios. Each portfolio owns one
position per fund, and every position moves through applications
(subscriptions) and withdrawals (redemptions). Fund quotas arrive
from the CVM open data portal. The app computes the value of each
position day by day, compares the result against a benchmark
(including an inflation-adjusted benchmark), and produces a
monthly statement PDF for the client.

Every number is a decimal, never a float. Growth factors are
chained exactly so a compounded return never drifts from the sum
of its daily factors.

## Features

| Area         | What it covers                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| Portfolios   | Create, edit and delete portfolios with an interest rate and the norms attached to them.               |
| Positions    | One holding per fund per portfolio, with an opening balance and an allocation share.                  |
| Applications | Subscriptions recorded against a portfolio and a fund, on a valid quota date.                         |
| Withdrawals  | Redemptions recorded and reversible against a portfolio.                                              |
| Performance  | Daily position and portfolio performance, chained growth factors, benchmark and inflation comparison. |
| Benchmarks   | Benchmark registry and a dated rate history used to compare a period against its reference.           |
| Norms        | Regulatory norms that constrain allocation, attached to a portfolio and to a fund category.           |
| Funds        | Credenced funds with their category, linked to the regulatory norm that governs them.                 |
| Quotas       | Daily fund quota prices, imported in bulk from the CVM `INF_DIARIO` monthly files.                    |
| Banks        | Banks, bank accounts and checking accounts that back a portfolio.                                     |
| Statements   | Monthly PDF report per portfolio, rendered on demand from the persisted data.                         |
| Audit log    | Every mutation is recorded with the entity, the action, the changes and the acting user.              |
| Users        | User administration, with `USER` and `MANAGER` roles.                                                 |

## Stack

- **Next.js 16** (App Router, React Server Components) and **React 19**
- **TypeScript 5** in strict mode
- **Tailwind CSS 4** with **shadcn/ui** primitives on **Base UI**
- **Drizzle ORM** on **Neon Postgres** (HTTP driver)
- **Better Auth** for e-mail and password authentication
- **Zod 4** for validation
- **decimal.js** for every monetary and ratio value
- **@react-pdf/renderer** for the statement report
- **Recharts** and **TanStack Table** for charts and datatables
- **Vitest 2** for the unit and integration suites
- **Inngest** for background work (installed, wiring pending)

## Architecture

The codebase follows a layered, port-and-adapter architecture. Each
layer has one job, and the layers only depend on the ones below.

```
app/            Next.js routes. Thin: load props, hand them to a route page.
   │
presentation/  Delivery layer: routes, parts, UI primitives, composition root.
   │
services/      Application layer: use cases, DTOs, mappers.
   │
domain/        Business rules: entities, events, calculators, interfaces.
   │
infrastructure/  Persistence: Drizzle repositories and row mappers.
```

`domain/` never imports `infrastructure/`. The domain declares the
repository it needs as an interface; the infrastructure layer
implements it. `presentation/` never reaches into `clients/`,
`database/`, `domain/` or `infrastructure/` either: it takes
everything it needs from a container in `presentation/composition/`,
so a screen stays testable without a database.

### Layers

| Layer          | Folder            | Holds                                                                                                                         |
| -------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Domain         | `domain/`         | 23 bounded contexts. Entities, domain events, calculators (the equations) and repository interfaces. No framework imports.    |
| Value objects  | `value-objects/`  | `EntityId`, `PositiveMoney`, `SignedMoney`, `SignedPercentage`, `QuotaPrice`, `QuotaQuantity`, `GrowthFactor`, `Cpf`, `Cnpj`. |
| Application    | `services/`       | 20 modules of use cases (`*.use-case.ts`), DTOs and mappers. Orchestrates domain objects and repository interfaces.           |
| Infrastructure | `infrastructure/` | Drizzle repository implementations and row-to-entity mappers. The only layer that knows SQL exists.                           |
| Presentation   | `presentation/`   | Route modules, shared parts, presenters, masks, settings and the composition root.                                            |
| Delivery       | `app/`            | App Router routes. A route file decides the title and loads props; it never renders markup itself.                            |
| Jobs           | `jobs/`           | Long-running tasks: quota import, portfolio and position performance, statement generation.                                   |

### Directory map

```
├── app/                    App Router routes
│   ├── (auth)/             Sign in and sign up
│   ├── (main)/             The authenticated shell
│   └── api/                Auth handler and the statement PDF endpoint
├── clients/                External clients: database, auth, CVM, Inngest
├── constants/              Shared constants: rounding and benchmark inflation
├── database/               Drizzle schemas and relations
├── domain/                 Entities, events, calculators, interfaces
├── errors/                 Domain error types
├── infrastructure/         Repositories and mappers
├── jobs/                   Background job entry points
├── lib/                    Cross-cutting helpers: auth, authz, dates, money, validation
├── presentation/
│   ├── composition/        Containers: the only wiring point
│   ├── parts/              Shared parts, on the entity, shared and main shelves
│   ├── presenters/         Value presenters for the UI
│   ├── routes/             One module per route
│   ├── theme/              Theme provider and hotkeys
│   └── ui/                 shadcn/ui primitives
├── scripts/                Structure check scripts
├── services/               Use cases, DTOs and mappers
├── value-objects/          Shared value objects
├── drizzle/                Generated migrations
└── __tests__/              Unit and integration suites
```

A route module owns its screen end to end:

```
presentation/routes/portfolio/
├── actions/       Server actions
├── datatable/     filters, table, table-columns, toolbar
├── dialogs/       add, edit, confirm-delete
├── helpers/       load-portfolio-page-props.helper.ts
├── hooks/         use-portfolio-datatable.hook.ts, ...
├── pages/         list.tsx, detail.tsx
├── settings/      labels.settings.ts
├── types/         Row and column shapes
└── validations/   Zod schemas for the actions
```

### Request flow

1. `app/(main)/portfolio/page.tsx` calls a helper that resolves the
   props of the screen on the server.
2. The helper asks a container in `presentation/composition/` for the
   use cases it needs.
3. The container builds the use cases on top of the Drizzle
   repositories.
4. The use case applies the domain rules and returns a DTO.
5. The route page hands the props to the route page component, which
   composes parts, dialogs and the datatable.

## Getting started

### Prerequisites

- **Node.js 22**
- **npm 10+**
- A **Neon Postgres** database (the driver is HTTP-based, so no
  local PostgreSQL is required)

### Install

```bash
npm ci
```

### Environment variables

Create a `.env` file at the repository root:

```bash
# Neon Postgres connection string used by the application.
DATABASE_URL=postgresql://user:password@host/db?sslmode=require

# Public origin of the application, used by Better Auth.
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Server-side origin, used by Better Auth for callbacks.
BETTER_AUTH_URL=http://localhost:3000

# Event key for Inngest. Optional until the functions are served.
INNGEST_EVENT_KEY=
```

For the integration suite, create a `.env.test` file with a
**separate** database:

```bash
# The integration suite refuses to run when this equals DATABASE_URL.
TEST_DATABASE_URL=postgresql://user:password@host/test-db?sslmode=require
```

`DEBUG=1` keeps the console output of the test suite enabled.

### Database

Sync the schemas in `database/schemas/` to the target database:

```bash
npx drizzle-kit push
```

`drizzle-kit push` reads `DATABASE_URL` from the environment and
diffs the Drizzle schemas against the live database, so it is the
command to run against a fresh database.

The SQL files under `drizzle/` are the recorded history of the
schema. The integration suite replays them against
`TEST_DATABASE_URL` on its own, statement by statement, so it needs
no manual step.

To record a new migration after a schema change:

```bash
npx drizzle-kit generate
```

### Run

```bash
npm run dev
```

The application opens on `http://localhost:3000`. The root path
redirects to `/portfolio`. A signed-out visitor is redirected to
`/sign-in` by the middleware in `proxy.ts`.

To run the Inngest development server:

```bash
npm run inngest:dev
```

## Commands

| Command                    | What it does                                              |
| -------------------------- | --------------------------------------------------------- |
| `npm run dev`              | Starts the Next.js development server.                    |
| `npm run build`            | Builds the production bundle.                             |
| `npm run start`            | Serves the production bundle.                             |
| `npm run lint`             | Runs ESLint with zero warnings allowed.                   |
| `npm run format`           | Formats every `.ts` and `.tsx` file with Prettier.        |
| `npm run typecheck`        | Type-checks the application sources.                      |
| `npm run typecheck:tests`  | Type-checks the test sources.                             |
| `npm run structure`        | Runs the three structure check scripts.                   |
| `npm run verify`           | The full gate: type-check, structure, lint, format check. |
| `npm test`                 | Runs the unit suite and then the integration suite.       |
| `npm run test:unit`        | Runs the unit suite only.                                 |
| `npm run test:integration` | Runs the integration suite only.                          |
| `npm run test:coverage`    | Runs both suites with coverage.                           |
| `npm run inngest:dev`      | Starts the Inngest development server.                    |

`npm run verify` is what CI runs. Run it before opening a pull
request.

## Tests

The suite is split in two, and the split is enforced by
`scripts/check-test-structure.ts`:

- `__tests__/__unit__/` — never touches the database. Repositories
  are faked. Coverage thresholds: 95% on `domain/`, `value-objects/`
  and `lib/`, 85% on `services/`.
- `__tests__/__integration__/` — the only place a repository runs
  for real. Coverage threshold: 80% on `infrastructure/`. The suite
  runs serially because the tests share one database.

The test tree mirrors the source tree, and the file name mirrors the
file under test. A test file for `domain/portfolio/calculators/target.calculator.ts`
is `__tests__/__unit__/domain/portfolio/calculators/target.calculator.test.ts`.
The suffix is always `.test.ts`, never `.spec.ts`.

## Conventions

The repository is strict about structure, and the rules are
machine-checked. `npm run structure` runs three scripts:

- `scripts/check-structure.ts` — owns the folder shape. Allowed
  route folders, one suffix per folder, no cross-route imports, no
  empty folders, and the 65-character line limit.
- `scripts/check-presentation-structure.ts` — owns the file shape.
  Every `.ts` file in `presentation/` declares its concern through
  its suffix, no barrel file hides a symbol, a route page composes
  parts instead of rendering markup, a `types/` file declares shapes
  instead of behaviour, and no file outside `composition/` imports an
  inner layer.
- `scripts/check-test-structure.ts` — owns the test shape. The
  mirrored test of every entity, event, calculator, mapper,
  repository, use case, lib helper and value object must exist.

The written rules live in `agents/CONVENTIONS.md` (naming and
structure) and `agents/DOCUMENTATION.md` (TSDoc). The short version:

- File names are kebab-case and carry a suffix that names the
  responsibility: `*.entity.ts`, `*.event.ts`, `*.calculator.ts`,
  `*.use-case.ts`, `*.repository.ts`, `*.mapper.ts`, `*.action.ts`,
  `*.validation.ts`, `*.presenter.ts`, `*.mask.ts`, `*.settings.ts`,
  `*.test.ts`. Validation schemas use `*.validation.ts`, never
  `*.schema.ts`; that suffix belongs to Drizzle.
- `const` is `SCREAMING_SNAKE_CASE`, other variables are `camelCase`,
  functions are `PascalCase`, and React hooks are `camelCase` with a
  `use` prefix.
- A file stays under 250 lines of code and holds one responsibility.
  A God file is a defect.
- Every file carries a TSDoc block with `@summary`, `@remarks`,
  `@explanation` and `@author`.
- Lines stay within 65 characters, except JSX and prose in markdown.

## Continuous integration

`.github/workflows/verify.yml` runs on every push and pull request.
It installs the dependencies, runs `npm run verify`, and then runs
`npm run build` with placeholder environment variables. The build
never connects to the database, so the placeholders are enough to
compile the bundle in a clean runner.

The test job is present but commented out. The repository has no
test runner yet, and wiring one would report a false green.

## Known gaps

These are the limitations of the current state of the repository,
listed so nobody has to rediscover them:

- **Inngest is not served.** The client and the job functions exist,
  but there is no `app/api/inngest/route.ts` and no `serve()` call,
  so `npm run inngest:dev` currently exposes no functions.
- **The test job is not in CI.** See the section above.
- **`npm run structure` does not pass on `master` today.** It
  reports three `composition` violations in the portfolio add and
  edit dialogs, and one `no-inner-layer-import` in the shared
  annual-chart helper. The gate has to be green before the next
  push.
- **`/checking-account` is not in the protected route list.** The
  page still requires a session, so an anonymous visitor sees an
  empty screen instead of a redirect.
- **Three integration flows are unwritten.** The performance
  calculation, the quota import and the withdrawal flows have unit
  suites with faked repositories; their database-backed behaviour is
  not proven yet.

## License

Private project. All rights reserved.
