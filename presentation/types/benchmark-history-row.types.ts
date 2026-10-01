/**
 * @summary
 * Benchmark history row rendered by the presentation layer.
 *
 * @remarks
 * Projects the benchmark history read model onto the fields
 * the screens actually render, attaching the benchmark name
 * and acronym for display. The `createdAt` field stays in the
 * service layer.
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
export interface BenchmarkHistoryRow {
  id: string
  benchmarkId: string
  benchmarkName: string
  benchmarkAcronym: string
  date: string
  rate: string
}
