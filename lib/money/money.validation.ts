import { z } from "zod"

import { IsValidMoney, NormalizeMoney } from "./money.validator"

// A money amount as the user types it, in the pt-BR shape.
// Refine the result to add a magnitude rule, such as a
// positive amount or a maximum.
const MONEY_SCHEMA = z
  .string()
  .trim()
  .min(1, "Informe o valor.")
  .refine(IsValidMoney, { message: "Informe um valor válido." })

// A money amount, always positive. Use for the amounts a
// user applies, applies to, or withdraws.
const POSITIVE_MONEY_SCHEMA = MONEY_SCHEMA.refine(
  (value) => Number(NormalizeMoney(value)) > 0,
  { message: "Informe um valor maior que zero." }
)

export { MONEY_SCHEMA, POSITIVE_MONEY_SCHEMA }
