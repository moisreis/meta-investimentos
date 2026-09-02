import Decimal from "decimal.js";
import {
  MONEY_DECIMAL_PLACES,
  ROUNDING_MODE,
} from "@/business/value-objects/rounding";
import { ValidationError } from "@/shared/errors";

/**
 * Represents a non-negative monetary amount.
 *
 * The code stores the amount as a {@link Decimal} to keep
 * full precision during monetary calculations.
 *
 * The code normalizes the value to a maximum of 2 decimal
 * places when it creates the amount.
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
 * const MONEY = PositiveMoney.create('10.123')
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
export class PositiveMoney {
  private readonly props: PositiveMoneyProps;

  /**
   * Returns the monetary value.
   */
  get value(): Decimal {
    return this.props.value;
  }

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

  /**
   * Creates a valid `PositiveMoney` from a decimal-compatible value.
   *
   * The code accepts any value that {@link Decimal.Value}
   * accepts. The value must be defined. The value cannot be
   * negative.
   *
   * The code converts the value to a {@link Decimal} and
   * rounds it to a maximum of 2 decimal places.
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
      value: decimalValue.toDecimalPlaces(MONEY_DECIMAL_PLACES, ROUNDING_MODE),
    });
  }

  /**
   * Determines whether two `PositiveMoney` instances
   * represent the same value.
   *
   * @param a - The first monetary amount.
   * @param b - The second monetary amount.
   * @returns `true` when both monetary amounts have equal values;
   *          otherwise, `false`.
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
