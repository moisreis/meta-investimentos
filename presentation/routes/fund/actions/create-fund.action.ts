"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { CreateFundUseCase } from "@/services/fund/use-cases/create-fund.use-case"

export interface CreateFundActionInput {
  cnpj: string
  name: string
  administrationFee: string | null
  performanceFee: string | null
  bankId: string
  benchmarkId: string | null
  categoryId: string | null
}

/**
 * @summary
 * Creates a new fund.
 *
 * @remarks
 * Resolves the session user from the request headers,
 * builds the create payload and runs the service use
 * case. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the add fund form.
 *
 * @param input - The fund creation payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await createFundAction({
 *   cnpj: "11.222.333/0001-81",
 *   name: "Fundo Multi Mercado",
 *   bankId: "bank-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function createFundAction(
  input: CreateFundActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new FundRepository(db)
    const USE_CASE = new CreateFundUseCase(REPOSITORY)

    await USE_CASE.execute({
      cnpj: input.cnpj,
      name: input.name,
      administrationFee: input.administrationFee,
      performanceFee: input.performanceFee,
      bankId: input.bankId,
      benchmarkId: input.benchmarkId,
      categoryId: input.categoryId,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível criar o fundo.",
    }
  }
}
