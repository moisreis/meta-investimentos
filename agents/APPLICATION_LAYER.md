# Application Layer Conventions

This document tells you how to write and keep the application layer of
this repository. The application layer orchestrates business entities
and repositories to implement a use case. It sits between the delivery
layer (`app/` routes) and the persistence layer
(`infrastructure/repositories/`).

Use this document for every file that coordinates persistence in a use
case.

---

## Scope

The application layer:

- builds the repositories it needs from the environment database
  client;
- scopes each business operation inside one set of atomic persistence
  operations;
- maps domain and persistence errors to the HTTP boundary.

The application layer never:

- defines value objects or calculators (see `business/`);
- talks to the database directly with raw queries;
- imports the environment-specific client directly.

---

## The `UnitOfWork`

A `UnitOfWork` (`infrastructure/unit-of-work.ts`) wraps one database
transaction. It exposes a single method, `run`, that receives a worker.

```ts
const UNIT_OF_WORK = new UnitOfWork(db);

const RESULT = await UNIT_OF_WORK.run(async (tx) => {
  const SAVED = await tx.applications.save(application);

  await tx.positions.save(position);

  return SAVED;
});
```

Follow these rules.

1. Place one business operation inside one `run` callback. The callback
   is the unit of work. Keep every write of the operation inside it.
2. Use only the repositories of the `tx` context inside the callback.
   Never use a repository bound to the outer database client inside the
   callback.
3. Treat the callback as atomic. When it resolves, the transaction
   commits. When it throws, the transaction rolls back and none of the
   writes persist.
4. Perform reads inside the callback through the `tx` repositories when
   the read result feeds a later write of the same transaction.
5. Do not start a nested transaction. Reuse the repositories of the
   current context.

A repository bound to a transaction shares the transaction with every
other repository of the same context. All of their writes commit
together or roll back together.

---

## Transaction-scoped repositories

Repositories receive their database client through the constructor. A
`UnitOfWork` constructs a fresh repository per transaction and binds it
to the transaction client (`PgAsyncTransaction`) at the start of each
`run` call.

A `PgAsyncTransaction` is assignable to `DbClient`
(`infrastructure/repositories/types.ts`), so repositories keep a single
constructor parameter and do not know whether they run on the outer
client or inside a transaction.

---

## Mutations and the audit trail

The audit trail lives in the `audit_log` table. The `UnitOfWork`
automatically appends an `AuditLog` row for every successful `save()` or
`delete()` performed through the repositories of its `tx` context. The
row records the entity name, the entity id, the action
(`CREATED`, `UPDATED` or `DELETED`) and the acting user id, and is
written in the same transaction as the mutation, so it commits or rolls
back together with it.

Pass the acting user through the second argument of `run` when the actor
is known:

```ts
await UNIT_OF_WORK.run(worker, { userId: SESSION_USER_ID });
```

Use `tx.auditLogs` directly only for mutations the automatic wiring does
not cover (for example, when the `changes` payload must carry a custom
before/after snapshot). Reversal mutations on `application` and
`withdrawal` rows set `reversedByUserId` with one of the ids the actor
owns.

---

## Error handling

The application layer throws typed errors from `shared/errors/`:

- `NotFoundError` when a required entity does not exist.
- `ConcurrencyError` when an optimistic-lock version check fails.
- `ValidationError` when a domain invariant is violated.

The delivery layer maps each typed error to an HTTP response:

| Error              | HTTP status | Meaning                           |
| ------------------- | ----------- | --------------------------------- |
| `ValidationError`   | `400`       | The request payload is invalid.   |
| `NotFoundError`     | `404`       | The requested entity is missing.  |
| `ConcurrencyError`  | `409`       | A concurrent update was detected. |

Do not let a raw `Error` or an infrastructure error cross the boundary
untyped. Convert persistence failures into the typed errors above before
returning them to the delivery layer.

---

## Review checklist

- [ ] One use case runs inside one `UnitOfWork.run` callback.
- [ ] Every write uses a context repository, not an outer database
      repository.
- [ ] Audited mutations go through the `tx` repositories so the
      `UnitOfWork` records them in the same transaction.
- [ ] Custom audit entries go through `tx.auditLogs`.
- [ ] Every thrown error is a typed error from `shared/errors/`.
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run test` all pass.
