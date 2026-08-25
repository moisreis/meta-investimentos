import Decimal from "decimal.js";

/**
 * Represents the properties of a signed percentage.
 *
 * The value is stored as a {@link Decimal} to preserve
 * precision when performing percentage calculations.
 */
interface SignedPercentageProps {
  value: Decimal;
}

/**
 * Value object representing a signed percentage.
 *
 * A `SignedPercentage`:
 * - must be defined.
 * - may be positive, negative, or zero.
 * - is stored with a maximum of 2 decimal places.
 *
 * `SignedPercentage` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const PERCENTAGE = SignedPercentage.create('12.345')
 *
 * PERCENTAGE.value.toString()
 * // '12.35'
 * ```
 *
 * @example
 * ```ts
 * const NEGATIVE = SignedPercentage.create('-10')
 * const POSITIVE = SignedPercentage.create('10')
 * const ZERO = SignedPercentage.create('0')
 *
 * NEGATIVE.isNegative
 * // true
 *
 * POSITIVE.isPositive
 * // true
 *
 * ZERO.isZero
 * // true
 * ```
 */
class SignedPercentage {
  private readonly props: SignedPercentageProps;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the percentage value.
   */
  get value(): Decimal {
    return this.props.value;
  }

  /**
   * Determines whether the percentage is negative.
   *
   * @returns `true` when the percentage is less than `0`;
   * otherwise, `false`.
   */
  get isNegative(): boolean {
    return this.props.value.isNegative();
  }

  /**
   * Determines whether the percentage is positive.
   *
   * A value of `0` is not considered positive.
   *
   * @returns `true` when the percentage is greater than `0`;
   * otherwise, `false`.
   */
  get isPositive(): boolean {
    return this.props.value.isPositive() && !this.props.value.isZero();
  }

  /**
   * Determines whether the percentage is zero.
   *
   * @returns `true` when the percentage equals `0`;
   * otherwise, `false`.
   */
  get isZero(): boolean {
    return this.props.value.isZero();
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `SignedPercentage`.
   *
   * The constructor is private to ensure that all instances
   * are created through {@link SignedPercentage.create}.
   */
  private constructor(props: SignedPercentageProps) {
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `SignedPercentage` from a decimal-compatible value.
   *
   * The value can be any value accepted by {@link Decimal.Value}.
   * It may be positive, negative, or zero.
   *
   * The resulting value is converted to a {@link Decimal} and
   * rounded to a maximum of 2 decimal places.
   *
   * @param value - The decimal-compatible percentage value to create.
   * @returns A valid `SignedPercentage` instance.
   *
   * @throws {Error} If `value` is `undefined` or `null`.
   *
   * @example
   * ```ts
   * const PERCENTAGE = SignedPercentage.create('12.345')
   *
   * PERCENTAGE.value.toString()
   * // '12.35'
   * ```
   *
   * @example
   * ```ts
   * const PERCENTAGE = SignedPercentage.create('-5.25')
   *
   * PERCENTAGE.isNegative
   * // true
   * ```
   */
  public static create(value: Decimal.Value): SignedPercentage {
    if (value === undefined || value === null) {
      throw new Error("`SignedPercentage` must be defined.");
    }

    const DECIMAL_VALUE = new Decimal(value);

    return new SignedPercentage({
      value: DECIMAL_VALUE.toDecimalPlaces(2),
    });
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether two `SignedPercentage` instances
   * represent the same value.
   *
   * @param a - The first percentage.
   * @param b - The second percentage.
   * @returns `true` when both percentages have equal values;
   * otherwise, `false`.
   *
   * @example
   * ```ts
   * const A = SignedPercentage.create('10')
   * const B = SignedPercentage.create('10.00')
   *
   * SignedPercentage.equals(A, B)
   * // true
   * ```
   */
  public static equals(a: SignedPercentage, b: SignedPercentage): boolean {
    return a.value.equals(b.value);
  }
}

export default SignedPercentage;
