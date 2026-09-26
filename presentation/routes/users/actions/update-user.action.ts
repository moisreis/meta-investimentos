"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { UserRepository } from "@/infrastructure/user/repositories/user.repository"
import { UpdateUserUseCase } from "@/services/user/use-cases/update-user.use-case"

export interface UpdateUserActionInput {
  userId: string
  name: string
  firstName: string
  lastName: string
}

/**
 * @summary
 * Updates an existing user.
 *
 * @remarks
 * Resolves the session user from the request headers
 * and persists the updated entity through the service
 * use case. Returns a human-readable error when
 * anything fails.
 *
 * @explanation
 * Use as the submit target of the edit user form.
 *
 * @param input - The user update payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await updateUserAction({
 *   userId: "user-1",
 *   name: "Maria Souza",
 *   firstName: "Maria",
 *   lastName: "Souza",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function updateUserAction(
  input: UpdateUserActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new UserRepository(db)
    const USE_CASE = new UpdateUserUseCase(REPOSITORY)

    await USE_CASE.execute({
      userId: input.userId,
      name: input.name,
      firstName: input.firstName,
      lastName: input.lastName,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível atualizar o usuário.",
    }
  }
}
