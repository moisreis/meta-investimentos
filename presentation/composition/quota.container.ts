import { db } from "@/clients/database.client"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { QuotaRepository } from "@/infrastructure/quota/repositories/quota.repository"
import { ListFundsUseCase } from "@/services/fund/use-cases/list-funds.use-case"
import { ListAllQuotasUseCase } from "@/services/quota/use-cases/list-all-quotas.use-case"

// The quota use cases, already wired to the repositories.
interface QuotaUseCases {
  listAllQuotas: ListAllQuotasUseCase
  listFunds: ListFundsUseCase
}

/**
 * @summary
 * Wires the quota use cases to the quota repository.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot.
 *
 * The CVM import is not wired here on purpose: it is owned
 * by the fund valuation job, which is its own composition
 * root and builds the import use case per slice, away from
 * the request lifecycle.
 *
 * @explanation
 * Use this container from any server module that needs a
 * quota use case.
 *
 * @returns The wired quota use cases.
 *
 * @example
 * const { listAllQuotas: LIST_ALL_QUOTAS } = QuotaContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function QuotaContainer(): QuotaUseCases {
  const FUND_REPOSITORY = new FundRepository(db)
  const QUOTA_REPOSITORY = new QuotaRepository(db)

  return {
    listAllQuotas: new ListAllQuotasUseCase(QUOTA_REPOSITORY),
    listFunds: new ListFundsUseCase(FUND_REPOSITORY),
  }
}

export { QuotaContainer, type QuotaUseCases }
