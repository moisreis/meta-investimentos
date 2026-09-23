import Decimal from "decimal.js"
import {
  PERCENTAGE_DECIMAL_PLACES,
  ROUNDING_MODE,
} from "@constants/value-objects/rounding.constant"
import { ValidationError } from "@/errors"

interface SignedPercentageProps {
  value: Decimal
}

/**
 * @summary
 * Encapsulates and validates a **SignedPercentage** value.
 *
 * @remarks
 * Uses **Decimal.js** to handle high-precision operations.
 * Allows positive, negative, or zero values and rounds using
 * **PERCENTAGE_DECIMAL_PLACES**.
 *
 * @explanation
 * Use this domain value object to model signed percentages
 * such as returns, variations, or rates. It ensures all
 * percentage values are valid and consistently formatted. Apply
 * it in financial domains where percentages can be negative.
 *
 * @param props - Internal properties container.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-23
 */
export class SignedPercentage {
  private readonly props: SignedPercentageProps

  // Gets the underlying Decimal signed percentage value.
  get value(): Decimal {
    return this.props.value
  }

  // Returns true if the percentage is negative.
  get isNegative(): boolean {
    return this.props.value.isNegative()
  }

  // Returns true if the percentage is positive (greater than zero).
  get isPositive(): boolean {
    return this.props.value.isPositive() && !this.props.value.isZero()
  }

  // Returns true if the percentage is zero.
  get isZero(): boolean {
    return this.props.value.isZero()
  }

  // Initializes internal properties for SignedPercentage.
  private constructor(props: SignedPercentageProps) {
    this.props = props
  }

  /**
   * @summary
   * Creates and validates a new **SignedPercentage** instance.
   *
   * @remarks
   * Converts the input to a **Decimal** instance and applies
   * system precision and rounding configurations. Allows
   * positive, negative, or zero values.
   *
   * @explanation
   * Factory method to construct a valid **SignedPercentage**.
   * Throws a **ValidationError** if the provided input is
   * missing or non-finite. Call it when converting raw numeric
   * percentages to domain values where sign matters.
   *
   * @param value - Numerical value to construct the percentage.
   * @returns Validated SignedPercentage instance.
   *
   * @example
   * const PERCENTAGE = SignedPercentage.create("12.34");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  public static create(value: Decimal.Value): SignedPercentage {
    if (value === undefined || value === null) {
      throw new ValidationError("`SignedPercentage` must be defined.")
    }

    let DECIMAL_VALUE: Decimal

    try {
      DECIMAL_VALUE = new Decimal(value)
    } catch {
      throw new ValidationError("`SignedPercentage` must be a valid number.")
    }

    if (!DECIMAL_VALUE.isFinite()) {
      throw new ValidationError("`SignedPercentage` must be a finite number.")
    }

    return new SignedPercentage({
      value: DECIMAL_VALUE.toDecimalPlaces(
        PERCENTAGE_DECIMAL_PLACES,
        ROUNDING_MODE
      ),
    })
  }

  /**
   * @summary
   * Compares two **SignedPercentage** instances for equality.
   *
   * @remarks
   * Performs equality evaluation using **Decimal.js**.
   *
   * @explanation
   * Use this method to check whether two signed percentages
   * carry equivalent mathematical values. Call it when comparing
   * percentages in domain logic or tests.
   *
   * @param a - First **SignedPercentage** instance to compare.
   * @param b - Second **SignedPercentage** instance to compare.
   * @returns True if values are equal.
   *
   * @example
   * const IS_SAME = SignedPercentage.equals(percentA, percentB);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-23
   */
  public static equals(a: SignedPercentage, b: SignedPercentage): boolean {
    return a.value.equals(b.value)
  }
}