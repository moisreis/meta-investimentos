"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { ID_SCHEMA } from "@/lib/validation/common.validation"
import { PortfolioContainer } from "@/presentation/composition/portfolio.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/types/action-result"

/**
 * @summary
 * Resolves the display name of a portfolio by its id.
 *
 * @remarks
 * Validates the id with **Zod**, resolves the session, and
 * fetches the portfolio through the service use case. A
 * missing session, a rejected id and a portfolio that cannot
 * be found all resolve to a failed result whose message the
 * breadcrumb renders as a missing segment.
 *
 * @explanation
 * Use as the resolver of the dynamic breadcrumb segment
 * of the portfolio detail route.
 *
 * @param input - The untrusted portfolio id.
 *
 * @returns The portfolio name, or a failure result.
 *
 * @example
 * const RESULT = await getPortfolioNameAction("portfolio-1");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function getPortfolioNameAction(
  input: unknown
): Promise<ActionResult<string | null>> {
  const PARSED = ID_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  try {
    const { get: GET_PORTFOLIO } = PortfolioContainer()
    const PORTFOLIO = await GET_PORTFOLIO.execute({
      portfolioId: PARSED.data,
    })

    return ActionSuccess(PORTFOLIO.name ?? null)
  } catch (cause) {
    return ToActionFailure(cause, "Carteira não encontrada.")
  }
}
