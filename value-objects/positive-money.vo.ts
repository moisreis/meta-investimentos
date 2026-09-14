import Decimal from "decimal.js";
import {
  MONEY_DECIMAL_PLACES,
  ROUNDING_MODE,
} from "@constants/value-objects/rounding.constant";
import { ValidationError } from "@/errors";

interface PositiveMoneyProps {
  value: Decimal
}

/**
 * @summary
 * Encapsulates and validates a non-negative **PositiveMoney** amount.
 *
 * @remarks
 * Uses **Decimal.js** to handle high-precision operations.
 * Enforces non-negative constraints and rounds values using
 * **MONEY_DECIMAL_PLACES**.
 *
 * @explanation
 * Use this domain value object to model positive monetary
 * amounts such as prices, balances, or payments. It ensures
 * all monetary values are valid and consistently formatted.
 *
 * @param props - Internal properties container.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class PositiveMoney {
  private readonly props: PositiveMoneyProps;

  // Gets the underlying Decimal positive monetary amount value.
  get value(): Decimal {
    return this.props.value;
  }

  // Initializes internal properties for PositiveMoney.
  private constructor(props: PositiveMoneyProps) {
    this.props = props;
  }

  /**
   * @summary
   * Creates and validates a new **PositiveMoney** instance.
   *
   * @remarks
   * Converts the input to a **Decimal** instance and applies
   * system precision and rounding configurations.
   *
   * @explanation
   * Factory method to construct a valid **PositiveMoney**.
   * Throws a **ValidationError** if the provided input is
   * missing or less than zero.
   *
   * @param value - Numerical value to construct the amount.
   *
   * @returns Validated PositiveMoney instance.
   *
   * @example
   * const MONEY = PositiveMoney.create("10.50");
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(value: Decimal.Value): PositiveMoney {
    if (value === undefined || value === null) {
      throw new ValidationError("`PositiveMoney` must be defined.");
    }

    let DECIMAL_VALUE: Decimal;

    try {
      DECIMAL_VALUE = new Decimal(value);
    } catch {
      throw new ValidationError("`PositiveMoney` must be a valid number.");
    }

    if (DECIMAL_VALUE.lessThan(0)) {
      throw new ValidationError(
        "`PositiveMoney` must be equal or greater than 0.",
      );
    }

    return new PositiveMoney({
      value: DECIMAL_VALUE.toDecimalPlaces(MONEY_DECIMAL_PLACES, ROUNDING_MODE),
    });
  }

  /**
   * @summary
   * Compares two **PositiveMoney** instances for equality.
   *
   * @remarks
   * Performs equality evaluation using **Decimal.js**.
   *
   * @explanation
   * Use this method to check whether two positive money amounts
   * carry equivalent mathematical values.
   *
   * @param a - First **PositiveMoney** instance to compare.
   * @param b - Second **PositiveMoney** instance to compare.
   *
   * @returns True if both instances are mathematically equal.
   *
   * @example
   * const IS_SAME = PositiveMoney.equals(moneyA, moneyB);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static equals(a: PositiveMoney, b: PositiveMoney): boolean {
    return a.value.equals(b.value);
  }
}