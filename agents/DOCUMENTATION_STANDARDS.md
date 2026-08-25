# Documentation Standards

Guide for writing and keeping JSDoc documentation consistent across
`business/value-objects/*.vo.ts` and `business/calculators/**/*.calculator.ts`.

Reference implementations:

- Value object: `business/value-objects/quota-price.vo.ts`
- Calculator: `business/calculators/application/application-quotas.calculator.ts`

---

## 1. General Rules

- Document public API with JSDoc block comments (`/** ... */`) only.
  Do not add inline `//` comments except for section dividers (see below).
- Start every description with a third-person present-tense verb:
  `Represents`, `Calculates`, `Creates`, `Returns`, `Determines`.
- Wrap descriptions at ~72-78 characters.
- Wrap identifiers in backticks inside prose: `PositiveMoney`,
  `undefined`, `0`.
- Reference types and members with `{@link}` instead of repeating names:
  `{@link Decimal}`, `{@link PositiveMoney.create}`.
- Leave one blank line between the description block and the first tag,
  and between tag groups where it improves readability.
- Every documented behavior shown in an example must match the actual
  implementation (rounding, error cases, equality semantics).
- Error messages thrown by the code must mirror the documented invariants
  and use the same backtick style: `` "`PositiveMoney` must be defined." ``

---

## 2. Value Objects

File naming: `<concept>.vo.ts`, default-exported class.

Member order is fixed, separated by section divider comments:

    // --------------------------------------
    // GETTERS
    // --------------------------------------
    // --------------------------------------
    // CONSTRUCTOR
    // --------------------------------------
    // --------------------------------------
    // FACTORY METHODS
    // --------------------------------------
    // --------------------------------------
    // COMPARISON METHODS
    // --------------------------------------

### 2.1 Props Interface

Placed above the class, named `<Class>Props`. Document what it represents,
why precision is preserved, how values are normalized, and point to the
factory:

```ts
/**
 * Represents a non-negative quota price.
 *
 * The price is stored as a {@link Decimal} to preserve
 * precision when performing quota pricing calculations.
 *
 * Values are normalized to a maximum of 6 decimal places
 * when the price is created.
 *
 * Use {@link QuotaPrice.create} to create a valid
 * `QuotaPrice` instance.
 */
interface QuotaPriceProps {
  value: Decimal;
}
```

### 2.2 Class Block

Documented as "Value object representing ...". Must include:

1. An invariant bullet list introduced by "A `X`:", one bullet per invariant.
2. An immutability statement.
3. At least two `@example` blocks: one showing normalization, one showing
   equality.

```ts
/**
 * Value object representing a quota price.
 *
 * A `QuotaPrice`:
 * - must be defined.
 * - must be equal to or greater than 0.
 * - is stored with a maximum of 6 decimal places.
 *
 * `QuotaPrice` instances are immutable after creation.
 *
 * @example
 * const PRICE = QuotaPrice.create('10.123456789')
 *
 * PRICE.value.toString()
 * // '10.123457'
 *
 * @example
 * const A = QuotaPrice.create('10')
 * const B = QuotaPrice.create('10.000000')
 *
 * QuotaPrice.equals(A, B)
 * // true
 */
```

### 2.3 Getter

One line: `Returns the <concept> value.`

```ts
/**
 * Returns the quota price value.
 */
get value(): Decimal {
```

### 2.4 Private Constructor

Explain why the constructor is private and link back to the factory:

```ts
/**
 * Creates a `QuotaPrice`.
 *
 * The constructor is private to ensure that all instances
 * are created through {@link QuotaPrice.create} and
 * therefore satisfy the value object's invariants.
 */
private constructor(props: QuotaPriceProps) {
```

### 2.5 Factory Method (`create`)

The fullest doc block in the file. Required tags, in order:

1. Description: what it creates from, accepted input, constraints, and how
   the result is normalized (decimal places).
2. `@param` - phrased as `The decimal-compatible <concept> to create.`
3. `@returns` - `A valid \`X\` instance.`
4. `@throws {Error}` - one entry per validation rule, in validation order.
5. `@example` - at least two: string input (shows rounding) and numeric
   input.

```ts
/**
 * Creates a valid `QuotaPrice` from a decimal-compatible value.
 *
 * The value can be any value accepted by {@link Decimal.Value}.
 * It must be defined and cannot be negative.
 *
 * The resulting value is converted to a {@link Decimal} and
 * rounded to a maximum of 6 decimal places.
 *
 * @param value - The decimal-compatible quota price to create.
 * @returns A valid `QuotaPrice` instance.
 *
 * @throws {Error} If `value` is `undefined` or `null`.
 * @throws {Error} If `value` is less than `0`.
 *
 * @example
 * const PRICE = QuotaPrice.create('12.3456789')
 *
 * PRICE.value.toString()
 * // '12.345679'
 */
public static create(value: Decimal.Value): QuotaPrice {
```

### 2.6 Comparison Method (`equals`)

- Description starts with `Determines whether two \`X\` instances represent
  the same value.`
- Parameters named `a` and `b`, described as `The first/second <concept>.`
- Returns phrasing: `` `true` when both <concepts> have equal values;
  otherwise, `false`. ``
- One `@example` demonstrating equality after normalization.

```ts
/**
 * Determines whether two `QuotaPrice` instances
 * represent the same value.
 *
 * @param a - The first quota price.
 * @param b - The second quota price.
 * @returns `true` when both quota prices have equal values;
 * otherwise, `false`.
 *
 * @example
 * const A = QuotaPrice.create('10')
 * const B = QuotaPrice.create('10.000000')
 *
 * QuotaPrice.equals(A, B)
 * // true
 */
public static equals(a: QuotaPrice, b: QuotaPrice): boolean {
```

---

## 3. Calculators

File naming: `<operation>.calculator.ts`, named export function
`calculate<Operation>`. Calculators are pure functions that take value
objects in and return a value object out.

### 3.1 Props Interface

Named `Calculate<Operation>Props`, placed above the function. Documented as
"Represents the inputs required to calculate ...", with each input's value
object referenced via `{@link}`:

```ts
/**
 * Represents the inputs required to calculate
 * the number of quotas corresponding to an application.
 *
 * The application amount is represented by {@link PositiveMoney},
 * while the quota price is represented by {@link QuotaPrice}.
 */
interface CalculateApplicationQuotasProps {
  application: PositiveMoney;
  quota: QuotaPrice;
}
```

For array inputs, state what each element represents:

```ts
/**
 * Represents the inputs required to calculate
 * the total number of quotas from multiple withdrawal quota quantities.
 *
 * Each quota quantity is represented by {@link QuotaQuantity}.
 */
```

### 3.2 Function Block

Required content and tag order:

1. Description starting with `Calculates ...`, followed by a sentence naming
   the result's value object (`The result is represented as a {@link X}.`)
   and any normalization applied.
2. `@param` - one per destructured property, phrased from the caller's
   perspective (`The monetary amount being invested.`,
   `The current price of a single quota.`).
3. `@returns` - short noun phrase (`The calculated number of quotas.`).
4. `@equation` - the formula in Unicode math notation, mirroring the
   corresponding equation in `agents/TRD.md` (see section 4).
5. `@example` - full usage with realistic inputs and the expected output as
   a trailing comment.

```ts
/**
 * Calculates the number of quotas corresponding to
 * an application amount based on the current quota price.
 *
 * The result is represented as a {@link QuotaQuantity}
 * and is normalized to a maximum of 6 decimal places.
 *
 * @param application - The monetary amount being invested.
 * @param quota - The current price of a single quota.
 *
 * @returns The calculated number of quotas.
 *
 * @equation Qₜᴬ˒ⁱ = Aₜⁿ˒ⁱ / Qₜ
 *
 * @example
 * const RESULT = calculateApplicationQuotas({
 *   application: PositiveMoney.create('1000000'),
 *   quota: QuotaPrice.create('4.428199'),
 * })
 *
 * RESULT.value.toString()
 * // '225825.442804'
 */
export function calculateApplicationQuotas({
  application,
  quota,
}: CalculateApplicationQuotasProps): QuotaQuantity {
```

---

## 4. Equations

Calculators must document their equation with the custom `@equation` tag.

- Use Unicode subscripts/superscripts (no LaTeX): `Qₜ`, `Aₜⁿ˒ⁱ`, `∑ₙ`.
- Symbol meanings follow `agents/TRD.md`: `A` = application amount,
  `W` = withdrawal/redemption amount, `Q_t` = quota price at time `t`,
  `Q^A` / `Q^W` = quotas bought/redeemed, superscript `i` = investor,
  subscript `t` = date, `n` = individual operation index.
- The `@equation` value must correspond 1:1 with the equation listed for the
  same concept in `agents/TRD.md`. If TRD has no equation yet, add it there
  before or together with the calculator.
- Examples: `Qₜᴬ˒ⁱ = Aₜⁿ˒ⁱ / Qₜ`, `Qₜᵂˢ = Wₜⁿ / Qₜ`, `Aₜⁿ = ∑ₙ Aₜⁿ,ⁱ`.

---

## 5. Example Blocks

All examples share the same shape regardless of where they appear:

- Fenced code blocks annotated with `ts`.
- Constants use UPPERCASE names: `PRICE`, `QUANTITY`, `RESULT`;
  comparison examples use `A` and `B`.
- Call expressions may break arguments onto their own lines when long.
- Expected outputs are shown as trailing `//` comments directly below the
  expression that produces them, with string results single-quoted:
  `// '10.123457'`.
- Examples must be copy-paste runnable given the module's exports and use
  realistic domain data (e.g. prices like `'4.428199'`, amounts like
  `'1000000'`).

---

## 6. Checklist for New or Edited Files

- [ ] Every exported symbol has a JSDoc block.
- [ ] Descriptions start with a present-tense verb and wrap ~72-78 chars.
- [ ] Identifiers backticked; cross-references use `{@link}`.
- [ ] Value object: props interface + class block + getter + constructor +
      `create` + `equals`, in the fixed member order with dividers.
- [ ] Invariants listed in the class block match the `@throws` entries and
      the actual runtime validations.
- [ ] Calculator: props interface documented, function block contains
      `@param`, `@returns`, `@equation`, `@example`.
- [ ] `@equation` matches the concept's equation in `agents/TRD.md`.
- [ ] All examples show expected output as comments and match real behavior.
