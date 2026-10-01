import { RequireSessionUser } from "@/lib/auth/require-session"
import { FundContainer } from "@/presentation/composition/fund.container"

/**
 * @summary
 * Resolves the display name of a fund by its id.
 *
 * @remarks
 * Resolves the session user through the shared auth helper
 * and fetches the fund through the container, so the name
 * reads as the registry label the screen shows. Returns
 * null when there is no session or the fund cannot be
 * found.
 *
 * @explanation
 * Use as the resolver of the dynamic metadata title of the
 * fund detail route.
 *
 * @param fundId - The fund id to resolve.
 *
 * @returns The fund name or `null`.
 *
 * @example
 * const NAME = await LoadFundName("fund-1");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export async function LoadFundName(
  fundId: string
): Promise<string | null> {
  try {
    const USER = await RequireSessionUser()

    if (!USER) return null

    const { get: GET_FUND } = FundContainer()
    const FUND = await GET_FUND.execute({ fundId })

    return FUND.name ?? null
  } catch {
    return null
  }
}
