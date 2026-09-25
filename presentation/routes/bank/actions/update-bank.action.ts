"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { BankRepository } from "@/infrastructure/bank/repositories/bank.repository"
import { UpdateBankUseCase } from "@/services/bank/use-cases/update-bank.use-case"

export interface UpdateBankActionInput {
  bankId: string
  code: string
  name: string
}

/**
 * @summary
 * Updates an existing bank.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and persists the updated entity through the service
 * use case. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the edit bank form.
 *
 * @param input - The bank update payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await updateBankAction({
 *   bankId: "bank-1",
 *   code: "237",
 *   name: "Banco Bradesco",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function updateBankAction(
  input: UpdateBankActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new BankRepository(db)
    const USE_CASE = new UpdateBankUseCase(REPOSITORY)

    await USE_CASE.execute({
      bankId: input.bankId,
      code: input.code,
      name: input.name,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível atualizar o banco.",
    }
  }
}
