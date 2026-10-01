import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"
import type { BenchmarkHistoryResponseDTO } from "@/services/benchmark-history/dto/benchmark-history-response.dto"

/**
 * @summary
 * Projects a benchmark history read model onto the benchmark history row.
 *
 * @remarks
 * Keeps the 6 fields the screens render and drops
 * `createdAt`, which stays in the service layer.
 * Attaches the benchmark name and acronym for display.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The benchmark history read model.
 * @param benchmark - The benchmark to attach, or null.
 *
 * @returns The benchmark history row.
 *
 * @example
 * const ROW = ToBenchmarkHistoryRow(DTO, BENCHMARK);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export function ToBenchmarkHistoryRow(
  dto: BenchmarkHistoryResponseDTO,
  benchmark: BenchmarkRow | null
): BenchmarkHistoryRow {
  return {
    id: dto.id,
    benchmarkId: dto.benchmarkId,
    benchmarkName: benchmark?.name ?? "",
    benchmarkAcronym: benchmark?.acronym ?? "",
    date: dto.date,
    rate: dto.rate,
  }
}

/**
 * @summary
 * Projects the benchmark history read models onto the rows.
 *
 * @remarks
 * Keeps the 6 fields the screens render and drops
 * `createdAt`, which stays in the service layer.
 * Attaches the benchmark name and acronym for display.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The benchmark history read models.
 * @param benchmarksById - Benchmarks keyed by id for attachment.
 *
 * @returns The benchmark history rows.
 *
 * @example
 * const ROWS = ToBenchmarkHistoryRows(DTO, BENCHMARKS_BY_ID);
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export function ToBenchmarkHistoryRows(
  dtos: BenchmarkHistoryResponseDTO[],
  benchmarksById: Record<string, BenchmarkRow>
): BenchmarkHistoryRow[] {
  return dtos.map((dto) =>
    ToBenchmarkHistoryRow(
      dto,
      benchmarksById[dto.benchmarkId] ?? null
    )
  )
}
