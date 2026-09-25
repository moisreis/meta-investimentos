"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { BankAccountRepository } from "@/infrastructure/bank-account/repositories/bank-account.repository"
import { CheckingAccountRepository } from "@/infrastructure/checking-account/repositories/checking-account.repository"
import { RecordCheckingAccountUseCase } from "@/services/checking-account/use-cases/record-checking-account.use-case"

export interface CreateCheckingAccountActionInput {
  bankAccountId: string
  date: string
  value: string
}

/**
 * @summary
 * Records a new checking account balance.
 *
 * @remarks
 * Resolves the session user from the request headers,
 * builds the create payload and runs the service use
 * case. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the add checking account
 * form.
 *
 * @param input - The balance creation payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await createCheckingAccountAction({
 *   bankAccountId: "bank-account-1",
 *   date: "2026-09-25",
 *   value: "15000",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function createCheckingAccountAction(
  input: CreateCheckingAccountActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new CheckingAccountRepository(db)
    const BANK_ACCOUNT_REPOSITORY = new BankAccountRepository(db)
    const USE_CASE = new RecordCheckingAccountUseCase(
      REPOSITORY,
      BANK_ACCOUNT_REPOSITORY
    )

    await USE_CASE.execute({
      bankAccountId: input.bankAccountId,
      date: input.date,
      value: input.value,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível cadastrar o saldo.",
    }
  }
}
