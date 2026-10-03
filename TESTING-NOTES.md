# Testing notes

Findings from the audit that produced the automated suite in
`__tests__/`. Each entry records something the suite had to work
around, or something the suite deliberately does not cover, so a
reviewer does not read the gaps as oversights.

Nothing in production code was changed to make it testable. Where a
test needed a workaround it is written down here instead.

---

## 1. `Position.changeAllocation` accepts any percentage

`domain/position/entities/position.entity.ts` guards that the
position is persisted and that an allocation was supplied, but it
never checks the `0`–`100` range.

The range is only enforced by the database, in the migration
`drizzle/20260926023227_add_position_allocation`:

```sql
ALTER TABLE "portfolio"."position"
  ADD CONSTRAINT "position_allocation_range"
  CHECK ("allocation" >= 0 AND "allocation" <= 100);
```

An in-memory entity can therefore hold an allocation of `250` and
only the persistence layer rejects it. Every other percentage on
the aggregate (`Norm`, `NormsPortfolios`, `Portfolio`) is range
checked in the domain, so this looks like an oversight rather than
a deliberate boundary.

**Status** — not fixed. Production code is out of scope for this
task. The entity test asserts the current behaviour (no range
check) so the gap is visible; if the entity gains the check, that
test fails and has to be rewritten into a `ValidationError` case.

---

## 2. Two mappers have no `ToUpdate`

`infrastructure/norms-portfolio/mappers/norms-portfolios.mapper.ts`
and `infrastructure/audit-log/mappers/audit-log.mapper.ts` export
only `ToDomain` and `ToInsert`.

That is consistent with how the matching repositories persist:
`NormsPortfoliosRepository.save` and `AuditLogRepository` never
take the update branch, so there is nothing for a `ToUpdate` to
feed.

**Status** — accepted. The mirror rule in
`scripts/check-test-structure.ts` only requires a suite per
mapper file, not per exported function.

---

## 3. `updatedAt` is owned by the database, not the entity

No `ToUpdate` in `infrastructure/` writes `updatedAt`. Thirteen
schemas declare `.$onUpdate(() => new Date())`, so Drizzle
refreshes the column with the client clock whenever the update
payload omits it.

A consequence for tests: after `repository.save(entity)`, the
persisted `updatedAt` is **not** the `now` that was passed to the
entity mutator. Asserting equality with the mutator's `now` fails.

**Status** — worked around. The affected integration cases assert
the timestamp advanced past the seeded value instead of matching
it, which is what the column actually promises.

---

## 4. Three empty service folders

`services/account/use-cases`, `services/session/use-cases` and
`services/verification/use-cases` contain no `.ts` files. The
aggregates are persisted through `infrastructure/` repositories and
read through `presentation/`, but the service layer exposes no
orchestration for them.

**Status** — not fixed. A folder with no behaviour has nothing to
test, and no production file was deleted to tidy it up. Worth
deciding whether these use cases are missing or intentionally
absent.

---

## 5. `add-*` and `create-*` are two different things

`services/application/use-cases/` holds both:

- `create-application.use-case.ts` — maps a payload, builds the
  entity, saves it. Persistence only.
- `add-application.use-case.ts` — resolves the position (creating
  it and redistributing allocations when missing), prices the
  quotas from the quota table, then delegates to
  `create-application.use-case.ts`.

`services/withdrawal/use-cases/` mirrors the same split.

The names read as synonyms and are not. The suite keeps one test
file per use case, and the `add-*` tests pass faked repositories
for the collaborators it composes rather than reaching into the
`create-*` path.

**Status** — documented, naming left alone.

---

## 6. Eight calculator files share a name across two aggregates

`domain/portfolio/calculators` and `domain/position/calculators`
both contain:

| File | Portfolio export | Position export |
| --- | --- | --- |
| `application-sum.calculator.ts` | `calculatePortfolioApplicationSum` | `calculateApplicationSum` |
| `application-quotas-sum.calculator.ts` | `calculatePortfolioApplicationQuotasSum` | `calculateApplicationQuotasSum` |
| `cash-flow-net.calculator.ts` | `calculatePortfolioCashFlowNet` | `calculateCashFlowNet` |
| `daily-factor.calculator.ts` | `calculatePortfolioDailyFactor` | `calculateDailyFactor` |
| `earnings.calculator.ts` | `calculatePortfolioEarnings` | `calculateEarnings` |
| `return.calculator.ts` | `calculatePortfolioReturn` | `calculateReturn` |
| `withdrawal-sum.calculator.ts` | `calculatePortfolioWithdrawalSum` | `calculateWithdrawalSum` |
| `withdrawal-quotas-sum.calculator.ts` | `calculatePortfolioWithdrawalQuotasSum` | `calculateWithdrawalQuotasSum` |

The file names collide while the exports are asymmetric: the
portfolio side is always prefixed, the position side is not except
for `calculatePositionAllocation` and `calculatePositionWeight`.

**Status** — documented. The duplication is real but the exported
names are unambiguous, so an import collision is not reachable.
Renaming would be a production change.

---

## 7. `ICvmClient` lives in the domain, the implementation in `clients/`

The port is `domain/quota/interfaces/cvm-client.interface.ts`; the
only implementation is `clients/cvm.client.ts`, which is outside
`domain/`, `services/` and `infrastructure/`.

The client reaches the network (`https://dados.cvm.gov.br`), so it
is the one seam the suite fakes rather than exercises. The fake is
`createFakeCvmClient()` in `__tests__/__setup__/_fakes.setup.ts`.

**Status** — worked around. No test in the suite makes an outbound
request.

---

## 8. Files with no runtime behaviour

These compile to nothing under the test runtime, so a suite over
them could only assert types:

| Kind | Count | Location |
| --- | --- | --- |
| Service DTOs | 49 | `services/*/dto/*.dto.ts` |
| Domain interfaces | 24 | `domain/*/interfaces/*.interface.ts` |

TypeScript already checks these at compile time through
`tsc --noEmit`, which is stronger than a runtime assertion would
be.

**Status** — deliberately uncovered, and excluded from the mirror
rule in `scripts/check-test-structure.ts`.

---

## 9. Domain behaviour the suite now covers

These files hold real runtime logic and were previously outside the
mirror rule (`*.entity.ts` in `domain/`, `*.mapper.ts` and
`*.repository.ts` in `infrastructure/`):

| Kind | Count | Location |
| --- | --- | --- |
| Calculators | 28 | `domain/*/calculators/*.calculator.ts` |
| Domain events | 16 | `domain/*/events/*.event.ts` |

**Status** — resolved. Both kinds are now inside the gate:
`domain-event` and `domain-calculator` were added to
`MIRROR_RULES` in `scripts/check-test-structure.ts`, so a missing
suite fails `npm run structure` exactly like a missing entity suite.

The events are `create`-guarded value objects with a `create`
factory, required-field validation and an `equals` comparison, so
they are tested exactly like the entities. The calculators are pure
functions over `Decimal`, tested with hand-checked literals.

Two behaviours worth recording, both proven by the new suites:

- **Event `create` takes `id?: string`, not `EntityId`.** Every
  event class does `this._id = id ? EntityId.create(id) : undefined`.
  Passing `""` therefore leaves `id` undefined instead of raising.
- **Event `equals` compares ids only.** Since `EntityId` is a
  branded `string`, two events with the same id but different props
  are `equals`. The suites document that as the real semantics
  rather than asserting a prop-based comparison that does not exist.

---

## 10. Integration suite shape

`vitest.config.integration.ts` sets `fileParallelism: false`
because every integration file truncates the same Neon branch in
`beforeEach`. A full run is roughly fifteen minutes, dominated by
the round trips to the HTTP pooler, not by the assertions.

`beforeAll` applies every migration from `drizzle/` in folder-name
order and drops the eight schemas first, so a run always starts
from an empty database.

---

## 11. `norms_portfolios` has no surrogate id

Every other table carries an `id` column, so every seeder in
`_seeds.setup.ts` ends with `asPersisted(...)`, which throws when
the returned entity has no `id`.

`norms_portfolios` is the exception: the composite
`(norm_id, portfolio_id)` primary key **is** the identity, the
schema declares no `id` column, and the mapper has no way to set
`_id`. `NormsPortfoliosRepository.save` therefore always returns an
entity whose `id` getter is `undefined`.

`seedNormsPortfolios` is the one seeder that returns the plain
entity instead of `Persisted<NormsPortfolios>`, and the repository
suite keys every assertion on the `(normId, portfolioId)` pair. If
an `id` column is ever added to that table, the seeder should go
back to `asPersisted` like the rest.

---

## 12. Grouped counts come back in key order, not input order

`countByCategoryIds`, `countByPortfolioIds`, `countByBankIds` and
friends `GROUP BY` the foreign key and `ORDER BY` it, so the rows
come back sorted by the **uuid as a string**. Seeder ids are random
uuids, so the first seeded parent is not reliably the first row.

The affected suites assert through a `Map` keyed by the group column
rather than comparing arrays positionally:

```ts
const COUNTS = new Map(
  result.map((entry) => [entry.categoryId, entry.count])
)

expect(COUNTS.get(first.id)).toBe(2)
```

`position.repository.test.ts` was fixed first; the same change was
applied to `fund` and `bank-account`.

---

## 13. Service flows get a second, database-backed suite

A use-case unit suite fakes every repository, so it cannot prove a
flow that spans more than one aggregate: the joins, the ordering the
use case depends on, and the optimistic-locking write are all faked
away. Four flows are therefore covered twice, once with fakes and
once against the real database:

| Flow | Aggregates touched |
| --- | --- |
| `services/application/use-cases/add-application.use-case` | portfolio, fund, quota, position, application |
| `services/withdrawal/use-cases/add-withdrawal.use-case` | portfolio, fund, quota, position, withdrawal |
| `services/portfolio-performance/use-cases/calculate-portfolio-performance.use-case` | portfolio, position, fund, quota, application, withdrawal, performance, norm |
| `services/quota/use-cases/import-fund-valuations.use-case` | fund, quota, cvm client |

These are the only suites that legitimately have no production file
pointing at them from the mirror rules, because the unit rule maps
each of them to a `__unit__` path. `INTEGRATION_FLOWS` in
`scripts/check-test-structure.ts` lists them explicitly so the
stray-suite check accepts the second path instead of ignoring the
whole folder.
