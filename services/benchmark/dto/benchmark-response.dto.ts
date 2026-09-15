import type { EntityId } from "@/value-objects"

/**
 * @summary
 * Represents the shape of the benchmark response.
 *
 * @remarks
 * This DTO is the format of the response for benchmark
 * queries and mutations.
 *
 * @explanation
 * Use this DTO when exposing a benchmark to the
 * consumers of the service layer.
 *
 * @example
 * const RESPONSE = TO_RESPONSE_DTO(BENCHMARK_ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export interface BenchmarkResponseDTO {
  id: EntityId
  acronym: string
  name: string
  createdAt: Date
}
