"use server"

import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { StatementRepository } from "@/infrastructure/statement/repositories/statement.repository"
import { DeleteStatementUseCase } from "@/services/statement/use-cases/delete-statement.use-case"

export interface DeleteStatementActionInput {
  statementId: string
}

/**
 * @summary
 * Deletes a single statement.
 *
 * @remarks
 * Resolves the session and runs the delete use case. Returns
 * a human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the single-row delete flow of
 * the statement datatable.
 *
 * @param input - The statement id to delete.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await deleteStatementAction({
 *   statementId: "statement-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function deleteStatementAction(
  input: DeleteStatementActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new StatementRepository(db)
    const USE_CASE = new DeleteStatementUseCase(REPOSITORY)

    await USE_CASE.execute({
      statementId: input.statementId,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível excluir o relatório.",
    }
  }
}
