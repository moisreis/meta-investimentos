import { z } from "zod"

// A calendar day, matching the `yyyy-MM-dd` contract of the
// shared date input and of the quota lookups.
const DATE_SCHEMA = z
  .string()
  .trim()
  .min(1, "Informe a data.")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.")

// A month, matching the `yyyy-MM` contract of the period
// filters.
const MONTH_SCHEMA = z
  .string()
  .trim()
  .min(1, "Informe o mês.")
  .regex(/^\d{4}-\d{2}$/, "Informe um mês válido.")

export { DATE_SCHEMA, MONTH_SCHEMA }
