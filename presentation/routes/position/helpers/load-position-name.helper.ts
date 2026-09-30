import { RequireSessionUser } from "@/lib/auth/require-session"
import { FundContainer } from "@/presentation/composition/fund.container"
import { PositionContainer } from "@/presentation/composition/position.container"

/**
 * @summary
 * Resolves the display name of a position by its id.
 *
 * @remarks
 * Resolves the session user through the shared auth helper,
 * fetches the position and then the fund it holds through
 * the containers, so the name reads as the fund label the
 * screen shows. Returns null when there is no session, the
 * position cannot be found or the fund cannot be resolved.
 *
 * @explanation
 * Use as the resolver of the dynamic metadata title and of
 * the breadcrumb segment of the position detail route.
 *
 * @param positionId - The position id to resolve.
 *
 * @returns The fund name of the position or `null`.
 *
 * @example
 * const NAME = await LoadPositionName("position-1");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export async function LoadPositionName(
  positionId: string
): Promise<string | null> {
  try {
    const USER = await RequireSessionUser()

    if (!USER) return null

    const { get: GET_POSITION } = PositionContainer()
    const POSITION = await GET_POSITION.execute({ positionId })

    const { get: GET_FUND } = FundContainer()
    const FUND = await GET_FUND.execute({
      fundId: POSITION.fundId,
    })

    return FUND.name ?? null
  } catch {
    return null
  }
}
