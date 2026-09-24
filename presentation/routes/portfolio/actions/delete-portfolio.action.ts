"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { DeletePortfolioUseCase } from "@/services/portfolio/use-cases/delete-portfolio.use-case"

export interface DeletePortfolioActionInput {
  portfolioId: string
}

/**
 * @summary
 * Deletes a portfolio owned by the signed-in user.
 *
 * @remarks
 * Resolves the session user id from the request headers
 * and runs the delete use case. Returns a human-readable
 * error when anything fails.
 *
 * @explanation
 * Use as the submit target of the single-row delete flow
 * of the portfolio datatable.
 *
 * @param input - The portfolio id to delete.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await deletePortfolioAction({
 *   portfolioId: "portfolio-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
export async function deletePortfolioAction(
  input: DeletePortfolioActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new PortfolioRepository(db)
    const USE_CASE = new DeletePortfolioUseCase(REPOSITORY)

    await USE_CASE.execute({
      portfolioId: input.portfolioId,
      userId: SESSION.user.id,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível excluir a carteira.",
    }
  }
}
