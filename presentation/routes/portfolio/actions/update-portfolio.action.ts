"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { UpdatePortfolioUseCase } from "@/services/portfolio/use-cases/update-portfolio.use-case"

export interface UpdatePortfolioActionInput {
  portfolioId: string
  acronym: string
  name: string
  annualInterestRate: string
  minAllocation: string
  maxAllocation: string
  targetAllocation: string
}

/**
 * @summary
 * Updates an existing portfolio of the signed-in user.
 *
 * @remarks
 * Resolves the session user id from the request headers,
 * enforces ownership through the use case and persists the
 * updated entity. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the edit portfolio form.
 * The caller sends unmasked decimal percentage strings.
 *
 * @param input - The portfolio update payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await updatePortfolioAction({
 *   portfolioId: "portfolio-1",
 *   acronym: "RF",
 *   name: "Renda Fixa",
 *   annualInterestRate: "10.5",
 *   minAllocation: "5",
 *   maxAllocation: "20",
 *   targetAllocation: "12",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
export async function updatePortfolioAction(
  input: UpdatePortfolioActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new PortfolioRepository(db)
    const USE_CASE = new UpdatePortfolioUseCase(REPOSITORY)

    await USE_CASE.execute({
      ...input,
      userId: SESSION.user.id,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível atualizar a carteira.",
    }
  }
}
