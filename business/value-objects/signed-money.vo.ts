import Decimal from "decimal.js";
import { ValidationError } from "@/shared/errors";

/**
 * Represents a monetary amount that can be positive, negative, or zero.
 *
 * The amount is stored as a {@link Decimal} to preserve
 * precision when performing monetary calculations.
 *
 * Values are normalized to a maximum of 2 decimal places
 * when the amount is created.
 *
 * Use {@link SignedMoney.create} to create a valid
 * `SignedMoney` instance.
 */
interface SignedMoneyProps {
  value: Decimal;
}

/**
 * Value object representing a signed monetary amount.
 *
 * A `SignedMoney`:
 * - must be defined.
 * - may be negative, zero, or positive.
 * - is stored with a maximum of 2 decimal places.
 *
 * `SignedMoney` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const MONEY = SignedMoney.create(
 *  '-10.123'
 * )
 *
 * MONEY.value.toString()
 * // '-10.12'
 * ```
 *
 * @example
 * ```ts
 * const A = SignedMoney.create('-10')
 * const B = SignedMoney.create('-10.00')
 *
 * SignedMoney.equals(A, B)
 * // true
 * ```
 */
class SignedMoney {
  private readonly props: SignedMoneyProps;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the monetary value.
   */
  get value(): Decimal {
    return this.props.value;
  }

  /**
   * Returns whether the monetary value is negative.
   */
  get isNegative(): boolean {
    return this.props.value.isNegative();
  }

  /**
   * Returns whether the monetary value is positive.
   *
   * Note: zero is not considered positive.
   */
  get isPositive(): boolean {
    return this.props.value.isPositive() && !this.props.value.isZero();
  }

  /**
   * Returns whether the monetary value is zero.
   */
  get isZero(): boolean {
    return this.props.value.isZero();
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `SignedMoney`.
   *
   * The constructor is private to ensure that all instances
   * are created through {@link SignedMoney.create} and
   * therefore satisfy the value object's invariants.
   */
  private constructor(props: SignedMoneyProps) {
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `SignedMoney` from a decimal-compatible value.
   *
   * The value can be any value accepted by {@link Decimal.Value}.
   * It must be defined. Unlike {@link PositiveMoney}, negative
   * values are allowed.
   *
   * The resulting value is converted to a {@link Decimal} and
   * rounded to a maximum of 2 decimal places.
   *
   * @param value - The decimal-compatible monetary amount to create.
   * @returns A valid `SignedMoney` instance.
   *
   * @throws {ValidationError} If `value` is `undefined` or `null`.
   *
   * @example
   * ```ts
   * const MONEY = SignedMoney.create('-12.345')
   *
   * MONEY.value.toString()
   * // '-12.35'
   * ```
   *
   * @example
   * ```ts
   * const MONEY = SignedMoney.create(12.34)
   *
   * MONEY.value.toString()
   * // '12.34'
   * ```
   */
  public static create(value: Decimal.Value): SignedMoney {
    if (value === undefined || value === null) {
      throw new ValidationError("`SignedMoney` must be defined.");
    }

    const DECIMAL_VALUE = new Decimal(value);

    return new SignedMoney({
      value: DECIMAL_VALUE.toDecimalPlaces(2),
    });
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether two `SignedMoney` instances
   * represent the same value.
   *
   * @param a - The first monetary amount.
   * @param b - The second monetary amount.
   * @returns `true` when both monetary amounts have equal values;
   * otherwise, `false`.
   *
   * @example
   * ```ts
   * const A = SignedMoney.create('-10')
   * const B = SignedMoney.create('-10.00')
   *
   * SignedMoney.equals(A, B)
   * // true
   * ```
   */
  public static equals(a: SignedMoney, b: SignedMoney): boolean {
    return a.value.equals(b.value);
  }
}

export default SignedMoney;
