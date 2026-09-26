import { IBenchmark } from "@domain/benchmark/interfaces/benchmark.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { BenchmarkResponseDTO } from "../dto/benchmark-response.dto"
import { toResponseDTO } from "../mappers/benchmark.mapper"

export interface UpdateBenchmarkInput {
  benchmarkId: string
  acronym?: string
  name?: string
}

/**
 * @summary
 * Updates an existing `Benchmark`.
 *
 * @remarks
 * Fetches the benchmark, applies `rename` and
 * `changeAcronym` for the provided fields, and persists
 * the updated entity.
 *
 * @explanation
 * Use this use case to edit the editable fields of an
 * existing benchmark through the service layer.
 *
 * @example
 * const BENCHMARK = await UPDATE_BENCHMARK_USE_CASE.execute({
 *   benchmarkId: "benchmark-1",
 *   name: "Certificado de Depósito Interbancário",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class UpdateBenchmarkUseCase {
  constructor(private benchmarkRepository: IBenchmark) {}

  /**
   * @summary
   * Updates and persists a benchmark.
   *
   * @remarks
   * Fetches the benchmark, applies `rename` and
   * `changeAcronym` for the provided fields, and persists
   * the updated entity.
   *
   * @explanation
   * Use this method to edit the editable fields of an
   * existing benchmark through the service layer.
   *
   * @param input - Payload with the target benchmark id
   *                and field updates.
   *
   * @returns The updated benchmark.
   *
   * @example
   * const BENCHMARK = await UPDATE_BENCHMARK_USE_CASE.execute({
   *   benchmarkId: "benchmark-1",
   *   name: "Certificado de Depósito Interbancário",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: UpdateBenchmarkInput
  ): Promise<BenchmarkResponseDTO> {
    const ID = EntityId.create(input.benchmarkId)
    const BENCHMARK = await this.benchmarkRepository.findById(ID)
    if (!BENCHMARK) {
      throw new NotFoundError("`Benchmark` not found.")
    }
    let UPDATED = BENCHMARK
    if (input.name !== undefined) {
      UPDATED = UPDATED.rename(input.name)
    }
    if (input.acronym !== undefined) {
      UPDATED = UPDATED.changeAcronym(input.acronym)
    }
    const SAVED = await this.benchmarkRepository.save(UPDATED)
    return toResponseDTO(SAVED)
  }
}
