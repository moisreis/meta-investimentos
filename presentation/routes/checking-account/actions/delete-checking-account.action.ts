"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { CheckingAccountRepository } from "@/infrastructure/checking-account/repositories/checking-account.repository"
import { DeleteCheckingAccountUseCase } from "@/services/checking-account/use-cases/delete-checking-account.use-case"

export interface DeleteCheckingAccountActionInput {
  checkingAccountId: string
}

/**
 * @summary
 * Deletes an existing checking account balance.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and removes the balance through the service use case.
 * Returns a human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the confirm-delete
 * dialog.
 *
 * @param input - The balance deletion payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await deleteCheckingAccountAction({
 *   checkingAccountId: "checking-account-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function deleteCheckingAccountAction(
  input: DeleteCheckingAccountActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new CheckingAccountRepository(db)
    const USE_CASE = new DeleteCheckingAccountUseCase(REPOSITORY)

    await USE_CASE.execute({
      checkingAccountId: input.checkingAccountId,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível excluir o saldo.",
    }
  }
}
