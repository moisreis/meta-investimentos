import Decimal from "decimal.js"
import {
  QUANTITY_DECIMAL_PLACES,
  ROUNDING_MODE,
} from "@/constants/value-objects/rounding.constants"
import { ValidationError } from "@/errors"

interface QuotaQuantityProps {
  value: Decimal
}

/**
 * @summary
 * Encapsulates and validates a non-negative **QuotaQuantity** amount.
 *
 * @remarks
 * Uses **Decimal.js** to handle high-precision operations.
 * Enforces non-negative constraints and rounds values using
 * **QUANTITY_DECIMAL_PLACES**.
 *
 * @explanation
 * Use this domain value object to model quota quantities in
 * financial calculations. It ensures all quota quantity values
 * are valid and consistently formatted. Apply it in investment
 * domains where quota holdings require specific precision.
 *
 * @param props - Internal properties container.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export class QuotaQuantity {
  private readonly props: QuotaQuantityProps

  // Gets the underlying Decimal quota quantity value.
  get value(): Decimal {
    return this.props.value
  }

  // Initializes internal properties for QuotaQuantity.
  private constructor(props: QuotaQuantityProps) {
    this.props = props
  }

  /**
   * @summary
   * Creates and validates a new **QuotaQuantity** instance.
   *
   * @remarks
   * Converts the input to a **Decimal** instance and applies
   * system precision and rounding configurations.
   *
   * @explanation
   * Factory method to construct a valid **QuotaQuantity**.
   * Throws a **ValidationError** if the provided input is
   * missing, non-finite, or less than zero. Call it when
   * converting raw numeric quantities to domain values.
   *
   * @param value - Numerical value to construct the quantity.
   * @returns Validated QuotaQuantity instance.
   *
   * @example
   * const QUANTITY = QuotaQuantity.create("10.123456");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  public static create(value: Decimal.Value): QuotaQuantity {
    if (value === undefined || value === null) {
      throw new ValidationError("`QuotaQuantity` must be defined.")
    }

    let DECIMAL_VALUE: Decimal

    try {
      DECIMAL_VALUE = new Decimal(value)
    } catch {
      throw new ValidationError("`QuotaQuantity` must be a valid number.")
    }

    if (!DECIMAL_VALUE.isFinite()) {
      throw new ValidationError("`QuotaQuantity` must be a finite number.")
    }

    if (DECIMAL_VALUE.lessThan(0)) {
      throw new ValidationError(
        "`QuotaQuantity` must be equal or greater than 0."
      )
    }

    return new QuotaQuantity({
      value: DECIMAL_VALUE.toDecimalPlaces(
        QUANTITY_DECIMAL_PLACES,
        ROUNDING_MODE
      ),
    })
  }

  /**
   * @summary
   * Compares two **QuotaQuantity** instances for equality.
   *
   * @remarks
   * Performs equality evaluation using **Decimal.js**.
   *
   * @explanation
   * Use this method to check whether two quota quantities carry
   * equivalent mathematical values. Call it when comparing
   * quantities in domain logic or tests.
   *
   * @param a - First **QuotaQuantity** instance to compare.
   * @param b - Second **QuotaQuantity** instance to compare.
   * @returns True if values are equal.
   *
   * @example
   * const IS_SAME = QuotaQuantity.equals(quantityA, quantityB);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  public static equals(a: QuotaQuantity, b: QuotaQuantity): boolean {
    return a.value.equals(b.value)
  }
}