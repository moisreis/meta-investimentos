# Database Conventions

This document covers database-level conventions enforced by schema and migration practices.

## Numeric Precision

### Money / Quantity / Price columns

All monetary and quantity values use `numeric(18, 6)` via `drizzle-orm`'s `numeric("col", { precision: 18, scale: 6 })`.

Applies to:
- `fund.quota.price`
- `fund.fund.administration_fee`, `fund.fund.performance_fee`
- `portfolio.position.initial_balance`
- `portfolio.application.amount`, `portfolio.application.quotas`
- `portfolio.withdrawal.amount`, `portfolio.withdrawal.quotas`
- `portfolio.transaction_allocation.quotas_consumed`
- `performance.position_performance`: `quotas_held`, `patrimony`, `application_total`, `redemption_total`, `cash_flow_net`, `earnings`
- `performance.portfolio_performance`: `quotas_held`, `patrimony`, `application_total`, `redemption_total`, `cash_flow_net`, `earnings`
- `bank.checking_account.value`
- `benchmark.benchmark_history.rate`

**Rationale**: 18 significant digits with 6 decimal places gives ample room for both integer precision (up to 12 digits) and fractional precision, avoiding rounding surprises in financial calculations.

### Allocation / Percentage columns

Allocation and target columns use `numeric(5, 2)` via `drizzle-orm`'s `numeric("col", { precision: 5, scale: 2 })`.

Applies to:
- `portfolio.portfolio.min_allocation`, `target_allocation`, `max_allocation`, `annual_interest_rate`
- `portfolio.norm.min_allocation`, `target_allocation`, `max_allocation`
- `portfolio.norms_portfolios.min_allocation`, `target_allocation`, `max_allocation`

**Rationale**: Values are percentages (0–100) or rates, so 5 total digits with 2 decimal places is sufficient.

### Return / Spread columns

Return and spread columns use unparameterized `numeric()` (no explicit precision/scale), letting Postgres store arbitrary precision.

Applies to:
- `performance.position_performance`: `return_daily`, `return_monthly`, `return_yearly`, `return_last_12m`, `allocation`
- `performance.portfolio_performance`: `return_daily`, `return_monthly`, `return_yearly`, `return_last_12m`, `target`, `cumulative_target`, `inflation_spread`, `risk_free_spread`, `market_spread`

**Rationale**: Return and spread values are computed ratios and can vary widely. Fixed precision would risk overflow; arbitrary precision preserves full fidelity.

### Signed Money / Signed Percentage (deviation)

The following columns represent `SignedMoney` or `SignedPercentage` value objects and intentionally have **no** `≥ 0` CHECK constraint, because their domain allows negative values:

- `bank.checking_account.value` — `SignedMoney` (bank balances can be negative)
- `benchmark.benchmark_history.rate` — `SignedPercentage` (rates can be negative)
- `fund.fund.administration_fee` — `SignedPercentage` (can be negative in edge cases)
- `fund.fund.performance_fee` — `SignedPercentage` (can be negative in edge cases)

These columns use `numeric(18, 6)` precision but omit the `check("col_nonneg", sql\`...\`)` constraint.

## CHECK Constraints

### Non-negative columns

All money and quantity columns that are guaranteed non-negative by domain invariant have an explicit `≥ 0` CHECK constraint:

```ts
check("col_name_nonneg", sql`${table.colName} >= 0`)
```

Applied to:
- `fund.quota.price`
- `portfolio.position.initial_balance`
- `portfolio.application.amount`, `portfolio.application.quotas`
- `portfolio.withdrawal.amount`, `portfolio.withdrawal.quotas`
- `portfolio.transaction_allocation.quotas_consumed`

### Allocation ordering

The three allocation tables enforce `min ≤ target ≤ max` via a composite CHECK:

```ts
check(
  "table_allocation_order",
  sql`${table.minAllocation} <= ${table.targetAllocation} AND ${table.targetAllocation} <= ${table.maxAllocation}`,
)
```

Applied to:
- `portfolio.portfolio`
- `portfolio.norm`
- `portfolio.norms_portfolios`

### Composite PKs as implicit NOT NULL

Columns that form part of a composite primary key (e.g., `norms_portfolios.norm_id` and `norms_portfolios.portfolio_id`) are implicitly NOT NULL in PostgreSQL. Drizzle does not emit redundant `ALTER TABLE ... SET NOT NULL` for these, and none is needed.

## Timestamps with Timezone

All `timestamp` columns use `timestamp("col", { withTimezone: true })` to store UTC timestamps.

**Exception**: `report.statement.period_start` and `report.statement.period_end` remain `date()` (no time component) because they represent calendar periods, not instants.

**Rationale**: Storing timestamps with timezone ensures consistent behavior across database and application layers, avoiding subtle bugs when clients or servers are in different timezones.

## Foreign Keys

### On delete behavior

- `portfolio.norms_portfolios.norm_id` / `portfolio_id`: `onDelete: "cascade"` — deleting a norm or portfolio cascades to the link table.
- `user.session.user_id`: `onDelete: "cascade"` — deleting a user cascades to their sessions.
- `user.account.user_id`: `onDelete: "cascade"` — deleting a user cascades to their accounts.
- All other FK references use the default behavior (no explicit `onDelete`).

### Reversal tracking

`portfolio.application.reversed_by_user_id` and `portfolio.withdrawal.reversed_by_user_id` reference `user.id` with no cascade — a reversal audit record must remain even if the user is later deleted. See the deletion policy below.

## Deletion Policy

This repository uses **hard delete** everywhere. There is no `deleted_at`
column and no soft-delete implementation. A `DELETE` removes the row
from the database. This decision is deliberate: the product has no
requirement today that forces soft delete, and soft delete would add
lifecycle complexity that the current schema does not need.

Scope and consequences of the chosen policy:

- `portfolio`, `position`, `fund`, `category`, `bank`, and `user`
  entities are hard-deleted. No reversed flags exist on them.
- Only `portfolio.application` and `portfolio.withdrawal` carry
  reversal audit fields (`reversed_by_user_id`), independent of row
  deletion.
- A reversal audit record (`application.reversed_by_user_id`,
  `withdrawal.reversed_by_user_id`) must survive the deletion of the
  referenced `user`. The FK has no cascading delete, so a removed user
  does not remove the audit reference.
- Deleting a `user` cascades to that user's `session` and `account`
  rows (see the FK rules above). Administrators must treat user
  deletion as destructive and irreversible under this policy.

If a future requirement needs retention, review, or restore. add it as a
use case (see `agents/TRD.md`). A retention or soft-delete feature is out
of scope for this schema today. Revisit this decision before adding any
soft-delete column or filter.

The rest of the schema follows the FK `onDelete` rules listed in the
Foreign Keys section.

## Schema File Organization

Each schema file defines one table and its indexes/checks. Files are grouped by domain subdirectory under `infrastructure/database/schemas/`:

```
schemas/
  audit/       — audit_log
  bank/        — bank, bank_account, checking_account
  benchmark/   — benchmark, benchmark_history
  fund/        — category, fund, quota
  performance/ — portfolio_performance, position_performance
  portfolio/   — application, norm, norms_portfolios, portfolio, position,
                 transaction_allocation, withdrawal
  report/      — statement
  user/        — account, session, user, verification
```

## Migration Hygiene

- Migrations live in `infrastructure/database/migrations/`.
- `drizzle-kit rc.4` tracks migration history via snapshot `prevIds` chain + `__drizzle_migrations` table — not `meta/_journal.json`.
- Run `drizzle-kit check` to verify baseline is clean after generation.
- Never edit generated migration SQL manually; always regenerate from schema.
