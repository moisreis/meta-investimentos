"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { BankRepository } from "@/infrastructure/bank/repositories/bank.repository"
import { BulkDeleteBanksUseCase } from "@/services/bank/use-cases/bulk-delete-banks.use-case"

export interface BulkDeleteBanksActionInput {
  bankIds: string[]
}

/**
 * @summary
 * Deletes multiple banks.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and runs the bulk delete use case. Returns a
 * human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the bulk delete flow of
 * the bank datatable.
 *
 * @param input - The bank ids to delete.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await bulkDeleteBanksAction({
 *   bankIds: ["bank-1", "bank-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function bulkDeleteBanksAction(
  input: BulkDeleteBanksActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new BankRepository(db)
    const USE_CASE = new BulkDeleteBanksUseCase(REPOSITORY)

    await USE_CASE.execute({
      bankIds: input.bankIds,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível excluir os bancos.",
    }
  }
}
