"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { CheckingAccountRepository } from "@/infrastructure/checking-account/repositories/checking-account.repository"
import { UpdateCheckingAccountUseCase } from "@/services/checking-account/use-cases/update-checking-account.use-case"

export interface UpdateCheckingAccountActionInput {
  checkingAccountId: string
  value: string
}

/**
 * @summary
 * Updates the value of an existing checking account.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and persists the updated balance through the service
 * use case. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the edit checking account
 * form.
 *
 * @param input - The balance update payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await updateCheckingAccountAction({
 *   checkingAccountId: "checking-account-1",
 *   value: "-1234.56",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function updateCheckingAccountAction(
  input: UpdateCheckingAccountActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new CheckingAccountRepository(db)
    const USE_CASE = new UpdateCheckingAccountUseCase(REPOSITORY)

    await USE_CASE.execute({
      checkingAccountId: input.checkingAccountId,
      value: input.value,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível atualizar o saldo.",
    }
  }
}
