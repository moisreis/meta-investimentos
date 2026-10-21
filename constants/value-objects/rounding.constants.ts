import Decimal from "decimal.js"

// Global rounding mode configuration for Decimal operations.
export const ROUNDING_MODE = Decimal.ROUND_HALF_UP

// Rounding mode used for quota quantities. Fund administrators
// truncate quota quantities to six decimal places when they
// convert a monetary amount into quotas, so the app must do the
// same to reconcile with the published account statements.
export const QUANTITY_ROUNDING_MODE = Decimal.ROUND_DOWN

// Decimal precision limit for monetary values.
export const MONEY_DECIMAL_PLACES = 2

// Decimal precision limit for percentage values.
export const PERCENTAGE_DECIMAL_PLACES = 2

// Decimal precision limit for unit prices.
export const PRICE_DECIMAL_PLACES = 9

// Decimal precision limit for product quantities.
export const QUANTITY_DECIMAL_PLACES = 6

// Decimal precision limit for calculation factors.
export const FACTOR_DECIMAL_PLACES = 8
