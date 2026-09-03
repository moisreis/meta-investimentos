import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { BenchmarkHistoryDto } from "./benchmark.dtos";
import { toBenchmarkHistoryDto } from "./benchmark.dtos";

/**
 * Input for {@link listBenchmarkHistories}.
 */
export interface ListBenchmarkHistoriesInput {
  /**
   * The id of the benchmark to list history for.
   */
  benchmarkId: string;
}

/**
 * Lists every history entry of a benchmark.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The benchmark id.
 * @returns The {@link BenchmarkHistoryDto}s of the benchmark.
 */
export async function listBenchmarkHistories(
  ctx: Pick<UnitOfWorkContext, "benchmarkHistories">,
  input: ListBenchmarkHistoriesInput,
): Promise<BenchmarkHistoryDto[]> {
  const histories = await ctx.benchmarkHistories.findAllByBenchmarkId(
    EntityId.create(input.benchmarkId),
  );

  return histories.map(toBenchmarkHistoryDto);
}
