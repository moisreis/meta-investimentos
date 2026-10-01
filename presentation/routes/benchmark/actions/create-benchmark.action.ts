"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { BenchmarkContainer } from "@/presentation/composition/benchmark.container"
import {
  ActionFailure,
  ActionSuccess,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"
import type { BenchmarkResponseDTO } from "@/services/benchmark/dto/benchmark-response.dto"

import { CREATE_BENCHMARK_SCHEMA } from "../validations/benchmark-actions.validation"

/**
 * @summary
 * Creates a new benchmark.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the create use case.
 * The acting user is derived from the session, never from
 * the payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the add benchmark form.
 *
 * @param input - The untrusted benchmark creation payload.
 *
 * @returns The created benchmark, or a failure result.
 *
 * @example
 * const RESULT = await createBenchmarkAction({
 *   acronym: "CDI",
 *   name: "Certificado de Depósito Interbancário",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export async function createBenchmarkAction(
  input: unknown
): Promise<ActionResult<BenchmarkResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = CREATE_BENCHMARK_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { create: CREATE_BENCHMARK } = BenchmarkContainer()
    const BENCHMARK = await CREATE_BENCHMARK.execute(PARSED.data)

    return ActionSuccess(BENCHMARK)
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível criar o benchmark."
    )
  }
}
