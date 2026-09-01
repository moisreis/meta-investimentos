# Code documentation standards

This document tells you how to write and keep code documentation for
`business/value-objects/*.vo.ts` and `business/calculators/**/*.calculator.ts`.

Follow this standard for all new and edited files in these folders. Use
this standard to prepare the codebase for review by a high-grade financial
institution. Good documentation shows correctness, traceability, and
intent. It lets a reviewer check the code against the requirements
without asking the author for help.

Reference files:

- Value object: `business/value-objects/quota-price.vo.ts`
- Calculator: `business/calculators/application/application-quotas.calculator.ts`

---

## Writing style

Write all documentation in Simplified Technical English. Use these rules.

- Write short sentences. Use no more than 20 words in one sentence.
- Write one instruction or one fact in each sentence.
- Use the active voice. Say "The function calculates the price," not
  "The price is calculated."
- Start each description with a present-tense verb: `Represents`,
  `Calculates`, `Creates`, `Returns`, `Determines`.
- Use approved, consistent terms. Do not use a different word for the
  same concept in different files.
- Do not use noun clusters longer than three words. Break long clusters
  into a phrase with a preposition.
- Wrap description lines at 72–78 characters.
- Put code identifiers in backticks: `PositiveMoney`, `undefined`, `0`.
- Link to a type or member with `{@link}` instead of writing the name in
  plain text twice: `{@link Decimal}`, `{@link PositiveMoney.create}`.
- Leave one blank line between the description and the first tag. Leave
  one blank line between tag groups when this improves readability.
- Use `/** ... */` documentation blocks for every public symbol. Do not
  use `//` inline comments.
- When a tag's description runs onto a second line, align the second
  line with the start of the text on the first line, not with the `*`.
  This example is incorrect:

  ```ts
  /**
   * @returns `true` when both quota prices have equal values;
   * otherwise, `false`.
   */
  ```

  This example is correct:

  ```ts
  /**
   * @returns `true` when both quota prices have equal values;
   *          otherwise, `false`.
   */
  ```

---

## Correctness rules

Documentation must match the code. A reviewer must be able to trust the
documentation without reading the implementation.

- Every example in a documentation block must produce the exact output
  shown, including rounding and error behavior.
- Every invariant listed in a class description must have a matching
  `@throws` entry and a matching runtime check in the code.
- Every error message thrown by the code must match the documented
  invariant. Use the same backtick style in the message:
  `` "`PositiveMoney` must be defined." ``
- If the code changes, update the documentation in the same commit. Do
  not merge a change that leaves the documentation out of date.

---

## Value objects

Name each file `<concept>.vo.ts`. Export the class as the default export.

Order the class members as shown below.

1. Getters
2. Constructor
3. Factory methods
4. Comparison methods

### Props interface

Place the props interface above the class. Name it `<Class>Props`.
Describe three things: what the value represents, why the code keeps
full precision, and how the code normalizes the value. Point the reader
to the factory method.

```ts
/**
 * Represents a non-negative quota price.
 *
 * The code stores the price as a {@link Decimal} to keep
 * full precision during quota pricing calculations.
 *
 * The code normalizes the value to a maximum of 6 decimal
 * places when it creates the price.
 *
 * Use {@link QuotaPrice.create} to create a valid
 * `QuotaPrice` instance.
 */
interface QuotaPriceProps {
  value: Decimal;
}
```

### Class block

Start the class description with "Value object representing ...". Include
these three parts, in order:

1. A bullet list of invariants. Start the list with "A `X`:". Write one
   invariant in each bullet.
2. One sentence that states the object is immutable after creation.
3. At least two `@example` blocks. Show one example of value
   normalization and one example of equality comparison.

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

### Getter

Write one line: `Returns the <concept> value.`

```ts
/**
 * Returns the quota price value.
 */
get value(): Decimal {
```

### Private constructor

State that the constructor is private. Give the reason. Point to the
factory method.

```ts
/**
 * Creates a `QuotaPrice`.
 *
 * The constructor is private. This makes sure the code
 * creates all instances through {@link QuotaPrice.create}
 * and that each instance meets the value object's
 * invariants.
 */
private constructor(props: QuotaPriceProps) {
```

### Factory method (`create`)

Write the fullest documentation block in the file for this method. Use
these tags, in this order.

1. Description: state what the method creates, what input it accepts,
   what constraints apply, and how the code normalizes the result.
2. `@param` — phrase from the caller's point of view:
   `The decimal-compatible <concept> to create.`
3. `@returns` — `A valid \`X\` instance.`
4. `@throws {Error}` — one entry for each validation rule. List the
   entries in the order the code checks them.
5. `@example` — give at least two examples. Show a string input example
   that proves rounding. Show a numeric input example.

```ts
/**
 * Creates a valid `QuotaPrice` from a decimal-compatible value.
 *
 * The code accepts any value that {@link Decimal.Value}
 * accepts. The value must be defined. The value cannot be
 * negative.
 *
 * The code converts the value to a {@link Decimal} and
 * rounds it to a maximum of 6 decimal places.
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

### Comparison method (`equals`)

- Start the description with: `Determines whether two \`X\` instances
  represent the same value.`
- Name the parameters `a` and `b`. Describe each as `The first/second
  <concept>.`
- Write the `@returns` line as shown below. Align the second line with
  the first line's text, as set out in the writing style rules.
- Give one `@example` that shows equality after normalization.

```ts
/**
 * Determines whether two `QuotaPrice` instances
 * represent the same value.
 *
 * @param a - The first quota price.
 * @param b - The second quota price.
 * @returns `true` when both quota prices have equal values;
 *          otherwise, `false`.
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

## Calculators

Name each file `<operation>.calculator.ts`. Export a named function
`calculate<Operation>`. Write each calculator as a pure function. Pass
value objects in. Return a value object out.

### Props interface

Name the interface `Calculate<Operation>Props`. Place it above the
function. Start the description with "Represents the inputs required to
calculate ...". Link each input to its value object with `{@link}`.

```ts
/**
 * Represents the inputs required to calculate
 * the number of quotas that correspond to an application.
 *
 * The application amount is a {@link PositiveMoney}. The
 * quota price is a {@link QuotaPrice}.
 */
interface CalculateApplicationQuotasProps {
  application: PositiveMoney;
  quota: QuotaPrice;
}
```

When an input is an array, state what each element represents.

```ts
/**
 * Represents the inputs required to calculate
 * the total number of quotas from multiple withdrawal
 * quota quantities.
 *
 * Each quota quantity is a {@link QuotaQuantity}.
 */
```

### Function block

Include this content, in this order.

1. Description: start with `Calculates ...`. Add a sentence that names
   the result's value object: `The result is a {@link X}.` State any
   normalization the code applies.
2. `@param` — one entry for each destructured property. Write each entry
   from the caller's point of view: `The monetary amount being
   invested.`, `The current price of a single quota.`
3. `@returns` — a short noun phrase: `The calculated number of quotas.`
4. `@equation` — the formula in Unicode math notation. Match the
   equation in `agents/TRD.md`. See the equations rules below.
5. `@example` — a full, realistic example. Show the expected output as
   a trailing comment.

```ts
/**
 * Calculates the number of quotas that correspond to
 * an application amount, based on the current quota price.
 *
 * The result is a {@link QuotaQuantity}. The code
 * normalizes the result to a maximum of 6 decimal places.
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

## Equations

Document the formula in each calculator with the custom `@equation` tag.

- Use Unicode subscript and superscript characters. Do not use LaTeX.
  Examples: `Qₜ`, `Aₜⁿ˒ⁱ`, `∑ₙ`.
- Use the symbol meanings defined in `agents/TRD.md`:
  - `A` = application amount
  - `W` = withdrawal or redemption amount
  - `Q_t` = quota price at time `t`
  - `Q^A` = quotas bought
  - `Q^W` = quotas redeemed
  - superscript `i` = investor
  - subscript `t` = date
  - `n` = index of one operation
- Match each `@equation` value to the corresponding equation in
  `agents/TRD.md`. If `agents/TRD.md` does not yet list the equation, add
  it there in the same change that adds the calculator.
- Example equations: `Qₜᴬ˒ⁱ = Aₜⁿ˒ⁱ / Qₜ`, `Qₜᵂˢ = Wₜⁿ / Qₜ`,
  `Aₜⁿ = ∑ₙ Aₜⁿ,ⁱ`.

---

## Example blocks

Write every example in the same format, in every file.

- Use a fenced code block tagged `ts`.
- Name constants in uppercase: `PRICE`, `QUANTITY`, `RESULT`. In
  equality examples, name the constants `A` and `B`.
- Break a long call expression onto separate lines, one argument per
  line.
- Show the expected output as a trailing `//` comment directly below the
  line that produces it. Put string output in single quotes:
  `// '10.123457'`.
- Write examples that a reader can copy and run without changes, using
  only the module's exported symbols.
- Use realistic domain data. Use prices like `'4.428199'` and amounts
  like `'1000000'`. Do not use placeholder values like `'1'` or `'foo'`.
- Do not put real customer data, account numbers, or other sensitive
  data in an example. Use synthetic values only.

---

## Traceability, review, and change control

A financial institution reviewer checks documentation for a source, an
owner, and a history. Meet these requirements for every file in scope.

- Link each calculator to its source requirement in `agents/TRD.md`
  through the `@equation` tag, or through a `@see` tag when no equation
  applies.
- Add a documentation review step to the pull request checklist. A
  second reviewer must confirm that the documentation matches the code
  before merge.
- Record a rationale for each invariant that is not obvious from
  domain knowledge alone. Add the rationale as a code comment near the
  validation, not only in the class description.
- Do not remove or weaken a documented invariant without a corresponding
  change to `agents/TRD.md` and sign-off from the domain owner.
- Keep the documentation style consistent across files. Run a full
  documentation pass after each sprint that touches value objects or
  calculators, to catch drift between files.

---

## Checklist for new or edited files

- [ ] Every exported symbol has a documentation block.
- [ ] Each description starts with a present-tense verb and wraps at
      72–78 characters.
- [ ] Each sentence follows the writing style rules.
- [ ] Each identifier is in backticks. Each cross-reference uses
      `{@link}`.
- [ ] Each multi-line tag description has its continuation line aligned
      with the first line's text.
- [ ] Each value object has a props interface, a class block, a getter,
      a constructor, a `create` method, and an `equals` method, in the
      fixed order.
- [ ] Each invariant in the class block matches a `@throws` entry and
      matches the runtime validation in the code.
- [ ] Each calculator has a documented props interface and a function
      block with `@param`, `@returns`, `@equation`, and `@example`.
- [ ] Each `@equation` matches the corresponding equation in
      `agents/TRD.md`.
- [ ] Each example shows the expected output as a comment. Each example
      matches the real behavior of the code.
- [ ] No example contains real customer data or other sensitive data.
- [ ] A second reviewer has confirmed the documentation against the code.