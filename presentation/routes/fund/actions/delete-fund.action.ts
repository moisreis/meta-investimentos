"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { DeleteFundUseCase } from "@/services/fund/use-cases/delete-fund.use-case"

export interface DeleteFundActionInput {
  fundId: string
}

/**
 * @summary
 * Deletes a fund.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and runs the delete use case. Returns a
 * human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the single-row delete
 * flow of the fund datatable.
 *
 * @param input - The fund id to delete.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await deleteFundAction({
 *   fundId: "fund-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function deleteFundAction(
  input: DeleteFundActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new FundRepository(db)
    const USE_CASE = new DeleteFundUseCase(REPOSITORY)

    await USE_CASE.execute({
      fundId: input.fundId,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível excluir o fundo.",
    }
  }
}
