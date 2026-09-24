"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { CreatePortfolioUseCase } from "@/services/portfolio/use-cases/create-portfolio.use-case"

export interface CreatePortfolioActionInput {
  acronym: string
  name: string
  annualInterestRate: string
  minAllocation: string
  maxAllocation: string
  targetAllocation: string
}

/**
 * @summary
 * Creates a new portfolio for the signed-in user.
 *
 * @remarks
 * Resolves the session user id from the request headers,
 * builds the create payload and runs the service use case.
 * Returns a human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the add portfolio form.
 * The caller sends unmasked decimal percentage strings.
 *
 * @param input - The portfolio creation payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await createPortfolioAction({
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
export async function createPortfolioAction(
  input: CreatePortfolioActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new PortfolioRepository(db)
    const USE_CASE = new CreatePortfolioUseCase(REPOSITORY)

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
          : "Não foi possível criar a carteira.",
    }
  }
}
