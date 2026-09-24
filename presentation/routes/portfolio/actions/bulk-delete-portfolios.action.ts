"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { BulkDeletePortfoliosUseCase } from "@/services/portfolio/use-cases/bulk-delete-portfolios.use-case"

export interface BulkDeletePortfoliosActionInput {
  portfolioIds: string[]
}

/**
 * @summary
 * Deletes multiple portfolios owned by the signed-in user.
 *
 * @remarks
 * Resolves the session user id from the request headers
 * and runs the bulk delete use case. Returns a
 * human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the bulk delete flow of
 * the portfolio datatable.
 *
 * @param input - The portfolio ids to delete.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await bulkDeletePortfoliosAction({
 *   portfolioIds: ["portfolio-1", "portfolio-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
export async function bulkDeletePortfoliosAction(
  input: BulkDeletePortfoliosActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new PortfolioRepository(db)
    const USE_CASE = new BulkDeletePortfoliosUseCase(REPOSITORY)

    await USE_CASE.execute({
      portfolioIds: input.portfolioIds,
      userId: SESSION.user.id,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível excluir as carteiras.",
    }
  }
}
