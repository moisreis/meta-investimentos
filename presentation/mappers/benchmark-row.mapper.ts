import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"
import type { BenchmarkResponseDTO } from "@/services/benchmark/dto/benchmark-response.dto"

/**
 * @summary
 * Projects a benchmark read model onto the benchmark row.
 *
 * @remarks
 * Keeps the 2 fields the screens render
 * and drops 2 that stay in the
 * service layer:
 * `acronym`, `createdAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The benchmark read model.
 *
 * @returns The benchmark row.
 *
 * @example
 * const ROW = ToBenchmarkRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToBenchmarkRow(
  dto: BenchmarkResponseDTO
): BenchmarkRow {
  return {
    id: dto.id,
    name: dto.name,
  }
}

/**
 * @summary
 * Projects the benchmark read models onto the benchmark rows.
 *
 * @remarks
 * Keeps the 2 fields the screens render
 * and drops 2 that stay in the
 * service layer:
 * `acronym`, `createdAt`.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The benchmark read models.
 *
 * @returns The benchmark rows.
 *
 * @example
 * const ROWS = ToBenchmarkRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToBenchmarkRows(
  dtos: BenchmarkResponseDTO[]
): BenchmarkRow[] {
  return dtos.map(ToBenchmarkRow)
}
