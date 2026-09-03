import type { Benchmark } from "@/business/entities/benchmark/benchmark.entity";
import type { BenchmarkHistory } from "@/business/entities/benchmark/benchmark-history.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The public representation of a benchmark.
 */
export interface BenchmarkDto {
  id: EntityId;
  acronym: string;
  name: string;
  createdAt: Date;
}

/**
 * The public representation of a benchmark history entry.
 */
export interface BenchmarkHistoryDto {
  id: EntityId;
  benchmarkId: EntityId;
  date: Date;
  rate: string;
  createdAt: Date;
}

/**
 * Maps a `Benchmark` entity to its public DTO representation.
 *
 * @param benchmark - The benchmark entity.
 * @returns The benchmark DTO.
 */
export function toBenchmarkDto(benchmark: Benchmark): BenchmarkDto {
  return {
    id: benchmark.id as EntityId,
    acronym: benchmark.acronym,
    name: benchmark.name,
    createdAt: benchmark.createdAt,
  };
}

/**
 * Maps a `BenchmarkHistory` entity to its public DTO representation.
 *
 * @param history - The benchmark history entity.
 * @returns The benchmark history DTO.
 */
export function toBenchmarkHistoryDto(
  history: BenchmarkHistory,
): BenchmarkHistoryDto {
  return {
    id: history.id as EntityId,
    benchmarkId: history.benchmarkId,
    date: history.date,
    rate: history.rate.value.toString(),
    createdAt: history.createdAt,
  };
}
