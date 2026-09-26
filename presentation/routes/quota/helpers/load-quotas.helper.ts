import { RequireSessionUser } from "@/lib/auth/require-session"
import { QuotaContainer } from "@/presentation/composition/quota.container"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"
import type { QuotaResponseDTO } from "@/services/quota/dto/quota-response.dto"

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
 * Derives the acting user from the session, lists all funds
 * and delegates the quota query to the bulk lookup use
 * case. Every read goes through the container, so the
 * delivery layer never touches a repository. Returns null
 * when there is no active session.
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
  const USER = await RequireSessionUser()

  if (!USER) return null

  const {
    listAllQuotas: LIST_ALL_QUOTAS,
    listFunds: LIST_FUNDS,
  } = QuotaContainer()

  const FUNDS = await LIST_FUNDS.execute({})
  const QUOTAS = await LIST_ALL_QUOTAS.execute({
    fundIds: FUNDS.map((fund) => fund.id),
  })

  return { funds: FUNDS, quotas: QUOTAS }
}
