"use server"

import { RequireSessionUser } from "@/lib/auth/require-session"
import { BenchmarkContainer } from "@/presentation/composition/benchmark.container"
import { ActionAudited } from "@/presentation/parts/audit/shared-log-action.helper"
import {
  ActionFailure,
  RejectInput,
  ToActionFailure,
  type ActionResult,
} from "@/presentation/presenters/action-result.presenter"
import type { BenchmarkResponseDTO } from "@/services/benchmark/dto/benchmark-response.dto"

import { UPDATE_BENCHMARK_SCHEMA } from "../validations/benchmark-actions.validation"

/**
 * @summary
 * Updates an existing benchmark.
 *
 * @remarks
 * Resolves the session first, then validates the payload
 * with **Zod**, and only then runs the update use case. The
 * acting user is derived from the session, never from the
 * payload. Returns a human-readable error when anything
 * fails.
 *
 * @explanation
 * Use as the submit target of the edit benchmark form.
 *
 * @param input - The untrusted benchmark update payload.
 *
 * @returns The updated benchmark, or a failure result.
 *
 * @example
 * const RESULT = await updateBenchmarkAction({
 *   benchmarkId: "benchmark-1",
 *   acronym: "CDI",
 *   name: "Certificado de Depósito Interbancário",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export async function updateBenchmarkAction(
  input: unknown
): Promise<ActionResult<BenchmarkResponseDTO>> {
  const USER = await RequireSessionUser()

  if (!USER) {
    return ActionFailure("Faça login para continuar.")
  }

  const PARSED = UPDATE_BENCHMARK_SCHEMA.safeParse(input)

  if (!PARSED.success) {
    return RejectInput(PARSED.error)
  }

  try {
    const { update: UPDATE_BENCHMARK } = BenchmarkContainer()
    const BENCHMARK = await UPDATE_BENCHMARK.execute(PARSED.data)

    return ActionAudited(BENCHMARK, {
      userId: USER.id,
      action: "UPDATED",
      entity: "Benchmark",
      entityId: BENCHMARK.id,
      entityName: BENCHMARK.name,
    })
  } catch (cause) {
    return ToActionFailure(
      cause,
      "Não foi possível atualizar o índice."
    )
  }
}
