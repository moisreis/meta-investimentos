import Decimal from "decimal.js";
import {
  PRICE_DECIMAL_PLACES,
  ROUNDING_MODE,
} from "@/business/value-objects/rounding";
import { ValidationError } from "@/shared/errors";

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
 * ```ts
 * const PRICE = QuotaPrice.create('10.123456789')
 *
 * PRICE.value.toString()
 * // '10.123457'
 * ```
 *
 * @example
 * ```ts
 * const A = QuotaPrice.create('10')
 * const B = QuotaPrice.create('10.000000')
 *
 * QuotaPrice.equals(A, B)
 * // true
 * ```
 */
export class QuotaPrice {
  private readonly props: QuotaPriceProps;

  /**
   * Returns the quota price value.
   */
  get value(): Decimal {
    return this.props.value;
  }

  /**
   * Creates a `QuotaPrice`.
   *
   * The constructor is private to ensure that all instances
   * are created through {@link QuotaPrice.create} and
   * therefore satisfy the value object's invariants.
   */
  private constructor(props: QuotaPriceProps) {
    this.props = props;
  }

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
   * @throws {ValidationError} If `value` is `undefined` or `null`.
   * @throws {ValidationError} If `value` is less than `0`.
   *
   * @example
   * ```ts
   * const PRICE = QuotaPrice.create('12.3456789')
   *
   * PRICE.value.toString()
   * // '12.345679'
   * ```
   *
   * @example
   * ```ts
   * const PRICE = QuotaPrice.create(12.345678)
   *
   * PRICE.value.toString()
   * // '12.345678'
   * ```
   */
  public static create(value: Decimal.Value): QuotaPrice {
    if (value === undefined || value === null) {
      throw new ValidationError("`QuotaPrice` must be defined.");
    }

    const DECIMAL_VALUE = new Decimal(value);

    if (DECIMAL_VALUE.lessThan(0)) {
      throw new ValidationError(
        "`QuotaPrice` must be equal or greater than 0.",
      );
    }

    return new QuotaPrice({
      value: DECIMAL_VALUE.toDecimalPlaces(PRICE_DECIMAL_PLACES, ROUNDING_MODE),
    });
  }

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
   * ```ts
   * const A = QuotaPrice.create('10')
   * const B = QuotaPrice.create('10.000000')
   *
   * QuotaPrice.equals(A, B)
   * // true
   * ```
   */
  public static equals(a: QuotaPrice, b: QuotaPrice): boolean {
    return a.value.equals(b.value);
  }
}
