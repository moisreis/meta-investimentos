/**
 * @summary
 * Defines the payload for creating a `BenchmarkHistory`.
 *
 * @remarks
 * The rate may be positive or negative and is a decimal
 * string; the date is ISO 8601.
 *
 * @explanation
 * Use this DTO to register a benchmark rate for a date
 * through the service layer.
 *
 * @example
 * const DTO: CreateBenchmarkHistoryDTO = {
 *   benchmarkId: "benchmark-1",
 *   date: "2026-01-01T00:00:00.000Z",
 *   rate: "0.5",
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateBenchmarkHistoryDTO {
  benchmarkId: string
  date: string
  rate: string
}
