import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { QuotaRepository } from "@/infrastructure/quota/repositories/quota.repository"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import { ListFundsUseCase } from "@/services/fund/use-cases/list-funds.use-case"
import type { QuotaResponseDTO } from "@/services/quota/dto/quota-response.dto"
import { ListAllQuotasUseCase } from "@/services/quota/use-cases/list-all-quotas.use-case"

// Data resolved by the quota list loader.
export interface LoadedQuotaList {
  funds: FundResponseDTO[]
  quotas: QuotaResponseDTO[]
}

/**
 * @summary
 * Resolves the session user, the registered funds and
 * the quotas imported across those funds.
 *
 * @remarks
 * Fetches the session from the request headers, lists
 * all funds and delegates the quota query to the bulk
 * lookup use case. Returns null when there is no
 * active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the registry listing stay in a single
 * composition point.
 *
 * @returns The loaded quota list, or `null`.
 *
 * @example
 * const LOADED = await LoadQuotas();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadQuotas(): Promise<LoadedQuotaList | null> {
  const SESSION = await auth.api.getSession({
    headers: await headers(),
  })

  if (!SESSION?.user) return null

  const FUND_REPOSITORY = new FundRepository(db)
  const FUNDS_USE_CASE = new ListFundsUseCase(FUND_REPOSITORY)
  const FUNDS = await FUNDS_USE_CASE.execute({})

  const QUOTA_REPOSITORY = new QuotaRepository(db)
  const QUOTAS_USE_CASE = new ListAllQuotasUseCase(
    QUOTA_REPOSITORY
  )
  const QUOTAS = await QUOTAS_USE_CASE.execute({
    fundIds: FUNDS.map((fund) => fund.id),
  })

  return { funds: FUNDS, quotas: QUOTAS }
}
