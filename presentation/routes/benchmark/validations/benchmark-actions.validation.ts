import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

import { BENCHMARK_FORM_SCHEMA } from "./benchmark-form.validation"

/**
 * @summary
 * The payload accepted by the create benchmark action. The
 * form and the action share this schema, so the client check
 * and the server check can never drift apart.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
const CREATE_BENCHMARK_SCHEMA = BENCHMARK_FORM_SCHEMA

// Values of the create benchmark action payload.
type CreateBenchmarkValues = z.infer<
  typeof CREATE_BENCHMARK_SCHEMA
>

// The payload accepted by the update benchmark action.
const UPDATE_BENCHMARK_SCHEMA = BENCHMARK_FORM_SCHEMA.extend({
  benchmarkId: ID_SCHEMA,
})

// Values of the update benchmark action payload.
type UpdateBenchmarkValues = z.infer<
  typeof UPDATE_BENCHMARK_SCHEMA
>

export {
  CREATE_BENCHMARK_SCHEMA,
  UPDATE_BENCHMARK_SCHEMA,
  type CreateBenchmarkValues,
  type UpdateBenchmarkValues,
}
