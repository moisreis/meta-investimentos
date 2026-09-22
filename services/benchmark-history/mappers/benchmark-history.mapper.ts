import {
  BenchmarkHistory,
  type BenchmarkHistoryProps,
} from "@domain/benchmark-history/entities/benchmark-history.entity"
import { EntityId, SignedPercentage } from "@/value-objects"
import type { CreateBenchmarkHistoryDTO } from "../dto/create-benchmark-history.dto"
import type { BenchmarkHistoryResponseDTO } from "../dto/benchmark-history-response.dto"

/**
 * @summary
 * Maps a create `BenchmarkHistory` DTO into entity props.
 *
 * @remarks
 * Parses the primitive DTO values into domain value
 * objects required by the entity factory.
 *
 * @explanation
 * Use this function to translate the service payload
 * into valid entity props.
 *
 * @param dto - Transport payload from the service layer.
 *
 * @returns Entity creation props.
 *
 * @example
 * const PROPS = toCreateBenchmarkHistoryProps(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toCreateBenchmarkHistoryProps(
  dto: CreateBenchmarkHistoryDTO
): BenchmarkHistoryProps {
  return {
    benchmarkId: EntityId.create(dto.benchmarkId),
    date: new Date(dto.date),
    rate: SignedPercentage.create(dto.rate),
  }
}

/**
 * @summary
 * Maps a `BenchmarkHistory` entity into a response DTO.
 *
 * @remarks
 * Serializes value objects to decimal strings and dates
 * to ISO 8601 strings.
 *
 * @explanation
 * Use this function to expose an entity as the response DTO.
 *
 * @param entity - The benchmark history domain entity.
 *
 * @returns The response payload.
 *
 * @example
 * const RESPONSE = toResponseDTO(ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toResponseDTO(
  entity: BenchmarkHistory
): BenchmarkHistoryResponseDTO {
  return {
    id: entity.id as string,
    benchmarkId: entity.benchmarkId,
    date: entity.date.toISOString(),
    rate: entity.rate.value.toString(),
    createdAt: entity.createdAt.toISOString(),
  }
}
