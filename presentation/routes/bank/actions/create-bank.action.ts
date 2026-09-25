"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { BankRepository } from "@/infrastructure/bank/repositories/bank.repository"
import { CreateBankUseCase } from "@/services/bank/use-cases/create-bank.use-case"

export interface CreateBankActionInput {
  code: string
  name: string
}

/**
 * @summary
 * Creates a new bank.
 *
 * @remarks
 * Resolves the session user from the request headers,
 * builds the create payload and runs the service use
 * case. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the add bank form.
 *
 * @param input - The bank creation payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await createBankAction({
 *   code: "237",
 *   name: "Banco Bradesco",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function createBankAction(
  input: CreateBankActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new BankRepository(db)
    const USE_CASE = new CreateBankUseCase(REPOSITORY)

    await USE_CASE.execute({
      code: input.code,
      name: input.name,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível criar o banco.",
    }
  }
}
