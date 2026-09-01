import Decimal from "decimal.js";
import { ValidationError } from "@/shared/errors";

/**
 * Represents a non-negative monetary amount.
 *
 * The amount is stored as a {@link Decimal} to preserve
 * precision when performing monetary calculations.
 *
 * Values are normalized to a maximum of 2 decimal places
 * when the amount is created.
 *
 * Use {@link PositiveMoney.create} to create a valid
 * `PositiveMoney` instance.
 */
interface PositiveMoneyProps {
  value: Decimal;
}

/**
 * Value object representing a positive monetary amount.
 *
 * A `PositiveMoney`:
 * - must be defined.
 * - must be equal to or greater than 0.
 * - is stored with a maximum of 2 decimal places.
 *
 * `PositiveMoney` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const MONEY = PositiveMoney.create(
 *  '10.123'
 * )
 *
 * MONEY.value.toString()
 * // '10.12'
 * ```
 *
 * @example
 * ```ts
 * const A = PositiveMoney.create('10')
 * const B = PositiveMoney.create('10.00')
 *
 * PositiveMoney.equals(A, B)
 * // true
 * ```
 */
class PositiveMoney {
  private readonly props: PositiveMoneyProps;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the monetary value.
   */
  get value(): Decimal {
    return this.props.value;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `PositiveMoney`.
   *
   * The constructor is private to ensure that all instances
   * are created through {@link PositiveMoney.create} and
   * therefore satisfy the value object's invariants.
   */
  private constructor(props: PositiveMoneyProps) {
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `PositiveMoney` from a decimal-compatible value.
   *
   * The value can be any value accepted by {@link Decimal.Value}.
   * It must be defined and cannot be negative.
   *
   * The resulting value is converted to a {@link Decimal} and
   * rounded to a maximum of 2 decimal places.
   *
   * @param value - The decimal-compatible monetary amount to create.
   * @returns A valid `PositiveMoney` instance.
   *
   * @throws {ValidationError} If `value` is `undefined` or `null`.
   * @throws {ValidationError} If `value` is less than `0`.
   *
   * @example
   * ```ts
   * const MONEY = PositiveMoney.create('12.345')
   *
   * MONEY.value.toString()
   * // '12.35'
   * ```
   *
   * @example
   * ```ts
   * const MONEY = PositiveMoney.create(12.34)
   *
   * MONEY.value.toString()
   * // '12.34'
   * ```
   */
  public static create(value: Decimal.Value): PositiveMoney {
    if (value === undefined || value === null) {
      throw new ValidationError("`PositiveMoney` must be defined.");
    }

    const decimalValue = new Decimal(value);

    if (decimalValue.lessThan(0)) {
      throw new ValidationError(
        "`PositiveMoney` must be equal or greater than 0.",
      );
    }

    return new PositiveMoney({
      value: decimalValue.toDecimalPlaces(2),
    });
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether two `PositiveMoney` instances
   * represent the same value.
   *
   * @param a - The first monetary amount.
   * @param b - The second monetary amount.
   * @returns `true` when both monetary amounts have equal values;
   * otherwise, `false`.
   *
   * @example
   * ```ts
   * const A = PositiveMoney.create('10')
   * const B = PositiveMoney.create('10.00')
   *
   * PositiveMoney.equals(A, B)
   * // true
   * ```
   */
  public static equals(a: PositiveMoney, b: PositiveMoney): boolean {
    return a.value.equals(b.value);
  }
}

export default PositiveMoney;
