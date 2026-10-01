/**
 * @summary
 * Benchmark row rendered by the presentation layer.
 *
 * @remarks
 * Projects the benchmark read model onto the fields
 * the screens actually render. The `createdAt` field
 * stays in the service layer.
 *
 * @explanation
 * Use this type in tables, dialogs, forms and hooks.
 * The route loader maps the response DTO into it, so
 * no view file depends on the service layer.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export interface BenchmarkRow {
  id: string
  acronym: string
  name: string
}
