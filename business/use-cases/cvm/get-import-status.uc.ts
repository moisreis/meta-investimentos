import type { CvmImport } from "@/business/entities/cvm/cvm-import.entity";
import type { ICvmImport } from "@/business/interfaces/cvm/cvm-import.interface";

/**
 * Retrieves the most recent CVM import summary.
 *
 * @param ctx - The CVM import repository.
 * @returns The latest import summary or `null` when no import has been
 *   recorded.
 */
export async function getLatestImport(
  ctx: Pick<ICvmImport, "findLatest">,
): Promise<CvmImport | null> {
  return ctx.findLatest();
}

/**
 * Retrieves the most recent failed CVM import summaries.
 *
 * @param ctx - The CVM import repository.
 * @param limit - The maximum number of failed imports to return.
 * @returns The failed import summaries.
 */
export async function getFailedImports(
  ctx: Pick<ICvmImport, "findFailed">,
  limit?: number,
): Promise<CvmImport[]> {
  return ctx.findFailed(limit);
}
