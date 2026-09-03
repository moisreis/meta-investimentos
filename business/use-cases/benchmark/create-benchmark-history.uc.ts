import { BenchmarkHistory } from "@/business/entities/benchmark/benchmark-history.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

import type { BenchmarkHistoryDto } from "./benchmark.dtos";
import { toBenchmarkHistoryDto } from "./benchmark.dtos";

/**
 * Input for {@link createBenchmarkHistory}.
 */
export interface CreateBenchmarkHistoryInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The id of the benchmark the history belongs to.
   */
  benchmarkId: string;

  /**
   * The date of the history entry.
   */
  date: Date;

  /**
   * The rate of the benchmark on that date, as a decimal string.
   */
  rate: string;
}

/**
 * Creates a benchmark history entry.
 *
 * The history entry is created inside one `UnitOfWork` transaction so
 * the insertion and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The history entry properties.
 * @returns The created {@link BenchmarkHistoryDto}.
 *
 * @throws {ValidationError} When a history entry already exists for the
 *   benchmark on that date.
 * @throws {NotFoundError} When the referenced benchmark does not exist.
 */
export async function createBenchmarkHistory(
  unitOfWork: UnitOfWork,
  input: CreateBenchmarkHistoryInput,
): Promise<BenchmarkHistoryDto> {
  return unitOfWork.run(
    async (tx) => {
      const benchmarkId = EntityId.create(input.benchmarkId);

      const benchmark = await tx.benchmarks.findById(benchmarkId);

      if (benchmark === null) {
        throw new NotFoundError(
          `Benchmark with id ${input.benchmarkId} was not found.`,
        );
      }

      const existing = await tx.benchmarkHistories.findByBenchmarkIdAndDate(
        benchmarkId,
        input.date,
      );

      if (existing !== null) {
        throw new ValidationError(
          `Benchmark history for ${input.benchmarkId} on ${input.date.toISOString()} already exists.`,
        );
      }

      const history = BenchmarkHistory.create({
        benchmarkId,
        date: input.date,
        rate: SignedPercentage.create(input.rate),
      });

      const saved = await tx.benchmarkHistories.save(history);

      return toBenchmarkHistoryDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
