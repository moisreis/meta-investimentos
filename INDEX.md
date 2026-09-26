# Naming & Structure Glossary

Naming and structure conventions for this codebase.
The rules below apply to every file, except the
shadcn components under `presentation/ui/`.

## File names

Files use kebab-case names that follow the directory
responsibility, with a singular suffix.

- `parts/hooks/` -> `*.hook.ts` (stateful hooks)
- `routes/**/hooks/` -> `*.hook.ts` (route hooks)
- `composition/` -> `*.container.ts` (use case wiring)
- `types/` -> `*.types.ts` (shared type contracts)
- `constants/` -> `*.constants.ts` (literal values)
- `presenters/` -> `*.presenter.ts` (display logic)
- `masks/` -> `*.mask.ts` (input masking)
- `validators/` -> `*.validator.ts` (validators)
- `validations/` -> `*.validation.ts` (Zod schemas)
- `settings/` -> `*.settings.ts` (user-facing copy)
- `theme/` -> `*.tsx` (theme behavior)

New suffixes must be documented here before use.

## Composition layer

`presentation/composition/*.container.ts` is the only
place allowed to import `@/infrastructure/*`, `@domain/`
or the database client. Actions, loaders and pages ask a
container for the use case they need, so the delivery
layer never reaches into the infrastructure layer and the
wiring lives in a single spot.

Each container exposes `<Name>UseCases` plus a
`<Name>Container()` factory keyed by short verbs
(`create`, `update`, `remove`, `bulkDelete`, `list`).
Leave a use case out when nothing consumes it.

## Server actions

Every `*.action.ts`:

- takes `input: unknown` and validates it with
  `SCHEMA.safeParse`, never `parse`;
- resolves the acting user through `RequireSessionUser()`
  before touching the input, and takes the user id from
  the session, never from the payload;
- calls exactly one use case from a container;
- returns `ActionResult<T>` from
  `presentation/types/action-result.ts`, so callers
  narrow on `success` instead of guessing from a nullable
  error. Use cases that return nothing yield
  `ActionResult<undefined>`.

Action schemas live in
`routes/<route>/validations/<route>-actions.validation.ts`
and reuse the route form schema, so the client check and
the server check cannot drift apart.

## Infrastructure suffixes

- `infrastructure/<domain>/repositories/`
  -> `*.repository.ts` (Drizzle persistence classes)
- `infrastructure/<domain>/mappers/`
  -> `*.mapper.ts` (row/entity mapping functions)

## Symbols

- Functions use `PascalCase`.
- Custom hooks use `use` + `PascalCase`.
- Data consts use `SCREAMING_SNAKE_CASE`.
- Function-valued consts (callbacks, setters, hook
  returns) use camelCase: SCREAMING is reserved for
  data, never for functions.
- Hook return object properties keep camelCase names,
  since they form the public API of the hook.
- Class names use `PascalCase`; class methods keep
  camelCase because they implement the domain
  interface contract (`implements IX`).

## Line length

- Code and documentation lines stay within 65 chars.
- JSX elements may exceed the limit.
- Deep-path imports with a single specifier cannot be
  wrapped, so they may exceed the limit.
- Class declarations and string literals (template
  messages, tagged templates) are single tokens and
  may exceed the limit.
- `npm run format` already enforces the width; run it
  on the changed files before committing.

## Shared primitives

Cross-cutting helpers live in `lib/`, one folder per
concern, and every consumer imports them instead of
keeping a private copy:

- `lib/auth/` -> `RequireSessionUser()` (session gate)
- `lib/money/` -> `MONEY_SCHEMA`, `POSITIVE_MONEY_SCHEMA`,
  `IsValidMoney`, `NormalizeMoney`, `SumMoney`,
  `SumQuotas`
- `lib/validation/` -> `ID_SCHEMA`, `OPTIONAL_TEXT_SCHEMA`,
  `DATE_SCHEMA`, `MONTH_SCHEMA`

Money is held as an integer count of minor units and
formatted in exactly one place, so no UI module does its
own float arithmetic on a monetary total.
