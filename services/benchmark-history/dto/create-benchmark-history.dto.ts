import type { EntityId, SignedPercentage } from "@/value-objects"

/**
 * @summary
 * Defines the payload for creating a `BenchmarkHistory`.
 *
 * @remarks
 * The rate may be positive or negative.
 *
 * @explanation
 * Use this DTO to register a benchmark rate for a date
 * through the service layer.
 *
 * @example
 * const DTO: CreateBenchmarkHistoryDTO = {
 *   benchmarkId: EntityId.create("benchmark-1"),
 *   date: new Date("2026-01-01"),
 *   rate: SignedPercentage.create("0.5"),
 * };
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface CreateBenchmarkHistoryDTO {
  benchmarkId: EntityId
  date: Date
  rate: SignedPercentage
}
