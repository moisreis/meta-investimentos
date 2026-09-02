# Compliance (LGPD) position

This document records the data-protection position for personal data
handling in this repository. It follows Law 13.709/2018, the Brazilian
General Data Protection Law (LGPD). It is the single source of truth for
PII decisions. Update it whenever the schema or the use cases change how
the code handles personal data.

Reference files:

- User entity: `business/entities/user/user.entity.ts`
- Documentation rules: `agents/DOCUMENTATION_STANDARDS.md`

---

## Scope and principle

The system stores the minimum personal data required to operate the
product. The code applies data minimization, purpose limitation, and
access limitation to every PII field.

The governing rule is: a use case reads the minimum PII it needs to
fulfill its purpose, and never more. When a field exists only to
identify a record, the code uses a masked form instead of the full
value.

## PII inventory

| Field       | Entity | Sensitivity | Handling                                          |
| ------------ | ------ | ----------- | ------------------------------------------------- |
| `cpf`       | `User` | High        | Full value held in the database; masked on read   |
| `name`      | `User` | High        | Held in full; audit, never log at console         |
| `email`     | `User` | High        | Held in full; used for authentication             |
| `firstName` | `User` | High        | Held in full; used for display                    |
| `lastName`  | `User` | High        | Held in full; used for display                    |
| `image`     | `User` | Medium      | Held as a profile URL                              |

Financial data, account numbers, and quota amounts are not personal data
for this position. Treat them as commercially sensitive and apply the
audit rules separately.

## Data minimization position

The schema keeps `name`, `email`, `firstName`, `lastName`, and `cpf` in
full because the domain requires them for account operation, statement
generation, and regulatory identification. The code does not store data
that the product does not use. Examples:

- Do not add an `address` or `phone` field until a use case needs it.
- Do not store a derived or duplicate PII field without a stated reason.
- Do not store the full `cpf` in any table other than `user`.

### Masking

The code exposes one masking getter today: `User.maskedCpf`. It returns
only the first three and the last two digits of the `cpf`, for example
`529.***.***-25`. Use `maskedCpf` wherever a record must be shown to a
user or an operator who is not the data subject.

The full `cpf` is exposed through the `User.cpf` value object only to
the use cases that are authorized to read it. Do not broadcast the full
`cpf` to a client, a log, or a report unless the feature's purpose
requires it.

### Read audit

The code does not yet implement a read-audit. When a future use case
reads the full `cpf` or `name` outside the data subject's own session,
the change must add a read-audit entry. See the audit log schema
(`audit-log`) for the record format. Add this audit in the same change
that opens the read.

## Retention position

The position for retention is: keep a record only while the legal or
operational purpose needs it, then delete or anonymize it. This
repository does not implement automated retention yet. A deletion or
anonymization job is a use case, and its rules live under the use-case
requirements (see `agents/TRD.md`). Do not hard-delete a financial
record outside an audited, reversible flow. See the soft-delete policy
in `agents/DATABASE_CONVENTIONS.md`.

## Logging and display

- Do not log a `cpf`, a full `name`, a `firstName`, or a `lastName` at
  a console or a log at any level.
- Do not print a `cpf` in an error message. Use the masked form or the
  user id.
- Never place real customer data in examples, tests, or documentation.
  Use synthetic values only. This rule repeats the example rule in
  `agents/DOCUMENTATION_STANDARDS.md`.

## Change control

A change that adds a PII field, exposes a full PII value to a new
consumer, or changes retention requires this document to be updated in
the same commit. A reviewer must confirm the change against this
position before merge.
