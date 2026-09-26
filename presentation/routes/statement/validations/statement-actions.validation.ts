import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

import { GENERATE_STATEMENT_SCHEMA as GENERATE_STATEMENT_FORM_SCHEMA } from "./generate-statement.validations"

// The payload accepted by the generate statement action. The
// form and the action share this schema, so the month key and
// the portfolio id are checked the same way on both sides.
// The generating user is never read from here: it comes from
// the resolved session.
const GENERATE_STATEMENT_SCHEMA = GENERATE_STATEMENT_FORM_SCHEMA

// Values of the generate statement action payload.
type GenerateStatementValues = z.infer<
  typeof GENERATE_STATEMENT_SCHEMA
>

// The payload accepted by the delete statement action.
const DELETE_STATEMENT_SCHEMA = z.object({
  statementId: ID_SCHEMA,
})

// Values of the delete statement action payload.
type DeleteStatementValues = z.infer<
  typeof DELETE_STATEMENT_SCHEMA
>

// The payload accepted by the bulk delete statements action.
const BULK_DELETE_STATEMENTS_SCHEMA = z.object({
  statementIds: z
    .array(ID_SCHEMA)
    .min(1, "Selecione ao menos um relatório.")
    .max(500, "Selecione menos de 500 relatórios."),
})

// Values of the bulk delete statements action payload.
type BulkDeleteStatementsValues = z.infer<
  typeof BULK_DELETE_STATEMENTS_SCHEMA
>

export {
  BULK_DELETE_STATEMENTS_SCHEMA,
  DELETE_STATEMENT_SCHEMA,
  GENERATE_STATEMENT_SCHEMA,
  type BulkDeleteStatementsValues,
  type DeleteStatementValues,
  type GenerateStatementValues,
}
