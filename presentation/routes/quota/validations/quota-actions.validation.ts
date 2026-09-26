import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

// The import windows the CVM import understands. A payload
// carrying anything else never reaches the import plan
// builder, so a crafted request cannot ask for an unbounded
// period.
const CVM_IMPORT_WINDOW_SCHEMA = z.enum(
  [
    "today",
    "week",
    "month",
    "year-to-date",
    "last-2-months",
    "last-6-months",
  ],
  { error: "Período de importação inválido." }
)

// The payload accepted by the start quota import action.
const START_QUOTA_IMPORT_SCHEMA = z.object({
  window: CVM_IMPORT_WINDOW_SCHEMA,
})

// Values of the start quota import action payload.
type StartQuotaImportValues = z.infer<
  typeof START_QUOTA_IMPORT_SCHEMA
>

// The payload accepted by the get quota import progress
// action.
const GET_QUOTA_IMPORT_PROGRESS_SCHEMA = z.object({
  jobId: ID_SCHEMA,
})

// Values of the get quota import progress action payload.
type GetQuotaImportProgressValues = z.infer<
  typeof GET_QUOTA_IMPORT_PROGRESS_SCHEMA
>

export {
  CVM_IMPORT_WINDOW_SCHEMA,
  GET_QUOTA_IMPORT_PROGRESS_SCHEMA,
  START_QUOTA_IMPORT_SCHEMA,
  type GetQuotaImportProgressValues,
  type StartQuotaImportValues,
}
