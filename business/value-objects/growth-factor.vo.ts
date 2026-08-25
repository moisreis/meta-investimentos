import Decimal from "decimal.js";

/**
 * Represents the properties of a growth factor.
 *
 * The value is stored as a {@link Decimal} to preserve
 * precision when performing growth calculations.
 */
interface GrowthFactorProps {
  value: Decimal;
}

/**
 * Value object representing a growth factor.
 *
 * A `GrowthFactor`:
 * - must be defined.
 * - must be equal to or greater than 0.
 * - is stored with a maximum of 8 decimal places.
 *
 * A growth factor:
 * - is a loss when its value is less than `1`.
 * - is a gain when its value is greater than `1`.
 * - is flat when its value is equal to `1`.
 *
 * `GrowthFactor` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const GROWTH = GrowthFactor.create('1.123456789')
 *
 * GROWTH.value.toString()
 * // '1.12345679'
 * ```
 *
 * @example
 * ```ts
 * const LOSS = GrowthFactor.create('0.9')
 * const GAIN = GrowthFactor.create('1.1')
 * const FLAT = GrowthFactor.create('1')
 *
 * LOSS.isLoss
 * // true
 *
 * GAIN.isGain
 * // true
 *
 * FLAT.isFlat
 * // true
 * ```
 */
class GrowthFactor {
  private readonly props: GrowthFactorProps;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the growth factor value.
   */
  get value(): Decimal {
    return this.props.value;
  }

  /**
   * Determines whether the growth factor represents a loss.
   *
   * A growth factor is considered a loss when its value
   * is less than `1`.
   *
   * @returns `true` when the growth factor is less than `1`;
   * otherwise, `false`.
   */
  get isLoss(): boolean {
    return this.props.value.lessThan(1);
  }

  /**
   * Determines whether the growth factor represents a gain.
   *
   * A growth factor is considered a gain when its value
   * is greater than `1`.
   *
   * @returns `true` when the growth factor is greater than `1`;
   * otherwise, `false`.
   */
  get isGain(): boolean {
    return this.props.value.greaterThan(1);
  }

  /**
   * Determines whether the growth factor represents no change.
   *
   * A growth factor is considered flat when its value
   * is equal to `1`.
   *
   * @returns `true` when the growth factor equals `1`;
   * otherwise, `false`.
   */
  get isFlat(): boolean {
    return this.props.value.equals(1);
  }

  // --------------------------------------
  // CONVERSION METHODS
  // --------------------------------------

  /**
   * Converts the growth factor to its percentage representation.
   *
   * The percentage is calculated by subtracting `1` from
   * the growth factor and multiplying the result by `100`.
   *
   * @returns The growth factor represented as a percentage.
   *
   * @example
   * ```ts
   * const GROWTH = GrowthFactor.create('1.25')
   *
   * GROWTH.toPercentage().toString()
   * // '25'
   * ```
   *
   * @example
   * ```ts
   * const LOSS = GrowthFactor.create('0.8')
   *
   * LOSS.toPercentage().toString()
   * // '-20'
   * ```
   */
  toPercentage(): Decimal {
    return this.props.value.minus(1).times(100);
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `GrowthFactor`.
   *
   * The constructor is private to ensure that all instances
   * are created through {@link GrowthFactor.create} and
   * therefore satisfy the value object's invariants.
   */
  private constructor(props: GrowthFactorProps) {
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `GrowthFactor` from a decimal-compatible value.
   *
   * The value can be any value accepted by {@link Decimal.Value}.
   * It must be defined and cannot be negative.
   *
   * The resulting value is converted to a {@link Decimal} and
   * rounded to a maximum of 8 decimal places.
   *
   * @param value - The decimal-compatible growth factor to create.
   * @returns A valid `GrowthFactor` instance.
   *
   * @throws {Error} If `value` is `undefined` or `null`.
   * @throws {Error} If `value` is less than `0`.
   *
   * @example
   * ```ts
   * const GROWTH = GrowthFactor.create('1.123456789')
   *
   * GROWTH.value.toString()
   * // '1.12345679'
   * ```
   *
   * @example
   * ```ts
   * const GROWTH = GrowthFactor.create(1.25)
   *
   * GROWTH.value.toString()
   * // '1.25'
   * ```
   */
  public static create(value: Decimal.Value): GrowthFactor {
    if (value === undefined || value === null) {
      throw new Error("`GrowthFactor` must be defined.");
    }

    const DECIMAL_VALUE = new Decimal(value);

    if (DECIMAL_VALUE.lessThan(0)) {
      throw new Error("`GrowthFactor` must be equal or greater than 0.");
    }

    return new GrowthFactor({
      value: DECIMAL_VALUE.toDecimalPlaces(8),
    });
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether two `GrowthFactor` instances
   * represent the same value.
   *
   * @param a - The first growth factor.
   * @param b - The second growth factor.
   * @returns `true` when both growth factors have equal values;
   * otherwise, `false`.
   *
   * @example
   * ```ts
   * const A = GrowthFactor.create('1')
   * const B = GrowthFactor.create('1.00000000')
   *
   * GrowthFactor.equals(A, B)
   * // true
   * ```
   */
  public static equals(a: GrowthFactor, b: GrowthFactor): boolean {
    return a.value.equals(b.value);
  }
}

export default GrowthFactor;
