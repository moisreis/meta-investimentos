import { ok } from "@/app/api/_core/envelope";
import { apiHandler } from "@/app/api/_core/handler";
import type { SystemHealthDto } from "@/business/use-cases/system/system-health.dtos";
import { getSystemHealth } from "@/business/use-cases/system/system-health.uc";

/**
 * Builds the health report returned when the database is unreachable.
 *
 * @returns A `down` health report, without leaking infra details.
 */
function downHealth(): SystemHealthDto {
  return {
    status: "down",
    updatedAt: new Date().toISOString(),
    checks: [
      {
        name: "database",
        status: "down",
        message: "Banco de dados indisponível.",
      },
    ],
  };
}

/**
 * Reports the overall platform health.
 *
 * The probe reads the recent job-run ledger to detect background
 * processing failures (`degraded`) and reports `down` when the database
 * cannot be reached, keeping the endpoint itself responsive so health
 * monitors can see the failure instead of timing out.
 */
export const GET = apiHandler({
  handler: async ({ runtime }) => {
    try {
      const health = await runtime.unitOfWork.run((tx) =>
        getSystemHealth({
          findRecentRuns: (limit) => tx.jobRuns.findRecent(limit),
        }),
      );
      return ok(health);
    } catch {
      return ok(downHealth());
    }
  },
});
