"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { BulkDeleteFundsUseCase } from "@/services/fund/use-cases/bulk-delete-funds.use-case"

export interface BulkDeleteFundsActionInput {
  fundIds: string[]
}

/**
 * @summary
 * Deletes multiple funds.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and runs the bulk delete use case. Returns a
 * human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the bulk delete flow of
 * the fund datatable.
 *
 * @param input - The fund ids to delete.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await bulkDeleteFundsAction({
 *   fundIds: ["fund-1", "fund-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function bulkDeleteFundsAction(
  input: BulkDeleteFundsActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new FundRepository(db)
    const USE_CASE = new BulkDeleteFundsUseCase(REPOSITORY)

    await USE_CASE.execute({
      fundIds: input.fundIds,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível excluir os fundos.",
    }
  }
}
