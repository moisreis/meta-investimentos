import Decimal from "decimal.js";
import {
  PERCENTAGE_DECIMAL_PLACES,
  ROUNDING_MODE,
} from "@/business/value-objects/rounding";
import { ValidationError } from "@/shared/errors";

/**
 * Represents a signed percentage value.
 *
 * The code stores the value as a {@link Decimal} to keep
 * full precision during percentage calculations.
 *
 * The code normalizes the value to a maximum of 2 decimal
 * places when it creates the percentage.
 *
 * Use {@link SignedPercentage.create} to create a valid
 * `SignedPercentage` instance.
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
 * const A = SignedPercentage.create('10')
 * const B = SignedPercentage.create('10.00')
 *
 * SignedPercentage.equals(A, B)
 * // true
 * ```
 */
export class SignedPercentage {
  private readonly props: SignedPercentageProps;

  /**
   * Returns the percentage value.
   */
  get value(): Decimal {
    return this.props.value;
  }

  /**
   * Returns whether the percentage is negative.
   *
   * @returns `true` when the percentage is less than `0`;
   *          otherwise, `false`.
   */
  get isNegative(): boolean {
    return this.props.value.isNegative();
  }

  /**
   * Returns whether the percentage is positive.
   *
   * A value of `0` is not considered positive.
   *
   * @returns `true` when the percentage is greater than `0`;
   *          otherwise, `false`.
   */
  get isPositive(): boolean {
    return this.props.value.isPositive() && !this.props.value.isZero();
  }

  /**
   * Returns whether the percentage is zero.
   *
   * @returns `true` when the percentage equals `0`;
   *          otherwise, `false`.
   */
  get isZero(): boolean {
    return this.props.value.isZero();
  }

  /**
   * Creates a `SignedPercentage`.
   *
   * The constructor is private to ensure that all instances
   * are created through {@link SignedPercentage.create} and
   * therefore satisfy the value object's invariants.
   */
  private constructor(props: SignedPercentageProps) {
    this.props = props;
  }

  /**
   * Creates a valid `SignedPercentage` from a decimal-compatible value.
   *
   * The code accepts any value that {@link Decimal.Value}
   * accepts. The value may be positive, negative, or zero.
   *
   * The code converts the value to a {@link Decimal} and
   * rounds it to a maximum of 2 decimal places.
   *
   * @param value - The decimal-compatible percentage value to create.
   * @returns A valid `SignedPercentage` instance.
   *
   * @throws {ValidationError} If `value` is `undefined` or `null`.
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
      throw new ValidationError("`SignedPercentage` must be defined.");
    }

    const DECIMAL_VALUE = new Decimal(value);

    return new SignedPercentage({
      value: DECIMAL_VALUE.toDecimalPlaces(
        PERCENTAGE_DECIMAL_PLACES,
        ROUNDING_MODE,
      ),
    });
  }

  /**
   * Determines whether two `SignedPercentage` instances
   * represent the same value.
   *
   * @param a - The first percentage.
   * @param b - The second percentage.
   * @returns `true` when both percentages have equal values;
   *          otherwise, `false`.
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
