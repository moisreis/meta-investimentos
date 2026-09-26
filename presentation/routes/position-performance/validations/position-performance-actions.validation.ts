import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"
import { DATE_SCHEMA } from "@/lib/validation/date.validation"

// Longest period accepted by the start calculation action,
// in calendar days.
const MAX_CALCULATION_DAYS = 366

// Milliseconds in a single calendar day.
const DAY_MS = 24 * 60 * 60 * 1000

// Counts the inclusive calendar days between two day keys.
function CountDays(from: string, to: string): number {
  const FROM = new Date(`${from}T00:00:00.000Z`)
  const TO = new Date(`${to}T00:00:00.000Z`)

  return Math.round((TO.getTime() - FROM.getTime()) / DAY_MS) + 1
}

// The payload accepted by the start position performance
// calculation action. A null position id means every
// position of the session user, which is never read from
// here: the acting user comes from the resolved session.
const START_POSITION_PERFORMANCE_CALCULATION_SCHEMA = z
  .object({
    positionId: ID_SCHEMA.nullable(),
    from: DATE_SCHEMA,
    to: DATE_SCHEMA,
  })
  .refine((values) => values.from <= values.to, {
    message: "O início do período deve ser anterior ao fim.",
    path: ["from"],
  })
  .refine(
    (values) =>
      CountDays(values.from, values.to) <= MAX_CALCULATION_DAYS,
    {
      message:
        "O período é muito longo. Reduza para até 366 dias.",
      path: ["to"],
    }
  )

// Values of the start position performance calculation
// action payload.
type StartPositionPerformanceCalculationValues = z.infer<
  typeof START_POSITION_PERFORMANCE_CALCULATION_SCHEMA
>

// The payload accepted by the get position performance
// calculation progress action.
const GET_POSITION_PERFORMANCE_CALCULATION_PROGRESS_SCHEMA =
  z.object({
    jobId: ID_SCHEMA,
  })

// Values of the get position performance calculation
// progress action payload.
type GetPositionPerformanceCalculationProgressValues = z.infer<
  typeof GET_POSITION_PERFORMANCE_CALCULATION_PROGRESS_SCHEMA
>

export {
  GET_POSITION_PERFORMANCE_CALCULATION_PROGRESS_SCHEMA,
  START_POSITION_PERFORMANCE_CALCULATION_SCHEMA,
  type GetPositionPerformanceCalculationProgressValues,
  type StartPositionPerformanceCalculationValues,
}
