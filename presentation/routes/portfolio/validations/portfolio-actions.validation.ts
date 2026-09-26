import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"
import { DATE_SCHEMA } from "@/lib/validation/date.validation"

import { PORTFOLIO_FORM_SCHEMA } from "./portfolio-form.validations"

// The payload accepted by the create portfolio action. The
// form and the action share this schema, so the client check
// and the server check can never drift apart.
const CREATE_PORTFOLIO_SCHEMA = PORTFOLIO_FORM_SCHEMA

// Values of the create portfolio action payload.
type CreatePortfolioValues = z.infer<
  typeof CREATE_PORTFOLIO_SCHEMA
>

// The payload accepted by the update portfolio action.
const UPDATE_PORTFOLIO_SCHEMA = PORTFOLIO_FORM_SCHEMA.extend({
  portfolioId: ID_SCHEMA,
})

// Values of the update portfolio action payload.
type UpdatePortfolioValues = z.infer<
  typeof UPDATE_PORTFOLIO_SCHEMA
>

// The payload accepted by the delete portfolio action.
const DELETE_PORTFOLIO_SCHEMA = z.object({
  portfolioId: ID_SCHEMA,
})

// Values of the delete portfolio action payload.
type DeletePortfolioValues = z.infer<
  typeof DELETE_PORTFOLIO_SCHEMA
>

// The payload accepted by the bulk delete portfolios action.
const BULK_DELETE_PORTFOLIOS_SCHEMA = z.object({
  portfolioIds: z
    .array(ID_SCHEMA)
    .min(1, "Selecione ao menos uma carteira.")
    .max(200, "Selecione menos de 200 carteiras."),
})

// Values of the bulk delete portfolios action payload.
type BulkDeletePortfoliosValues = z.infer<
  typeof BULK_DELETE_PORTFOLIOS_SCHEMA
>

// The payload accepted by the list portfolio performance
// action. The boundaries are inclusive UTC day keys.
const LIST_PORTFOLIO_PERFORMANCE_SCHEMA = z.object({
  from: DATE_SCHEMA,
  to: DATE_SCHEMA,
})

// Values of the list portfolio performance action payload.
type ListPortfolioPerformanceValues = z.infer<
  typeof LIST_PORTFOLIO_PERFORMANCE_SCHEMA
>

// The payload accepted by the get portfolio period returns
// action. The boundaries are inclusive UTC day keys.
const GET_PORTFOLIO_PERIOD_RETURNS_SCHEMA = z.object({
  portfolioId: ID_SCHEMA,
  from: DATE_SCHEMA,
  to: DATE_SCHEMA,
})

// Values of the get portfolio period returns action
// payload.
type GetPortfolioPeriodReturnsValues = z.infer<
  typeof GET_PORTFOLIO_PERIOD_RETURNS_SCHEMA
>

export {
  BULK_DELETE_PORTFOLIOS_SCHEMA,
  CREATE_PORTFOLIO_SCHEMA,
  DELETE_PORTFOLIO_SCHEMA,
  GET_PORTFOLIO_PERIOD_RETURNS_SCHEMA,
  LIST_PORTFOLIO_PERFORMANCE_SCHEMA,
  UPDATE_PORTFOLIO_SCHEMA,
  type BulkDeletePortfoliosValues,
  type CreatePortfolioValues,
  type DeletePortfolioValues,
  type GetPortfolioPeriodReturnsValues,
  type ListPortfolioPerformanceValues,
  type UpdatePortfolioValues,
}
