"use server"

import { headers } from "next/headers"
import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { DomainError } from "@/errors"
import { UserRepository } from "@/infrastructure/user/repositories/user.repository"
import { CreateUserUseCase } from "@/services/user/use-cases/create-user.use-case"
import type { UserRole } from "@/services/user/dto/create-user.dto"

export interface CreateUserActionInput {
  name: string
  email: string
  firstName: string
  lastName: string
  cpf: string
  role: UserRole
}

/**
 * @summary
 * Creates a new user.
 *
 * @remarks
 * Resolves the session user from the request headers,
 * builds the create payload and runs the service use
 * case. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the add user form.
 *
 * @param input - The user creation payload.
 *
 * @returns The action outcome with an optional error.
 *
 * @example
 * const RESULT = await createUserAction({
 *   name: "Maria Silva",
 *   email: "maria@example.com",
 *   firstName: "Maria",
 *   lastName: "Silva",
 *   cpf: "123.456.789-09",
 *   role: "MANAGER",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function createUserAction(
  input: CreateUserActionInput
): Promise<{ error?: string | null }> {
  try {
    const SESSION = await auth.api.getSession({
      headers: await headers(),
    })

    if (!SESSION?.user) {
      return { error: "Faça login para continuar." }
    }

    const REPOSITORY = new UserRepository(db)
    const USE_CASE = new CreateUserUseCase(REPOSITORY)

    await USE_CASE.execute({
      name: input.name,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      cpf: input.cpf,
      role: input.role,
    })

    return { error: null }
  } catch (cause) {
    return {
      error:
        cause instanceof DomainError
          ? cause.message
          : "Não foi possível criar o usuário.",
    }
  }
}
