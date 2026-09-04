import type { UnitOfWorkContext } from "@/infrastructure/unit-of-work";

import type { BenchmarkDto } from "./benchmark.dtos";
import { toBenchmarkDto } from "./benchmark.dtos";

/**
 * Input for {@link listBenchmarks}.
 */
export interface ListBenchmarksInput {
  /**
   * The maximum number of benchmarks to return.
   */
  limit?: number;

  /**
   * The offset from which to start returning benchmarks.
   */
  offset?: number;
}

/**
 * Retrieves a collection of benchmarks.
 *
 * Reference data is readable by any authenticated actor.
 *
 * @param ctx - The transaction-scoped repositories.
 * @param input - The pagination options.
 * @returns The collection of {@link BenchmarkDto}.
 */
export async function listBenchmarks(
  ctx: Pick<UnitOfWorkContext, "benchmarks">,
  input: ListBenchmarksInput = {},
): Promise<BenchmarkDto[]> {
  const benchmarks = await ctx.benchmarks.findAll({
    limit: input.limit,
    offset: input.offset,
  });

  return benchmarks.map((benchmark) => toBenchmarkDto(benchmark));
}
