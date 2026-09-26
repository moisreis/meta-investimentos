"use server"

import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { StatementRepository } from "@/infrastructure/statement/repositories/statement.repository"
import { BulkDeleteStatementsUseCase } from "@/services/statement/use-cases/bulk-delete-statements.use-case"

export interface BulkDeleteStatementsActionInput {
  statementIds: string[]
}

/**
 * @summary
 * Deletes multiple statements.
 *
 * @remarks
 * Resolves the session and runs the bulk delete use case.
 * Returns a human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the bulk delete flow of the
 * statement datatable.
 *
 * @param input - The statement ids to delete.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await bulkDeleteStatementsAction({
 *   statementIds: ["statement-1", "statement-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function bulkDeleteStatementsAction(
  input: BulkDeleteStatementsActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new StatementRepository(db)
    const USE_CASE = new BulkDeleteStatementsUseCase(REPOSITORY)

    await USE_CASE.execute({
      statementIds: input.statementIds,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível excluir os relatórios.",
    }
  }
}
