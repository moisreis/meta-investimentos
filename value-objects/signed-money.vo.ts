import Decimal from "decimal.js"
import {
  MONEY_DECIMAL_PLACES,
  ROUNDING_MODE,
} from "@constants/value-objects/rounding.constant"
import { ValidationError } from "@/errors"

interface SignedMoneyProps {
  value: Decimal
}

/**
 * @summary
 * Encapsulates and validates a **SignedMoney** amount.
 *
 * @remarks
 * Uses **Decimal.js** to handle high-precision operations.
 * Allows positive, negative, or zero values and rounds using
 * **MONEY_DECIMAL_PLACES**.
 *
 * @explanation
 * Use this domain value object to model signed monetary amounts
 * such as profits, losses, or balance changes. It ensures all
 * monetary values are valid and consistently formatted.
 *
 * @param props - Internal properties container.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class SignedMoney {
  private readonly props: SignedMoneyProps

  // Gets the underlying Decimal signed monetary amount value.
  get value(): Decimal {
    return this.props.value
  }

  // Returns true if the monetary amount is negative.
  get isNegative(): boolean {
    return this.props.value.isNegative()
  }

  // Returns true if the monetary amount is positive (greater than zero).
  get isPositive(): boolean {
    return this.props.value.isPositive() && !this.props.value.isZero()
  }

  // Returns true if the monetary amount is zero.
  get isZero(): boolean {
    return this.props.value.isZero()
  }

  // Initializes internal properties for SignedMoney.
  private constructor(props: SignedMoneyProps) {
    this.props = props
  }

  /**
   * @summary
   * Creates and validates a new **SignedMoney** instance.
   *
   * @remarks
   * Converts the input to a **Decimal** instance and applies
   * system precision and rounding configurations. Unlike
   * **PositiveMoney**, negative values are allowed.
   *
   * @explanation
   * Factory method to construct a valid **SignedMoney**.
   * Throws a **ValidationError** if the provided input is
   * missing or non-finite.
   *
   * @param value - Numerical value to construct the amount.
   *
   * @returns Validated SignedMoney instance.
   *
   * @example
   * const MONEY = SignedMoney.create("-10.50");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(value: Decimal.Value): SignedMoney {
    if (value === undefined || value === null) {
      throw new ValidationError("`SignedMoney` must be defined.")
    }

    let DECIMAL_VALUE: Decimal

    try {
      DECIMAL_VALUE = new Decimal(value)
    } catch {
      throw new ValidationError("`SignedMoney` must be a valid number.")
    }

    if (!DECIMAL_VALUE.isFinite()) {
      throw new ValidationError("`SignedMoney` must be a finite number.")
    }

    return new SignedMoney({
      value: DECIMAL_VALUE.toDecimalPlaces(MONEY_DECIMAL_PLACES, ROUNDING_MODE),
    })
  }

  /**
   * @summary
   * Compares two **SignedMoney** instances for equality.
   *
   * @remarks
   * Performs equality evaluation using **Decimal.js**.
   *
   * @explanation
   * Use this method to check whether two signed money amounts
   * carry equivalent mathematical values.
   *
   * @param a - First **SignedMoney** instance to compare.
   * @param b - Second **SignedMoney** instance to compare.
   *
   * @returns True if both instances are mathematically equal.
   *
   * @example
   * const IS_SAME = SignedMoney.equals(moneyA, moneyB);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static equals(a: SignedMoney, b: SignedMoney): boolean {
    return a.value.equals(b.value)
  }
}
