/**
 * An in-process, keyed async mutex used to serialize concurrent
 * performance recalculation runs for the same portfolio.
 *
 * Within a single server process this guarantees that two recalculation
 * runs targeting the same portfolio never interleave. Across processes,
 * determinism and idempotent persistence (the recalculation replaces the
 * performance rows inside the requested range within one transaction)
 * ensure concurrent runs converge to the same final state.
 */

const CHAINS = new Map<string, Promise<unknown>>();

/**
 * Runs `worker` while holding a per-key lock, serializing any concurrent
 * invocation targeting the same key.
 *
 * @param key - The lock key (typically a portfolio id).
 * @param worker - The critical section to run exclusively.
 * @returns The worker's resolved value.
 */
export async function withCalculationLock<T>(
  key: string,
  worker: () => Promise<T>,
): Promise<T> {
  const PREVIOUS = CHAINS.get(key) ?? Promise.resolve();
  const NEXT = PREVIOUS.then(() => worker());
  CHAINS.set(
    key,
    NEXT.catch(() => {
      // keep the chain alive after a failure so later runs are not blocked
    }),
  );
  return NEXT;
}
