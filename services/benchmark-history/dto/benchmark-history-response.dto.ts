import type { EntityId, SignedPercentage } from "@/value-objects"

/**
 * @summary
 * Represents the shape of the benchmark history response.
 *
 * @remarks
 * This DTO is the format of the response for benchmark
 * history queries and mutations.
 *
 * @explanation
 * Use this DTO when exposing a benchmark rate entry to
 * the consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(HISTORY_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface BenchmarkHistoryResponseDTO {
  id: EntityId
  benchmarkId: EntityId
  date: Date
  rate: SignedPercentage
  createdAt: Date
}
