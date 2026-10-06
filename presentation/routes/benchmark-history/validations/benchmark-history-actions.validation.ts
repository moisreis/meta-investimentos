import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

import { BENCHMARK_HISTORY_FORM_SCHEMA } from "./benchmark-history-form.validation"

/**
 * @summary
 * The payload accepted by the record rate action. The form
 * and the action share this schema, so the client check and
 * the server check can never drift apart.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
const CREATE_BENCHMARK_HISTORY_SCHEMA =
  BENCHMARK_HISTORY_FORM_SCHEMA

// Values of the record rate action payload.
type CreateBenchmarkHistoryValues = z.infer<
  typeof CREATE_BENCHMARK_HISTORY_SCHEMA
>

/**
 * @summary
 * The payload accepted by the update rate action. The entry id
 * joins the record rate schema, so a correction is validated by
 * exactly the rules a first registration is.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
const UPDATE_BENCHMARK_HISTORY_SCHEMA =
  BENCHMARK_HISTORY_FORM_SCHEMA.extend({
    benchmarkHistoryId: ID_SCHEMA,
  })

// Values of the update rate action payload.
type UpdateBenchmarkHistoryValues = z.infer<
  typeof UPDATE_BENCHMARK_HISTORY_SCHEMA
>

/**
 * @summary
 * The payload accepted by the delete rate action. A delete
 * names the row and nothing else.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
const DELETE_BENCHMARK_HISTORY_SCHEMA = z.object({
  benchmarkHistoryId: ID_SCHEMA,
})

// Values of the delete rate action payload.
type DeleteBenchmarkHistoryValues = z.infer<
  typeof DELETE_BENCHMARK_HISTORY_SCHEMA
>

export {
  CREATE_BENCHMARK_HISTORY_SCHEMA,
  DELETE_BENCHMARK_HISTORY_SCHEMA,
  UPDATE_BENCHMARK_HISTORY_SCHEMA,
  type CreateBenchmarkHistoryValues,
  type DeleteBenchmarkHistoryValues,
  type UpdateBenchmarkHistoryValues,
}
