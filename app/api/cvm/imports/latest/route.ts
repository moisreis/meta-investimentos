import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import { toCvmImportApiDto } from "@/app/api/_core/serializers/cvm-import.serializer";
import { getLatestImport } from "@/business/use-cases/cvm/get-import-status.uc";

/**
 * Retrieves the most recent CVM import summary, or `null` when no import
 * has been recorded yet.
 */
export const GET = apiHandler({
  handler: async ({ runtime }) => {
    const entry = await runtime.unitOfWork.run((tx) =>
      getLatestImport(tx.cvmImports),
    );
    return ok(entry ? toCvmImportApiDto(entry) : null);
  },
});
