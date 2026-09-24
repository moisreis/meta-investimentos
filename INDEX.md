# Presentation Layer Glossary

Naming and structure conventions for this codebase.
The rules below apply to every file, except the
shadcn components under `presentation/ui/`.

## File names

Files use kebab-case names that follow the directory
responsibility, with a singular suffix.

- `parts/hooks/` -> `*.hook.ts` (stateful hooks)
- `routes/**/hooks/` -> `*.hook.ts` (route hooks)
- `constants/` -> `*.constants.ts` (literal values)
- `presenters/` -> `*.presenter.ts` (display logic)
- `masks/` -> `*.mask.ts` (input masking)
- `validators/` -> `*.validator.ts` (validators)
- `validations/` -> `*.validation.ts` (Zod schemas)
- `settings/` -> `*.settings.ts` (user-facing copy)
- `theme/` -> `*.tsx` (theme behavior)

New suffixes must be documented here before use.

## Symbols

- Functions use `PascalCase`.
- Custom hooks use `use` + `PascalCase`.
- Data consts use `SCREAMING_SNAKE_CASE`.
- Function-valued consts (callbacks, setters, hook
  returns) use camelCase: SCREAMING is reserved for
  data, never for functions.
- Hook return object properties keep camelCase names,
  since they form the public API of the hook.

## Line length

- Code and documentation lines stay within 65 chars.
- JSX elements may exceed the limit.
- `npm run format` already enforces the width; run it
  on the changed files before committing.