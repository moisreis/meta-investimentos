# Naming & Structure Glossary

Naming and structure conventions for this codebase.
The rules below apply to every file, except the
shadcn components under `presentation/ui/`.

## File names

Files use kebab-case names that follow the directory
responsibility, with a singular suffix.

- `parts/hooks/` -> `*.hook.ts` (stateful hooks)
- `routes/**/hooks/` -> `*.hook.ts` (route hooks)
- `routes/**/actions/` -> `*.action.ts` (server actions)
- `routes/**/helpers/` -> `*.helper.ts` (loaders, builders)
- `routes/**/jobs/` -> `*-job.store.ts` (in-memory job state)
- `composition/` -> `*.container.ts` (use case wiring)
- `types/` -> `*.types.ts` (shared type contracts)
- `constants/` -> `*.constants.ts` (literal values)
- `presenters/` -> `*.presenter.ts` (display logic)
- `masks/` -> `*.mask.ts` (input masking)
- `validations/` -> `*.validation.ts` (Zod schemas)
- `settings/` -> `*.settings.ts` (user-facing copy)
- `theme/` -> `*.tsx` (theme behavior)

New suffixes must be documented here before use.

There is no `validators/` folder. A predicate such as
`IsValidCpf` is shared, so it lives in `lib/validation/`
next to the schemas that use it. A route never reaches
into another route for a validator.

## Route contract

Every folder under `presentation/routes/` is a route, and
a route owns the same folders. A route creates a folder
only when it has that concern, so a read-only route such as
`audit-log` legitimately has no `actions/`, `dialogs/`,
`forms/` or `validations/`.

- `actions/` - server actions, one per exposed use case
- `components/` - route local pieces `parts/` does not own
- `datatable/` - `filters`, `table`, `table-columns`,
  `toolbar`
- `dialogs/` - `add`, `edit`, `add-another`,
  `confirm-delete`, plus any route specific operation
- `forms/` - `add`, `edit`, plus field components
- `helpers/` - loaders and pure builders
- `hooks/` - route hooks, `use-<entity>-*.hook.ts`
- `jobs/` - in-memory state of a background job
- `pages/` - `list` and `detail`
- `settings/` - user-facing copy
- `types/` - derived row and view models
- `validations/` - `<entity>-actions.validation.ts` and
  `<entity>-form.validation.ts`

Adding a route means copying this shape, not inventing one.
Adding a concern means adding a folder to this list first.

Rules the folder name does not express:

- A file in `dialogs/` or `forms/` never repeats its route
  name. The folder already scopes the entity, so
  `routes/quota/dialogs/confirm-import.tsx` is correct and
  `quota-confirm-import.tsx` is not. Naming a field
  component after the entity it selects is still fine, as in
  `routes/checking-account/forms/bank-account-combobox.tsx`.
- A route group, a parenthesised folder, owns pages. A
  parenthesised folder without `pages/` is app chrome in
  the wrong place; `presentation/parts/layout/` holds that.
- `actions/` holds server actions and nothing else. Job
  state goes in `jobs/`.
- A route with `actions/` has `validations/`.
- Every `app/(main)/<route>/` folder has a `page.tsx`, so
  each entry in the navigation resolves to a screen.
- Exports are named, never `export default`, so a symbol
  stays greppable across the project.

Hooks are named after the entity they serve, never after
the operation, so every hook of a route starts with the same
word and the folder stays greppable: `use-bank-add-form`
and `use-bank-edit-form`, not `use-add-bank-form`. The
operation sits in the middle, and the file name always
matches the symbol it exports.

A route never imports from a sibling route. The single
exception is the one composition the domain really has:
the Portfolio aggregate is made of its applications and its
withdrawals, so `routes/portfolio/` may reach into
`routes/application/` and `routes/withdrawal/`, and the
dependency points the right way. The allowlist lives in
`CROSS_ROUTE_ALLOWLIST` in `scripts/check-structure.ts`; a
second entry needs a reason, not just a name.

Entity names are singular, except behind a verb whose
object is a collection: `bulk-delete-banks.action.ts`,
`load-banks.helper.ts` and `list-portfolio-performances`
name many on purpose, while `delete-bank.action.ts` and
`use-bank-add-form.hook.ts` name one.

Every file under `routes/` and `app/(main)/` carries a
TSDoc block with `@author`. A file that only holds labels,
types or schemas still declares an owner: the comment that
already describes the file's subject is promoted to TSDoc
and the author tag is appended to it, rather than putting
an author block on every member.

`npm run structure` enforces all of the above and fails the
build on a violation. `npm run verify` runs the typecheck,
the structure check and the format check together.

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

Code and documentation lines stay within 65 chars.
`npm run format` is the real enforcer, so `npm run
structure` only has to catch what Prettier would leave
alone, and it skips the shapes Prettier cannot wrap:

- an import, or the tail of a wrapped import: a single
  specifier stays on one line and has nowhere to break;
- JSX: an element, an attribute, or a JSX expression that
  only reads a settings constant;
- a string or template literal, alone or behind a `return`
  or a ternary arm, since copy must not be reworded to fit;
- a function signature or a typed declaration head whose
  length comes from its return type, not from its name;
- a declaration head whose identifier is itself over the
  budget. A name that does not fit is a naming review for a
  human, not something a line break can fix.

`npm run format` already enforces the width; run it
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
  `DATE_SCHEMA`, `MONTH_SCHEMA`, `IsValidCpf`,
  `IsValidCnpj`, `StripDocumentDigits`,
  `IsValidPercentage`

Money is held as an integer count of minor units and
formatted in exactly one place, so no UI module does its
own float arithmetic on a monetary total.

`lib/` never imports `presentation/`, `domain/` or
`infrastructure/`. The dependency points the other way: when
a shared primitive needs a helper that used to live in the
UI, the helper moves down into `lib/`, as `StripDocumentDigits`
did for the CPF and CNPJ masks.
