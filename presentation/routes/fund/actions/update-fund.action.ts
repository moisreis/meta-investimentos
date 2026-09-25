"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { UpdateFundUseCase } from "@/services/fund/use-cases/update-fund.use-case"

export interface UpdateFundActionInput {
  fundId: string
  name: string
  administrationFee: string | null
  performanceFee: string | null
  benchmarkId: string | null
  categoryId: string | null
}

/**
 * @summary
 * Updates an existing fund.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and persists the updated entity through the service
 * use case. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the edit fund form.
 *
 * @param input - The fund update payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await updateFundAction({
 *   fundId: "fund-1",
 *   name: "Fundo Multi Mercado II",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function updateFundAction(
  input: UpdateFundActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new FundRepository(db)
    const USE_CASE = new UpdateFundUseCase(REPOSITORY)

    await USE_CASE.execute({
      fundId: input.fundId,
      name: input.name,
      administrationFee: input.administrationFee,
      performanceFee: input.performanceFee,
      benchmarkId: input.benchmarkId,
      categoryId: input.categoryId,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível atualizar o fundo.",
    }
  }
}
