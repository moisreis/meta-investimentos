import Decimal from "decimal.js";

/**
 * Represents a non-negative quota quantity.
 *
 * The quantity is stored as a {@link Decimal} to preserve
 * precision when performing quota calculations.
 *
 * Values are normalized to a maximum of 6 decimal places
 * when the quantity is created.
 *
 * Use {@link QuotaQuantity.create} to create a valid
 * `QuotaQuantity` instance.
 */
interface QuotaQuantityProps {
  value: Decimal;
}

/**
 * Value object representing a quota quantity.
 *
 * A `QuotaQuantity`:
 * - must be defined.
 * - must be equal to or greater than 0.
 * - is stored with a maximum of 6 decimal places.
 *
 * `QuotaQuantity` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const QUANTITY = QuotaQuantity.create(
 *  '10.123456789'
 * )
 *
 * QUANTITY.value.toString()
 * // '10.123457'
 * ```
 *
 * @example
 * ```ts
 * const A = QuotaQuantity.create('10')
 * const B = QuotaQuantity.create('10.000000')
 *
 * QuotaQuantity.equals(A, B)
 * // true
 * ```
 */
class QuotaQuantity {
  private readonly props: QuotaQuantityProps;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the quota quantity value.
   */
  get value(): Decimal {
    return this.props.value;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `QuotaQuantity`.
   *
   * The constructor is private to ensure that all instances
   * are created through {@link QuotaQuantity.create} and
   * therefore satisfy the value object's invariants.
   */
  private constructor(props: QuotaQuantityProps) {
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `QuotaQuantity` from a decimal-compatible value.
   *
   * The value can be any value accepted by {@link Decimal.Value}.
   * It must be defined and cannot be negative.
   *
   * The resulting value is converted to a {@link Decimal} and
   * rounded to a maximum of 6 decimal places.
   *
   * @param value - The decimal-compatible quota quantity to create.
   * @returns A valid `QuotaQuantity` instance.
   *
   * @throws {Error} If `value` is `undefined` or `null`.
   * @throws {Error} If `value` is less than `0`.
   *
   * @example
   * ```ts
   * const QUANTITY = QuotaQuantity.create('12.3456789')
   *
   * QUANTITY.value.toString()
   * // '12.345679'
   * ```
   *
   * @example
   * ```ts
   * const QUANTITY = QuotaQuantity.create(12.3456789)
   *
   * QUANTITY.value.toString()
   * // '12.345679'
   * ```
   */
  public static create(value: Decimal.Value): QuotaQuantity {
    if (value === undefined || value === null) {
      throw new Error("`QuotaQuantity` must be defined.");
    }

    const decimalValue = new Decimal(value);

    if (decimalValue.lessThan(0)) {
      throw new Error("`QuotaQuantity` must be equal or greater than 0.");
    }

    return new QuotaQuantity({ value: decimalValue.toDecimalPlaces(6) });
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether two `QuotaQuantity` instances
   * represent the same value.
   *
   * @param a - The first quota quantity.
   * @param b - The second quota quantity.
   * @returns `true` when both quantities have equal values;
   * otherwise, `false`.
   *
   * @example
   * ```ts
   * const A = QuotaQuantity.create('10')
   * const B = QuotaQuantity.create('10.000000')
   *
   * QuotaQuantity.equals(A, B)
   * // true
   * ```
   */
  public static equals(a: QuotaQuantity, b: QuotaQuantity): boolean {
    return a.value.equals(b.value);
  }
}

export default QuotaQuantity;
