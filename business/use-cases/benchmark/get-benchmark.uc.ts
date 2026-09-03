import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";
import { NotFoundError } from "@/shared/errors";

import type { BenchmarkDto } from "./benchmark.dtos";
import { toBenchmarkDto } from "./benchmark.dtos";

/**
 * Input for {@link getBenchmark}.
 */
export interface GetBenchmarkInput {
  /**
   * The id of the benchmark to retrieve.
   */
  benchmarkId: string;
}

/**
 * Retrieves a single benchmark by id.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The benchmark id.
 * @returns The {@link BenchmarkDto}.
 *
 * @throws {NotFoundError} When the benchmark does not exist.
 */
export async function getBenchmark(
  ctx: Pick<UnitOfWorkContext, "benchmarks">,
  input: GetBenchmarkInput,
): Promise<BenchmarkDto> {
  const benchmark = await ctx.benchmarks.findById(
    EntityId.create(input.benchmarkId),
  );

  if (benchmark === null) {
    throw new NotFoundError(
      `Benchmark with id ${input.benchmarkId} was not found.`,
    );
  }

  return toBenchmarkDto(benchmark);
}
