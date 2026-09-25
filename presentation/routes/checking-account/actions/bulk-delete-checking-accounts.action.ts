"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { CheckingAccountRepository } from "@/infrastructure/checking-account/repositories/checking-account.repository"
import { BulkDeleteCheckingAccountsUseCase } from "@/services/checking-account/use-cases/bulk-delete-checking-accounts.use-case"

export interface BulkDeleteCheckingAccountsActionInput {
  checkingAccountIds: string[]
}

/**
 * @summary
 * Deletes multiple checking account balances.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and removes the selected balances through the service
 * use case. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the datatable bulk
 * delete flow.
 *
 * @param input - The balances deletion payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await bulkDeleteCheckingAccountsAction({
 *   checkingAccountIds: ["checking-account-1", "checking-account-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function bulkDeleteCheckingAccountsAction(
  input: BulkDeleteCheckingAccountsActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new CheckingAccountRepository(db)
    const USE_CASE = new BulkDeleteCheckingAccountsUseCase(
      REPOSITORY
    )

    await USE_CASE.execute({
      checkingAccountIds: input.checkingAccountIds,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível excluir os saldos.",
    }
  }
}
