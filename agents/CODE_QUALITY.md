# Code Quality Standards

Guide for writing consistent, high-quality code in this repository.
Applies to every `.ts` / `.tsx` / `.mts` file, including tests and configs.

Companion documents:

- Documentation: `agents/DOCUMENTATION_STANDARDS.md`
- Equations reference: `agents/TRD.md`

Reference implementations:

- Value object: `business/value-objects/quota-price.vo.ts`
- Calculator: `business/calculators/application/application-quotas.calculator.ts`
- Test: `__tests__/__unit__/calculators/application/application-quotas.calculator.test.ts`

---

## 1. Tooling and Verification

Biome is the single source of truth for formatting and linting.
Never hand-format code and never fight the formatter.

| Command             | Purpose                          |
| ------------------- | -------------------------------- |
| `npm run lint`      | Lint + format check (`biome check`) |
| `npm run format`    | Auto-format                      |
| `npm run test`      | Run Vitest                       |
| `npx tsc --noEmit`  | Type-check                       |

Formatter settings already fixed by `biome.json`: 2-space indent,
80-character lines, LF endings, double quotes, semicolons always,
trailing commas everywhere, parentheses around arrow parameters.

Before considering any task done:

1. `npm run lint` passes.
2. `npx tsc --noEmit` passes.
3. `npm run test` passes.

---

## 2. Naming Conventions

| Element                     | Convention            | Example                        |
| --------------------------- | --------------------- | ------------------------------ |
| `const` (all declarations)  | SCREAMING_UPPERCASE   | `TOTAL_APPLICATIONS`           |
| Functions                   | camelCase             | `calculateWithdrawalSum`       |
| Classes / value objects     | PascalCase            | `PositiveMoney`                |
| Interfaces / type aliases   | PascalCase            | `QuotaPriceProps`              |
| Files                       | kebab-case + suffix   | `quota-price.vo.ts`            |
| Folders (domains)           | kebab-case            | `value-objects`, `position`    |

### 2.1 The `const` Rule (mandatory)

Every `const` declaration is written in SCREAMING_UPPERCASE
(UPPER_SNAKE_CASE), without exception of scope or context:

- Module-level, function-level, and block-level scopes.
- Business logic, tests, React components, configs, scripts.
- Destructured declarations that introduce a new binding.

```ts
// GOOD
const RESULT = calculateApplicationQuotas({ application, quota });
const TOTAL_MONEY = applications.reduce((sum, item) => sum.plus(item), ZERO);
const IS_NEGATIVE = amount.lessThan(0);

// BAD
const result = calculateApplicationQuotas({ application, quota });
const totalMoney = ...
const TotalMoney = ...
```

Rules:

1. Separate words with underscores: `INITIAL_POSITION`, not `InitialPosition`.
2. Single words are fine as-is: `RESULT`, `SUM`, `QUOTA`.
3. Boolean consts read naturally with an auxiliary verb prefix:
   `IS_VALID`, `HAS_EARNINGS`, `CAN_WITHDRAW`.
4. Loop accumulators and temporary values are still consts and still
   uppercase: `SUM`, `ACCUMULATOR`.

Exceptions (the only allowed lowercase consts):

- Bindings mandated verbatim by a framework. Example: Next.js requires
  `export const metadata` in layouts/pages; renaming it silently breaks
  the framework. Keep framework-required names exactly as documented.
- Imported bindings (`import Decimal from "decimal.js"`). They are not
  `const` declarations; never rename them to fit this rule.

Everything else: if it is declared with `const`, its name is
SCREAMING_UPPERCASE.

### 2.2 Identifiers

- Calculator functions start with `calculate` followed by the operation:
  `calculateApplicationQuotas`.
- Props interfaces end in `Props` and are not exported:
  `PositiveMoneyProps`, `CalculateWithdrawalSumProps`.
- Boolean-returning methods start with a verb (`equals`, `isValid`).

---

## 3. Project Structure

```
business/
  value-objects/          # <concept>.vo.ts        (default export)
  calculators/<domain>/   # <operation>.calculator.ts (named export)
app/                      # Next.js routing and UI shell only
__tests__/__unit__/       # Mirrors business/ paths exactly
agents/                   # Guides: this file, DOCUMENTATION_STANDARDS, TRD
```

Rules:

1. Business logic lives only in `business/`. The `app/` folder contains
   routing, layout, and presentation - never calculations or invariants.
2. File suffix encodes the role: `.vo.ts` for value objects,
   `.calculator.ts` for calculators.
3. A test file mirrors its source path:
   `business/calculators/application/application-quotas.calculator.ts` ->
   `__tests__/__unit__/calculators/application/application-quotas.calculator.test.ts`.
4. Cross-folder imports always use the `@/*` alias:
   `import QuotaPrice from "@/business/value-objects/quota-price.vo";`
5. Group domain concepts into subfolders when they grow
   (`calculators/position`, `calculators/application`).

---

## 4. Domain Modeling Rules

### 4.1 Monetary and quota math

- Never perform arithmetic on monetary or quota amounts with native
  numbers/operators (`+`, `-`, `*`, `/`). Floating point loses precision.
- All arithmetic goes through `decimal.js`, hidden behind value objects
  and calculators.
- Precision is normalized at creation time inside the value object
  (money: 2 decimal places; prices and quantities: 6 decimal places).
- When constructing decimals from literals in tests/examples, prefer
  strings (`'225825.442804'`) over floats to avoid precision drift.

### 4.2 Value objects

- Private constructor; the only entry point is the static factory
  `create()`, which validates every invariant and normalizes precision.
- Immutable after creation; expose values through getters only.
- Provide an `equals()` that compares values, never references.
- Thrown errors mirror the documented invariants and name the class in
  backticks: `` "`QuotaPrice` must be equal or greater than 0." ``

### 4.3 Calculators

- Pure, named-export functions: same inputs -> same output, no side
  effects, no I/O, no mutation of inputs.
- Take value objects in, return a value object out.
- Accept a single destructured props object parameter.
- Declare an explicit return type.
- Each calculator documents its formula with `@equation`, matching
  `agents/TRD.md` (see DOCUMENTATION_STANDARDS.md).

```ts
export function calculateWithdrawalQuotas({
  withdrawal,
  quota,
}: CalculateWithdrawalQuotasProps): QuotaQuantity {
  const QUOTAS = withdrawal.value.dividedBy(quota.value);

  return QuotaQuantity.create(QUOTAS);
}
```

---

## 5. General Good Practices

1. Strict TypeScript. Do not use `any`; reach for `unknown` plus
   narrowing instead. Do not disable lint/type rules inline without a
   justification comment.
2. Prefer immutability: `readonly` properties, `private readonly` fields,
   no public mutable state.
3. Small, single-purpose functions. If a function needs more than three
   primitive parameters, introduce a props interface.
4. No dead weight: no commented-out code, no `console.log`/`debugger`,
   no unused exports or imports. Biome's organize-imports keeps import
   order; let it.
5. Errors are thrown with `Error` and messages that state the violated
   invariant in backticks, matching the `@throws` documentation.
6. Comments explain why, never what. JSDoc follows
   `agents/DOCUMENTATION_STANDARDS.md`. Long classes and configs use
   section dividers:

   ```ts
   // --------------------------------------
   // SECTION NAME
   // --------------------------------------
   ```

7. Do not commit secrets, keys, or environment-specific configuration.

---

## 6. Testing Standards

- Framework: Vitest. Unit tests live under `__tests__/__unit__/`,
  integration tests under `__tests__/__integration__/`.
- Structure: one `describe()` per function, named after it;
  each `it()` is a behavior sentence describing an outcome, e.g.
  `"rounds the result to 6 decimal places"`, `"returns zero when the
  withdrawal list is empty"`.
- One behavior per test; arrange-act-assert with blank lines between
  phases.
- Local test constants follow the `const` rule: `RESULT`, `APPLICATION`,
  `WITHDRAWAL`, `QUOTA`.
- Expected values compare value objects built through factories
  (`toEqual(QuotaQuantity.create("25"))`), not raw numbers or snapshots.
- Every calculator test suite includes:
  1. The proven worked example from `agents/TRD.md` (Carteira LP A
     values such as `'1000000'` / `'4.428199'` -> `'225825.442804'`).
  2. Rounding and precision edge cases (exact quotient, tiny quotient).
  3. Collection boundaries for aggregations (empty, single element).
  4. An imutabilidade test: `"does not mutate its inputs"`.

---

## 7. Review Checklist

- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run test` all pass.
- [ ] Every `const` is SCREAMING_UPPERCASE (only framework-mandated
      exports excepted).
- [ ] No native arithmetic on money/quota values; everything flows
      through value objects and calculators.
- [ ] Calculators remain pure; inputs are never mutated.
- [ ] New invariants are validated in `create()`, thrown with
      backticked-class error messages, and documented per
      `DOCUMENTATION_STANDARDS.md`.
- [ ] New formulas exist in `agents/TRD.md` and are referenced via
      `@equation`.
- [ ] Tests cover the TRD worked example, precision edges, collection
      boundaries, and input immutability.
- [ ] No debug leftovers, dead code, or unused imports.
