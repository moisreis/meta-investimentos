# Use Cases

Use cases are the application layer that orchestrates the domain for a
single business action. They live under `business/use-cases/<aggregate>/`
and are the only business-layer entry points consumed by the delivery
layer (`app/`).

## Conventions

### Files

- Each file is kebab-case and suffixed `.uc.ts` (for example
  `create-portfolio.uc.ts`).
- Each aggregate directory also holds DTO/mapper modules and, when
  shared, helpers:
  - `<aggregate>.dtos.ts` — the public return types.
  - `<aggregate>.mapper.ts` — maps entities to DTOs.
  - Shared helpers live in `shared/` (for example
    `shared/portfolio-access.ts`).

### Responsibilities

A use case must:

- Receive typed input plus the authenticated `actorId` for mutating
  operations.
- Run every read and write of a mutation inside a single
  `unitOfWork.run(...)` transaction, using only the `tx`-scoped
  repositories from the passed context.
- Enforce authorization **before** exposing or changing data. Portfolio
  work uses `resolvePortfolioAccess` + `canMutatePortfolio`.
- Reuse domain entities and the existing calculators in
  `business/calculators` — never duplicate formula logic.
- Throw only typed errors: `ValidationError`, `NotFoundError`,
  `ConcurrencyError`.
- Pass `actorId` to `unitOfWork.run(..., { userId })` so every mutation
  is audited atomically.
- Return DTOs, never database rows.
- Reads may stay separate from writes (a single read needs no
  transaction).

Non-facts this layer never touches: HTTP/Next.js code, Zod schema
parsing, direct `drizzle` access, or UI.

## Structure

```
business/use-cases/
├── user/            current actor, profile CRUD, portfolio access
├── portfolio/       portfolio CRUD, allocation & rate updates, reads
├── position/        position CRUD, market-value calculation
├── application/     applications, reversal, listing
├── withdrawal/      withdrawals, FIFO allocation, reversal, undo
├── fund/            funds, categories, quotas
├── benchmark/       benchmarks and history
├── norm/            norms and portfolio targets
├── bank/            banks, bank accounts, checking accounts
├── performance/     position/portfolio performance
├── statement/       statements and exports
└── shared/          shared helpers (portfolio access, allocation)
```

## Example

The vertical slice **portfolio → position → application → withdrawal**
is the reference implementation. The portfolio access helper shows the
authorization pattern every private mutation follows.

```ts
// business/use-cases/shared/portfolio-access.ts
export async function resolvePortfolioAccess(
  repos,
  portfolioId,
  actorId,
): Promise<{ portfolio: Portfolio; role: PortfolioAccessRole }> {
  const portfolio = await repos.portfolios.findById(portfolioId);
  if (portfolio === null) {
    throw new NotFoundError(`Portfolio with id ${portfolioId} was not found.`);
  }
  if (portfolio.userId === actorId) {
    return { portfolio, role: "OWNER" };
  }
  const permission =
    await repos.portfolioPermissions.findByUserIdAndPortfolioId(
      actorId,
      portfolioId,
    );
  if (permission !== null) {
    return { portfolio, role: permission.role };
  }
  throw new NotFoundError(`Portfolio with id ${portfolioId} was not found.`);
}

export function canMutatePortfolio(role) {
  return role === "OWNER" || role === "EDITOR";
}
```

A mutating use case applies that pattern inside one unit of work:

```ts
// business/use-cases/application/create-application.uc.ts (abridged)
export async function createApplication(unitOfWork, input) {
  return unitOfWork.run(
    async (tx) => {
      const position = await tx.positions.findById(
        EntityId.create(input.positionId),
      );
      if (position === null) {
        throw new NotFoundError(`Position ${input.positionId} was not found.`);
      }
      const { role } = await resolvePortfolioAccess(
        tx,
        position.portfolioId,
        EntityId.create(input.actorId),
      );
      if (!canMutatePortfolio(role)) {
        throw new NotFoundError(
          `Portfolio ${position.portfolioId} was not found.`,
        );
      }
      const quota = await tx.quotas.findByFundIdAndDate(
        position.fundId,
        input.date,
      );
      if (quota === null) {
        throw new ValidationError(`No quota price on ${input.date.toISOString()}.`);
      }
      const quotas = calculateApplicationQuotas({
        application: PositiveMoney.create(input.amount),
        quota: quota.price,
      });
      const saved = await tx.applications.save(
        Application.create({
          positionId: position.portfolioId,
          date: input.date,
          amount: PositiveMoney.create(input.amount),
          quotas,
        }),
      );
      return toApplicationDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
```

## Testing

Use-case tests live in `__tests__/__unit__/use-cases/` and run under the
vitest **USE CASES** project (`node` environment). They exercise the use
case against an in-memory `FakeUnitOfWork`
(`__tests__/__helpers__/use-cases/_unit-of-work.test.helper.ts`) that
seeds repositories, records the audit actor, and rolls back every store
when the worker throws.

Every test file covers: success, authorization failure, validation
failure, not-found, rollback, audit attribution, and financial
invariants where applicable.
