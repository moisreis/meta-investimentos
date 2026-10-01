# Route modules

Every folder in `presentation/routes/` is one module: a slice of the
product with its own screen. This file records which concern folders each
module owns, so an omission reads as a decision instead of a gap.

The canonical set of concern folders is:

```
actions/  components/  datatable/  dialogs/  forms/  helpers/
hooks/    jobs/        layout/     pages/    settings/  types/
validations/
```

A module may omit a folder. It may never rename one or invent another. The
checker in `scripts/check-structure.ts` enforces the canonical names, and
`scripts/check-presentation-structure.ts` enforces what a folder owes once it
exists.

## Inventory

| module                  | folders | omitted                                                                      |
| ----------------------- | ------- | ---------------------------------------------------------------------------- |
| `(auth)`                | 7       | `actions`, `datatable`, `dialogs`, `helpers`, `jobs`, `types`                |
| `application`           | 11      | `jobs`, `layout`                                                             |
| `audit-log`             | 6       | `actions`, `components`, `dialogs`, `forms`, `jobs`, `layout`, `validations` |
| `bank`                  | 10      | `components`, `jobs`, `layout`                                               |
| `bank-account`          | 10      | `components`, `jobs`, `layout`                                               |
| `category`              | 10      | `components`, `jobs`, `layout`                                               |
| `checking-account`      | 10      | `components`, `jobs`, `layout`                                               |
| `fund`                  | 11      | `jobs`, `layout`                                                             |
| `portfolio`             | 11      | `jobs`, `layout`                                                             |
| `portfolio-performance` | 12      | `layout`                                                                     |
| `position`              | 10      | `forms`, `jobs`, `layout`                                                    |
| `position-performance`  | 12      | `layout`                                                                     |
| `quota`                 | 12      | `layout`                                                                     |
| `statement`             | 11      | `jobs`, `layout`                                                             |
| `user`                  | 9       | `components`, `jobs`, `layout`, `types`                                      |
| `withdrawal`            | 11      | `jobs`, `layout`                                                             |

## Variants

Three modules are variants of the reference shape rather than copies of it.
Each one is listed here because the shape alone would not explain the
difference.

### `(auth)` — a route group, not an entity

A parenthesised folder scopes pages without adding a path segment, so it
groups two flows (`sign-in`, `sign-up`) under one shell rather than
describing one entity. That has three consequences:

- The entity-prefix rule does not apply. `use-sign-in.hook.ts` names the
  flow, and `auth` would say nothing a reader did not already get from the
  folder.
- There are no server actions. Signing in and up are client calls, wired
  through `presentation/composition/auth.container.ts`.
- There are no tables, so `datatable/` is absent, and no shell outside
  `(auth)`, so `layout/` is the only `layout/` in the tree.

### `audit-log` — read-only

Nothing in the product deletes or edits an audit entry, so the module owns
no `actions/`, no `dialogs/`, no `forms/` and no `validations/`. The
row-actions hook follows from that: a module with no delete action has
nothing to do per row, so `use-audit-log-row-actions.hook.ts` does not exist.
The checker derives this rather than listing an exemption, by looking for a
`delete-` action before it asks for the hook.

`portfolio-performance`, `position-performance` and `quota` are read-only in
the same way — they only start and poll work — so they also carry no
row-actions hook, and they keep `validations/` because they do own actions.

### `application` — no edit path

An application is a recorded movement of money, so it is added and reversed but
never edited in place; correcting one means reversing it and adding the right
one. The module therefore owns `create-`, `delete-` and `reverse-` actions and
no `update-` action, and its `dialogs/` holds `add`, `add-another` and
`confirm-reverse` with no `edit`.

Two leftovers from an edit screen that was never finished were removed because
nothing imported them: `forms/edit.tsx`, its
`use-application-edit-form.hook.ts`, and `update-application.action.ts`. That
action was a self-declared placeholder — its own comment read "there is no
update use case yet", and it returned a failure unconditionally — and
`application.container.ts` never wired an update use case to call.
`APPLICATION_EDIT_FORM_SCHEMA` and `BULK_DELETE_APPLICATIONS_SCHEMA` remain
declared in `validations/` with no matching action, which is logged in
[INDEX.md](INDEX.md#logged-defects).

### `portfolio-performance`, `position-performance`, `quota` — job drivers

These three are the only modules that dispatch asynchronous work, so they are
the only ones with a `jobs/` folder, and each `jobs/` folder holds exactly
one store. A job store is the one file that exports a set rather than a
single symbol: `create`, `get`, `update`, `complete` and `prune` are the
accessors of one job, so the file names the job and every accessor names the
entity.

## Why a folder is absent

| omitted folder | modules                                                                     | reason                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout/`      | every entity module                                                         | A shell belongs to the group that owns the chrome. Only `(auth)` has chrome of its own, so it is the only module with a `layout/`.                                                              |
| `jobs/`        | every module but `portfolio-performance`, `position-performance`, `quota`   | A job store exists to track dispatched async work. A module with no such work tracks nothing.                                                                                                   |
| `components/`  | `bank`, `bank-account`, `category`, `checking-account`, `user`, `audit-log` | These screens are composed entirely from `parts/`. A module earns `components/` when it needs a control of its own; `fund`, `portfolio`, `position`, `statement`, `quota` and `application` do. |
| `actions/`     | `(auth)`, `audit-log`                                                       | `(auth)` authenticates on the client through its container; `audit-log` is read-only.                                                                                                           |
| `dialogs/`     | `(auth)`, `audit-log`                                                       | `(auth)` has no create, edit or delete to confirm; `audit-log` is read-only.                                                                                                                    |
| `forms/`       | `(auth)`, `audit-log`, `position`                                           | `(auth)` posts to `auth.container` rather than a form schema; `audit-log` is read-only; a position is opened from the portfolio screen rather than created from its own dialog.                 |
| `validations/` | `audit-log`                                                                 | A schema guards input. A read-only screen has no input to guard, and its search filter reuses `EntitySearchFilter` without a schema.                                                            |
| `datatable/`   | `(auth)`                                                                    | Neither auth screen shows a table.                                                                                                                                                              |
| `helpers/`     | `(auth)`                                                                    | Both flows are one hook and one form each, so there is nothing to compose.                                                                                                                      |
| `types/`       | `(auth)`, `user`                                                            | `(auth)` declares its props beside each form. `user` has no entity-specific shape of its own: it reuses the shared `UserRow` and the generic `parts/` dialog models.                            |

## Contracts of a folder that exists

These hold only when the folder is there, so an omission is free.

- `datatable/` holds `filters`, `table-columns`, `table` and `toolbar`.
- `helpers/` holds `load-<entity>-page-props.helper.ts` for a list module.
  `portfolio`, `fund` and `position` reach their detail screen through
  `use<entity>-overview` instead, so only their list pages need the loader.
- `hooks/` holds `use-<entity>-datatable`, `use-<entity>-datatable-filters`,
  `use-<entity>-kpis` and `use-<entity>-row-actions` for a list module, the
  last one only when a delete action exists.
- `settings/` holds `labels.settings.ts`, which is where all user-facing copy
  for the module lives.
- `pages/` composes and nothing else: it calls at most one
  `load-<entity>-page-props` and renders parts, ui and its own dialogs.
