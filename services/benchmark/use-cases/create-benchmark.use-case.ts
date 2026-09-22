import { Benchmark } from "@domain/benchmark/entities/benchmark.entity"
import { IBenchmark } from "@domain/benchmark/interfaces/benchmark.interface"
import type { BenchmarkResponseDTO } from "../dto/benchmark-response.dto"
import {
  toCreateBenchmarkProps,
  toResponseDTO,
} from "../mappers/benchmark.mapper"

export interface CreateBenchmarkInput {
  acronym: string
  name: string
}

/**
 * @summary
 * Creates a new `Benchmark` and persists it.
 *
 * @remarks
 * Builds entity props through the create mapper and
 * saves the benchmark with the benchmark repository.
 *
 * @explanation
 * Use this use case to register a new benchmark through
 * the service layer.
 *
 * @example
 * const BENCHMARK = await CREATE_BENCHMARK_USE_CASE.execute({
 *   acronym: "**CDI**",
 *   name: "Certificado de Depósito Interbancário",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CreateBenchmarkUseCase {
  constructor(private benchmarkRepository: IBenchmark) {}

  /**
   * @summary
   * Creates and persists a new benchmark.
   *
   * @remarks
   * Builds entity props through the create mapper and
   * saves the benchmark with the benchmark repository.
   *
   * @explanation
   * Use this method to register a new benchmark through
   * the service layer.
   *
   * @param input - The benchmark creation payload.
   *
   * @returns The persisted benchmark.
   *
   * @example
   * const BENCHMARK = await CREATE_BENCHMARK_USE_CASE.execute({
   *   acronym: "**CDI**",
   *   name: "Certificado de Depósito Interbancário",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(input: CreateBenchmarkInput): Promise<BenchmarkResponseDTO> {
    const PROPS = toCreateBenchmarkProps(input)
    const BENCHMARK = Benchmark.create(PROPS)
    const SAVED = await this.benchmarkRepository.save(BENCHMARK)
    return toResponseDTO(SAVED)
  }
}
