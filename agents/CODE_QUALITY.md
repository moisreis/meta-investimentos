# Code Quality Standards

This document tells you how to write consistent, high-quality code in
this repository. This standard applies to every `.ts`, `.tsx`, and
`.mts` file, including tests and configuration files.

Companion documents:

- Documentation: `agents/DOCUMENTATION_STANDARDS.md`

Reference files:

- Value object: `business/value-objects/quota-price.vo.ts`
- Calculator: `business/calculators/application/application-quotas.calculator.ts`
- Test: `__tests__/__unit__/calculators/application/application-quotas.calculator.test.ts`

---

## Tooling and verification

Biome is the single source of truth for formatting and linting. Do not
hand-format code. Do not fight the formatter.

| Command             | Purpose                             |
| -------------------- | ------------------------------------ |
| `npm run lint`      | Lint check and format check (`biome check`) |
| `npm run format`    | Auto-format the code                |
| `npm run test`      | Run the Vitest test suite           |
| `npx tsc --noEmit`  | Check types without emitting output |

`biome.json` fixes these formatter settings: 2-space indent, 80-character
lines, LF line endings, double quotes, semicolons on every statement,
trailing commas everywhere, and parentheses around arrow function
parameters.

Run these three checks before you mark any task as done.

1. Run `npm run lint`. Confirm it passes.
2. Run `npx tsc --noEmit`. Confirm it passes.
3. Run `npm run test`. Confirm it passes.

Do not merge a change when any of these three checks fail.

---

## Naming conventions

| Element                    | Convention           | Example                  |
| --------------------------- | --------------------- | ------------------------- |
| `const` (all declarations) | SCREAMING_UPPERCASE  | `TOTAL_APPLICATIONS`     |
| Functions                  | camelCase            | `calculateWithdrawalSum` |
| Classes and value objects  | PascalCase           | `PositiveMoney`          |
| Interfaces and type aliases| PascalCase           | `QuotaPriceProps`        |
| Files                      | kebab-case with suffix | `quota-price.vo.ts`    |
| Folders (domains)          | kebab-case           | `value-objects`, `position` |

### The `const` rule

Write every `const` declaration in SCREAMING_UPPERCASE (UPPER_SNAKE_CASE).
Apply this rule in every scope and every context, with no exceptions
based on scope.

Apply this rule in:

- Module-level, function-level, and block-level scopes.
- Business logic, tests, React components, configuration files, and
  scripts.
- Destructured declarations that introduce a new binding.

```ts
// Correct
const RESULT = calculateApplicationQuotas({ application, quota });
const TOTAL_MONEY = applications.reduce((sum, item) => sum.plus(item), ZERO);
const IS_NEGATIVE = amount.lessThan(0);

// Incorrect
const result = calculateApplicationQuotas({ application, quota });
const totalMoney = ...
const TotalMoney = ...
```

Follow these four rules.

1. Separate words with underscores. Write `INITIAL_POSITION`. Do not
   write `InitialPosition`.
2. Write single-word names as-is: `RESULT`, `SUM`, `QUOTA`.
3. Prefix boolean consts with an auxiliary verb, so the name reads as a
   statement: `IS_VALID`, `HAS_EARNINGS`, `CAN_WITHDRAW`.
4. Write loop accumulators and temporary values in uppercase too, the
   same as any other const: `SUM`, `ACCUMULATOR`.

Two exceptions allow a lowercase const name.

- A binding that a framework requires verbatim. Example: Next.js
  requires `export const metadata` in layouts and pages. Renaming this
  binding silently breaks the framework. Keep each framework-required
  name exactly as the framework documents it.
- An imported binding, such as `import Decimal from "decimal.js"`. An
  import is not a `const` declaration. Never rename an import to fit
  this rule.

Apply the SCREAMING_UPPERCASE rule to every other `const` declaration in
the codebase.

### Identifiers

- Start each calculator function name with `calculate`, followed by the
  operation name: `calculateApplicationQuotas`.
- End each props interface name with `Props`. Do not export a props
  interface: `PositiveMoneyProps`, `CalculateWithdrawalSumProps`.
- Start each boolean-returning method name with a verb: `equals`,
  `isValid`.

---

## Project structure

```
business/
  value-objects/          <concept>.vo.ts        (default export)
  calculators/<domain>/   <operation>.calculator.ts (named export)
app/                      Next.js routing and UI shell only
__tests__/__unit__/       Mirrors business/ paths exactly
agents/                   Guides: this file, DOCUMENTATION_STANDARDS, TRD
```

Follow these five rules.

1. Place business logic only in `business/`. Use the `app/` folder only
   for routing, layout, and presentation. Do not place calculations or
   invariants in `app/`.
2. Encode each file's role in its suffix. Use `.vo.ts` for value
   objects. Use `.calculator.ts` for calculators.
3. Mirror each source file's path in its test file. For example,
   `business/calculators/application/application-quotas.calculator.ts`
   maps to
   `__tests__/__unit__/calculators/application/application-quotas.calculator.test.ts`.
4. Use the `@/*` alias for every cross-folder import:
   `import QuotaPrice from "@/business/value-objects/quota-price.vo";`.
5. Group related domain concepts into subfolders as they grow, such as
   `calculators/position` and `calculators/application`.

---

## Domain modeling rules

### Monetary and quota math

- Never perform arithmetic on monetary or quota amounts with native
  operators (`+`, `-`, `*`, `/`). Floating-point arithmetic loses
  precision.
- Route all arithmetic through `decimal.js`, hidden behind value
  objects and calculators.
- Normalize precision at creation time, inside the value object. Store
  money with 2 decimal places. Store prices and quantities with 6
  decimal places.
- Construct decimals from string literals in tests and examples, such
  as `'225825.442804'`. Do not construct decimals from float literals.
  A float literal can introduce precision drift.

### Value objects

- Give each value object a private constructor. Make the static factory
  method `create()` the only entry point. Validate every invariant and
  normalize precision inside `create()`.
- Make each value object immutable after creation. Expose its values
  through getters only.
- Give each value object an `equals()` method that compares values, not
  references.
- Write each thrown error message to match its documented invariant.
  Name the class in backticks inside the message: `` "`QuotaPrice`
  must be equal or greater than 0." ``

### Calculators

- Write each calculator as a pure, named-export function. The same
  inputs must always produce the same output. A calculator must have no
  side effects, no I/O, and must not mutate its inputs.
- Pass value objects into each calculator. Return a value object out.
- Accept a single destructured props object as the parameter.
- Declare an explicit return type on every calculator.
- Document each calculator's formula with an `@equation` tag that
  matches `agents/TRD.md`. See `agents/DOCUMENTATION_STANDARDS.md` for
  the full documentation rule.

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

## Error handling

- Throw an `Error` for every invariant violation. Do not return `null`,
  `undefined`, or a magic value to signal a validation failure.
- Write each error message to name the violated invariant and the class
  in backticks, matching the corresponding `@throws` documentation
  entry.
- Do not catch an error only to log it and continue silently. Handle
  the error, or let it propagate to a layer that can handle it.
- Do not throw a generic error message such as `"Invalid input"`. State
  which value failed and why.
- Distinguish a domain error, such as an invalid `Money` value, from an
  infrastructure error, such as a failed database call. Do not let an
  infrastructure error leak into domain code as an unhandled exception
  type.

---

## Security and secrets

- Do not commit a secret, an API key, or an environment-specific
  configuration value to the repository. Store each secret in an
  environment variable or in the platform's secret manager.
- Do not print a monetary value, an account identifier, or another
  piece of sensitive data to the console or to a log at a level above
  what the audit policy allows.
- Validate and sanitize every input at a system boundary, such as an
  API route or a form handler. Do not trust a value from outside the
  codebase without validation.
- Do not use `eval`, `Function` constructors, or another form of
  dynamic code execution on data that comes from outside the codebase.
- Pin each third-party dependency to an exact version. Review a
  dependency's changelog before you upgrade it in a file that handles
  monetary calculations.

---

## General good practices

1. Write strict TypeScript. Do not use `any`. Use `unknown` together
   with type narrowing instead. Do not disable a lint rule or a type
   rule inline without a comment that states the reason.
2. Prefer immutability. Use `readonly` properties and `private
   readonly` fields. Do not expose mutable public state.
3. Write small, single-purpose functions. When a function needs more
   than three primitive parameters, introduce a props interface
   instead.
4. Remove dead weight. Do not commit commented-out code, a
   `console.log` call, or a `debugger` statement. Do not leave an
   unused export or an unused import in the codebase. Let Biome's
   import-organizing feature keep import order correct.
5. Write each comment to explain why the code does something, not what
   the code does. Follow `agents/DOCUMENTATION_STANDARDS.md` for every
   JSDoc block.
6. Do not commit a secret, a key, or an environment-specific
   configuration value.

---

## Testing standards

- Use Vitest as the test framework. Place unit tests under
  `__tests__/__unit__/`. Place integration tests under
  `__tests__/__integration__/`.
- Write one `describe()` block for each function. Name each block after
  the function it tests.
- Write each `it()` block as one sentence that states a behavior and its
  outcome, such as `"rounds the result to 6 decimal places"` or
  `"returns zero when the withdrawal list is empty"`.
- Test one behavior in each test case. Structure each test case in
  three phases: arrange, act, and assert. Separate the phases with a
  blank line.
- Name local test constants according to the `const` rule: `RESULT`,
  `APPLICATION`, `WITHDRAWAL`, `QUOTA`.
- Compare expected values as value objects built through factories,
  such as `toEqual(QuotaQuantity.create("25"))`. Do not compare against
  a raw number or a snapshot.
- Include these four cases in every calculator test suite.
  1. The proven worked example from `agents/TRD.md`. For example, the
     Carteira LP A values `'1000000'` and `'4.428199'` produce
     `'225825.442804'`.
  2. A rounding and precision edge case, such as an exact quotient and
     a tiny quotient.
  3. A collection boundary case for an aggregation, such as an empty
     collection and a single-element collection.
  4. An immutability test named `"does not mutate its inputs"`.
- Write a regression test for every defect fix. Name the test after the
  defect it prevents from recurring.

---

## Traceability and change control

A financial institution reviewer checks each change for a source, an
owner, and a history. Meet these requirements for every change to
`business/`.

- Link each calculator to its source requirement in `agents/TRD.md`
  through the `@equation` tag, as `agents/DOCUMENTATION_STANDARDS.md`
  requires.
- Write a pull request description that states the business reason for
  the change, not only the technical change.
- Require a second reviewer to approve every change to a value object
  or a calculator before merge. The second reviewer confirms that the
  tests, the documentation, and the code agree with each other.
- Do not change a documented invariant or a formula without a matching
  change to `agents/TRD.md` and sign-off from the domain owner.
- Keep a changelog entry for every change that affects a monetary
  calculation, a rounding rule, or a validation rule.

---

## Review checklist

- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run test` all pass.
- [ ] Every `const` is SCREAMING_UPPERCASE, except the two allowed
      exceptions.
- [ ] No native arithmetic operates on a money or quota value. All such
      arithmetic flows through value objects and calculators.
- [ ] Every calculator stays pure. No calculator mutates its inputs.
- [ ] Every new invariant is validated in `create()`, thrown with a
      backticked class name in its error message, and documented per
      `DOCUMENTATION_STANDARDS.md`.
- [ ] Every new formula exists in `agents/TRD.md` and is referenced
      through `@equation`.
- [ ] Tests cover the TRD worked example, the precision edge cases, the
      collection boundaries, and input immutability.
- [ ] No debug leftovers, dead code, or unused imports remain.
- [ ] No secret, key, or environment-specific value appears in the
      diff.
- [ ] Every input from outside the codebase is validated at the
      boundary.
- [ ] A second reviewer has approved the change.