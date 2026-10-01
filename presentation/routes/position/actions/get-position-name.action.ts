"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { ID_SCHEMA } from "@/lib/validation/common.validation"
import { FundContainer } from "@/presentation/composition/fund.container"
import { PositionContainer } from "@/presentation/composition/position.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"

/**
 * @summary
 * Resolves the display name of a position by its id.
 *
 * @remarks
 * Validates the id with **Zod**, resolves the session, and
 * fetches the position and the fund it holds through the
 * service use cases, so the segment reads as the fund name.
 * A missing session, a rejected id and a position that
 * cannot be found all resolve to a failed result whose
 * message the breadcrumb renders as a missing segment.
 *
 * @explanation
 * Use as the resolver of the dynamic breadcrumb segment
 * of the position detail route.
 *
 * @param input - The untrusted position id.
 *
 * @returns The fund name of the position, or a failure
 *   result.
 *
 * @example
 * const RESULT = await getPositionNameAction("position-1");
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export async function getPositionNameAction(
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
    const { get: GET_POSITION } = PositionContainer()
    const POSITION = await GET_POSITION.execute({
      positionId: PARSED.data,
    })

    const { get: GET_FUND } = FundContainer()
    const FUND = await GET_FUND.execute({
      fundId: POSITION.fundId,
    })

    return ActionSuccess(FUND.name ?? null)
  } catch (cause) {
    return ToActionFailure(cause, "Posição não encontrada.")
  }
}
