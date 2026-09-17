import Decimal from "decimal.js"
import {
  FACTOR_DECIMAL_PLACES,
  ROUNDING_MODE,
} from "@constants/value-objects/rounding.constant"
import { ValidationError } from "@/errors"

interface GrowthFactorProps {
  value: Decimal
}

/**
 * @summary
 * Encapsulates and validates a numerical **GrowthFactor**.
 *
 * @remarks
 * Uses **Decimal.js** to handle high-precision operations.
 * Enforces non-negative constraints and rounds values using
 * **FACTOR_DECIMAL_PLACES**.
 *
 * @explanation
 * Use this domain value object to model compound growth,
 * financial multipliers, or percentage variation bases.
 *
 * @param props - Internal properties container.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class GrowthFactor {
  private readonly props: GrowthFactorProps

  // Gets the underlying Decimal growth factor value.
  get value(): Decimal {
    return this.props.value
  }

  // Returns true if the growth factor represents a loss.
  get isLoss(): boolean {
    return this.props.value.lessThan(1)
  }

  // Returns true if the growth factor represents a gain.
  get isGain(): boolean {
    return this.props.value.greaterThan(1)
  }

  // Returns true if the growth factor represents no change.
  get isFlat(): boolean {
    return this.props.value.equals(1)
  }

  // Initializes internal properties for GrowthFactor.
  private constructor(props: GrowthFactorProps) {
    this.props = props
  }

  /**
   * @summary
   * Creates and validates a new **GrowthFactor** instance.
   *
   * @remarks
   * Converts the input to a **Decimal** instance and applies
   * system precision and rounding configurations.
   *
   * @explanation
   * Factory method to construct a valid **GrowthFactor**.
   * Throws a **ValidationError** if the provided input is
   * missing, non-finite, or less than zero.
   *
   * @param value - Numerical value to construct the factor.
   *
   * @returns Validated GrowthFactor instance.
   *
   * @example
   * const factor = GrowthFactor.create(1.05);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(value: Decimal.Value): GrowthFactor {
    if (value === undefined || value === null) {
      throw new ValidationError("`GrowthFactor` must be defined.")
    }

    let DECIMAL_VALUE: Decimal

    try {
      DECIMAL_VALUE = new Decimal(value)
    } catch {
      throw new ValidationError("`GrowthFactor` must be a valid number.")
    }

    if (!DECIMAL_VALUE.isFinite()) {
      throw new ValidationError("`GrowthFactor` must be a finite number.")
    }

    if (DECIMAL_VALUE.lessThan(0)) {
      throw new ValidationError(
        "`GrowthFactor` must be equal or greater than 0."
      )
    }

    return new GrowthFactor({
      value: DECIMAL_VALUE.toDecimalPlaces(
        FACTOR_DECIMAL_PLACES,
        ROUNDING_MODE
      ),
    })
  }

  /**
   * @summary
   * Compares two **GrowthFactor** instances for equality.
   *
   * @remarks
   * Performs equality evaluation using **Decimal.js**.
   *
   * @explanation
   * Use this method to check whether two growth factors carry
   * equivalent mathematical values.
   *
   * @param a - First **GrowthFactor** instance to compare.
   * @param b - Second **GrowthFactor** instance to compare.
   *
   * @returns True if both instances are mathematically equal.
   *
   * @example
   * const isSame = GrowthFactor.equals(factorA, factorB);
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static equals(a: GrowthFactor, b: GrowthFactor): boolean {
    return a.value.equals(b.value)
  }

  /**
   * @summary
   * Converts the growth factor into a percentage value.
   *
   * @remarks
   * Computes `(value - 1) * 100` using **Decimal.js**.
   *
   * @explanation
   * Converts the growth factor ratio into a relative percent
   * change value suitable for display or financial reports.
   *
   * @returns Calculated percentage Decimal value.
   *
   * @example
   * const percent = factor.toPercentage();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  toPercentage(): Decimal {
    return this.props.value.minus(1).times(100)
  }
}
