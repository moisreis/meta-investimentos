import {
  Benchmark,
  type BenchmarkProps,
} from "@domain/benchmark/entities/benchmark.entity"
import type { CreateBenchmarkDTO } from "../dto/create-benchmark.dto"
import type { BenchmarkResponseDTO } from "../dto/benchmark-response.dto"

/**
 * @summary
 * Maps a create `Benchmark` DTO into entity props.
 *
 * @remarks
 * Both acronym and name are plain strings, so the DTO
 * values are carried over unchanged.
 *
 * @param dto - Transport payload from the service layer.
 * @returns Props accepted by `Benchmark.create`.
 */
export function toCreateBenchmarkProps(
  dto: CreateBenchmarkDTO
): BenchmarkProps {
  return {
    acronym: dto.acronym,
    name: dto.name,
  }
}

/**
 * @summary
 * Maps a `Benchmark` entity into a response DTO.
 *
 * @remarks
 * Serializes the id to a string and the creation date
 * to an ISO 8601 string.
 *
 * @param entity - The benchmark domain entity.
 * @returns The transport response payload.
 */
export function toResponseDTO(entity: Benchmark): BenchmarkResponseDTO {
  return {
    id: entity.id as string,
    acronym: entity.acronym,
    name: entity.name,
    createdAt: entity.createdAt.toISOString(),
  }
}
