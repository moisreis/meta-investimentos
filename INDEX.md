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

There is no barrel. A file exports what it declares and
nothing else, so `export { X } from "./y"` never appears:
a barrel hides where a symbol lives, and a rename then has
to be chased through every hop. Import the file that declares
a symbol, so the caller names the owner.

A `types/` file exports declarations only, never behaviour. A
`types/` file that builds options is a helper with the wrong
suffix, and the folder a reader checks first is then the one
that misleads them. A constant is allowed, because an empty
collection or a frozen table is part of the shape rather than
a derivation from other shapes.

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

`npm run structure` runs both checkers and fails the build on
a violation. `npm run verify` runs the typecheck, the
structure check and the format check together.

## Page composition

A file in `routes/**/pages/` hosts a screen, so it lists
only the parts, route components and primitives the screen
is made of, plus the hook that feeds them. It renders no
intrinsic HTML element and sets no `className`: the markup
and the Tailwind classes behind a block belong to the part
or route component that owns them.

When a page needs a block no part owns, the block becomes a
route component under that route's `components/`; when two
routes need it, it becomes a part under `presentation/parts/`.
The page then composes it and never restates it.

`npm run structure` enforces this with the `page-composition`
rule.

## Parts shelves

Everything under `presentation/parts/` is a part, and a part
names the shelf it sits on before anything else:

- `entity-` - the reusable entity kit (table, dialog, form,
  filter, input)
- `shared-` - a generic building block two routes share
- `main-` - the chrome of the main application shell

A hook keeps the `use-` prefix it must carry and then names
its shelf, as in `use-entity-form.hook.ts` and
`use-main-mobile.hook.ts`. The file name and the folder then
tell the same story, and a reader never has to open the file
to learn what it is.

`npm run structure` enforces this with the
`parts-shelf-prefix` rule.

## Presentation root

The root of `presentation/` holds only these concerns:
`composition/`, `constants/`, `mappers/`, `masks/`, `parts/`,
`presenters/`, `routes/`, `theme/`, `types/` and `ui/`. A
stray `components/` or `hooks/` folder here is shared chrome
that never became a part, or a route that never became a
route, and it belongs one level down.

`npm run structure` enforces this with the
`presentation-root` rule.

## Markup location

Markup belongs to a view, so a `.tsx` file may only live
where a view is built:

- a primitive under `ui/`, or shell behaviour under `theme/`;
- anywhere under `parts/`;
- a route `components/`, `datatable/`, `dialogs/`, `forms/`
  or `pages/`, and a group `layout/`.

A `.tsx` anywhere else is markup that escaped the screen it
belongs to, so it moves back into the view that owns it.

`npm run structure` enforces this with the `view-only-tsx`
rule.

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
  `presentation/presenters/action-result.presenter.ts`, so
  callers narrow on `success` instead of guessing from a
  nullable error. Use cases that return nothing yield
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

## Composition files

Every `.tsx` under `presentation/routes/` is composition. It
lists what a screen is made of and passes values down; it does
not compute, mark up or fetch. Concretely, a composition file
holds no:

- intrinsic HTML tag — a `<div>`, `<span>` or `<main>` in a
  route file is a layout need that never became a primitive
- `className`, inline style, or Tailwind class
- hard-coded user-facing string, including a `href`
- `useState`, `useEffect`, `useMemo`, `useCallback`, or any
  other hook but the one that feeds the screen
- inline `Zod` schema, or an inline type that is not the
  file's own props contract

It may import `parts/**`, `ui/**`, its own hooks, helpers,
labels and types; call one hook at the top; pass props,
children and slots; and branch with `cond ? <A/> : <B/>`.

An inline arrow passed as a prop is passing a value, so
`onChange={(next) => set(next || FALLBACK)}` is allowed. An
inline arrow that _returns markup_ is a component that never
became a named one, and it does not belong here.

Two consequences follow, and both have been applied across the
tree. A derivation moves into a hook
(`use-quota-import-window.hook.ts`,
`use-withdrawal-position-scope.hook.ts`) rather than staying
in the body of a dialog. A repeated block becomes a named
primitive (`EntityCombobox`, `EntityStatusMarker`,
`EntityJobProgressSummary`, `SharedAuthCard`) rather than
being written out per route.

## Route module folders

A route module may hold these folders and no others:

`actions/`, `components/`, `datatable/`, `dialogs/`,
`forms/`, `helpers/`, `hooks/`, `jobs/`, `pages/`,
`settings/`, `types/`, `validations/`, and `layout/` for a
module that wraps its screens in a frame.

A variant may omit a folder. It may never invent one or
rename one. Every omission is a decision, so it is written
down in `MODULES.md`, which carries the full inventory and
the reason for each omission. The short version:

| Module              | Omits                                                                    | Why                                                                             |
| ------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `audit-log`         | `actions/`, `components/`, `dialogs/`, `forms/`, `jobs/`, `validations/` | read-only registry: nothing deletes or edits an entry                           |
| `(auth)`            | `actions/`, `datatable/`, `dialogs/`, `helpers/`, `jobs/`, `types/`      | a route group, not an entity; it authenticates on the client                    |
| `position`          | `forms/`                                                                 | a position is opened from the portfolio screen, not created from its own dialog |
| `user`              | `types/`                                                                 | every shape it needs is shared, so it owns none                                 |
| every entity module | `layout/`                                                                | only a group owns chrome, so only `(auth)` has a `layout/`                      |

## Route variants

`(auth)` is a variant, not a special case of the template. It
has no list, so it has no `datatable/`; it has no
infrastructure wiring, so it has no container in
`presentation/composition/`; and it is the one module whose
chrome is shared chrome rather than route-owned chrome.

Its layout frame lives in `presentation/parts/auth/`. The
reason is the layering rule, not taste: a part may not import
a route's settings, so a part that rendered the copy itself
would either invert the dependency or take the wording as
props. Taking it as props is what `SharedAuthSecondaryLink`
and `SharedAuthCopyright` do, and the route decides both the
wording and, for the link, which way it points.

`audit-log`, and by the same reasoning `quota` and the two
`*‑performance` modules, are read-only: they start and poll
work but never write a row the user owns. They therefore carry
no row-actions hook, and no `validations/` when they own no
action at all. The checker derives this rather than listing an
exemption — it looks for a `delete-` action before it asks for
`use-<entity>-row-actions.hook.ts`.

## Enforcement

Two scripts, both run by `npm run verify`:

| Script                                    | Owns                                                                                                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/check-structure.ts`              | folder shape: the canonical route folders, the `parts/` shelves, the view folders, page composition, cross-route imports, line length                |
| `scripts/check-presentation-structure.ts` | file shape: the mandatory suffix, no barrel, no inner-layer import, route composition, entity prefixes, action verbs, folder contracts, no dead file |

`check-presentation-structure.ts` reads the AST rather than the
text, so a regex over TypeScript generics cannot produce a
false alarm. A route `.tsx` is checked for intrinsic tags,
`className`/`style`, hard-coded copy, hook calls, markup in an
expression, and inline types other than the file's own
`*Props` and `*ColumnOptions`.

`npm run lint` runs inside `verify` and fails on any error. It
allows up to 24 warnings, all of which are logged defects
rather than tolerated noise: 19 dead type imports in
`infrastructure/` and `services/`, one `exhaustive-deps` in
`parts/hooks/use-entity-rows.hook.ts`, and 5 **React
Compiler** findings in 4 files. Those 5 are downgraded to
`warn` by the `KNOWN_COMPILER_DEFECTS` list in
`eslint.config.mjs`, not silenced: they need a behaviour
change, and the rules stay `error` everywhere else, so the
next occurrence anywhere new turns the gate red again. Repair
a file, drop its line from that list, and the rule reverts.

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
