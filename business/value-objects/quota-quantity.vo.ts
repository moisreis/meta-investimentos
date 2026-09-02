import Decimal from "decimal.js";
import {
  QUANTITY_DECIMAL_PLACES,
  ROUNDING_MODE,
} from "@/business/value-objects/rounding";
import { ValidationError } from "@/shared/errors";

/**
 * Represents a non-negative quota quantity.
 *
 * The code stores the quantity as a {@link Decimal} to keep
 * full precision during quota calculations.
 *
 * The code normalizes the value to a maximum of 6 decimal
 * places when it creates the quantity.
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
 * const QUANTITY = QuotaQuantity.create('10.123456789')
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
export class QuotaQuantity {
  private readonly props: QuotaQuantityProps;

  /**
   * Returns the quota quantity value.
   */
  get value(): Decimal {
    return this.props.value;
  }

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

  /**
   * Creates a valid `QuotaQuantity` from a decimal-compatible value.
   *
   * The code accepts any value that {@link Decimal.Value}
   * accepts. The value must be defined. The value cannot be
   * negative.
   *
   * The code converts the value to a {@link Decimal} and
   * rounds it to a maximum of 6 decimal places.
   *
   * @param value - The decimal-compatible quota quantity to create.
   * @returns A valid `QuotaQuantity` instance.
   *
   * @throws {ValidationError} If `value` is `undefined` or `null`.
   * @throws {ValidationError} If `value` is less than `0`.
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
      throw new ValidationError("`QuotaQuantity` must be defined.");
    }

    const decimalValue = new Decimal(value);

    if (decimalValue.lessThan(0)) {
      throw new ValidationError(
        "`QuotaQuantity` must be equal or greater than 0.",
      );
    }

    return new QuotaQuantity({
      value: decimalValue.toDecimalPlaces(
        QUANTITY_DECIMAL_PLACES,
        ROUNDING_MODE,
      ),
    });
  }

  /**
   * Determines whether two `QuotaQuantity` instances
   * represent the same value.
   *
   * @param a - The first quota quantity.
   * @param b - The second quota quantity.
   * @returns `true` when both quantities have equal values;
   *          otherwise, `false`.
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
