import Decimal from "decimal.js"

// Global rounding mode configuration for Decimal operations.
export const ROUNDING_MODE = Decimal.ROUND_HALF_UP

// Decimal precision limit for monetary values.
export const MONEY_DECIMAL_PLACES = 2

// Decimal precision limit for percentage values.
export const PERCENTAGE_DECIMAL_PLACES = 2

// Decimal precision limit for unit prices.
export const PRICE_DECIMAL_PLACES = 6

// Decimal precision limit for product quantities.
export const QUANTITY_DECIMAL_PLACES = 6

// Decimal precision limit for calculation factors.
export const FACTOR_DECIMAL_PLACES = 8
