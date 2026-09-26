"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { UserRepository } from "@/infrastructure/user/repositories/user.repository"
import { BulkDeleteUsersUseCase } from "@/services/user/use-cases/bulk-delete-users.use-case"

export interface BulkDeleteUsersActionInput {
  userIds: string[]
}

/**
 * @summary
 * Deletes multiple users.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and runs the bulk delete use case. Returns a
 * human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the bulk delete flow of
 * the user datatable.
 *
 * @param input - The user ids to delete.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await bulkDeleteUsersAction({
 *   userIds: ["user-1", "user-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function bulkDeleteUsersAction(
  input: BulkDeleteUsersActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new UserRepository(db)
    const USE_CASE = new BulkDeleteUsersUseCase(REPOSITORY)

    await USE_CASE.execute({
      userIds: input.userIds,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível excluir os usuários.",
    }
  }
}
