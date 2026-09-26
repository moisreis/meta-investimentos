"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { UserRepository } from "@/infrastructure/user/repositories/user.repository"
import { DeleteUserUseCase } from "@/services/user/use-cases/delete-user.use-case"

export interface DeleteUserActionInput {
  userId: string
}

/**
 * @summary
 * Deletes a user.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and runs the delete use case. Returns a
 * human-readable error when anything fails.
 *
 * @explanation
 * Use as the submit target of the single-row delete
 * flow of the user datatable.
 *
 * @param input - The user id to delete.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await deleteUserAction({
 *   userId: "user-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function deleteUserAction(
  input: DeleteUserActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new UserRepository(db)
    const USE_CASE = new DeleteUserUseCase(REPOSITORY)

    await USE_CASE.execute({
      userId: input.userId,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível excluir o usuário.",
    }
  }
}
