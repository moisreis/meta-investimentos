import Decimal from "decimal.js";
import {
  PRICE_DECIMAL_PLACES,
  ROUNDING_MODE,
} from "@constants/value-objects/rounding.constant";
import { ValidationError } from "@/errors";

interface QuotaPriceProps {
  value: Decimal
}

/**
 * @summary
 * Encapsulates and validates a non-negative **QuotaPrice** amount.
 *
 * @remarks
 * Uses **Decimal.js** to handle high-precision operations.
 * Enforces non-negative constraints and rounds values using
 * **PRICE_DECIMAL_PLACES**.
 *
 * @explanation
 * Use this domain value object to model quota prices in
 * financial calculations. It ensures all quota price values
 * are valid and consistently formatted.
 *
 * @param props - Internal properties container.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class QuotaPrice {
  private readonly props: QuotaPriceProps;

  // Gets the underlying Decimal quota price value.
  get value(): Decimal {
    return this.props.value;
  }

  // Initializes internal properties for QuotaPrice.
  private constructor(props: QuotaPriceProps) {
    this.props = props;
  }

  /**
   * @summary
   * Creates and validates a new **QuotaPrice** instance.
   *
   * @remarks
   * Converts the input to a **Decimal** instance and applies
   * system precision and rounding configurations.
   *
   * @explanation
   * Factory method to construct a valid **QuotaPrice**.
   * Throws a **ValidationError** if the provided input is
   * missing or less than zero.
   *
   * @param value - Numerical value to construct the price.
   *
   * @returns Validated QuotaPrice instance.
   *
   * @example
   * const PRICE = QuotaPrice.create("10.123456");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(value: Decimal.Value): QuotaPrice {
    if (value === undefined || value === null) {
      throw new ValidationError("`QuotaPrice` must be defined.");
    }

    let DECIMAL_VALUE: Decimal;

    try {
      DECIMAL_VALUE = new Decimal(value);
    } catch {
      throw new ValidationError("`QuotaPrice` must be a valid number.");
    }

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
   * @summary
   * Compares two **QuotaPrice** instances for equality.
   *
   * @remarks
   * Performs equality evaluation using **Decimal.js**.
   *
   * @explanation
   * Use this method to check whether two quota prices carry
   * equivalent mathematical values.
   *
   * @param a - First **QuotaPrice** instance to compare.
   * @param b - Second **QuotaPrice** instance to compare.
   *
   * @returns True if both instances are mathematically equal.
   *
   * @example
   * const IS_SAME = QuotaPrice.equals(priceA, priceB);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static equals(a: QuotaPrice, b: QuotaPrice): boolean {
    return a.value.equals(b.value);
  }
}