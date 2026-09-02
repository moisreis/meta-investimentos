import Decimal from "decimal.js";

/**
 * The rounding mode applied whenever a value object normalizes to a
 * fixed number of decimal places.
 *
 * All value objects round half-up, so ties round away from zero.
 */
export const ROUNDING_MODE = Decimal.ROUND_HALF_UP;

/**
 * The number of decimal places used to normalize monetary values
 * (`PositiveMoney` and `SignedMoney`).
 */
export const MONEY_DECIMAL_PLACES = 2;

/**
 * The number of decimal places used to normalize percentage values
 * (`SignedPercentage`).
 */
export const PERCENTAGE_DECIMAL_PLACES = 2;

/**
 * The number of decimal places used to normalize quota prices
 * (`QuotaPrice`).
 */
export const PRICE_DECIMAL_PLACES = 6;

/**
 * The number of decimal places used to normalize quota quantities
 * (`QuotaQuantity`).
 */
export const QUANTITY_DECIMAL_PLACES = 6;

/**
 * The number of decimal places used to normalize growth factors
 * (`GrowthFactor`).
 */
export const FACTOR_DECIMAL_PLACES = 8;
