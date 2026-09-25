import { headers } from "next/headers"

import { auth } from "@/clients/better-auth.client"
import { db } from "@/clients/database.client"
import { BankRepository } from "@/infrastructure/bank/repositories/bank.repository"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"
import { ListBanksUseCase } from "@/services/bank/use-cases/list-banks.use-case"

/**
 * @summary
 * Resolves the session user and the registered banks.
 *
 * @remarks
 * Fetches the session from the request headers and lists
 * all banks of the platform. Returns null when there is
 * no active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the bank listing stay in a single
 * composition point.
 *
 * @returns The bank rows, or `null`.
 *
 * @example
 * const BANKS = await LoadBanks();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export async function LoadBanks(): Promise<
  BankResponseDTO[] | null
> {
  const SESSION = await auth.api.getSession({
    headers: await headers(),
  })

  if (!SESSION?.user) return null

  const BANK_REPOSITORY = new BankRepository(db)
  const LIST_USE_CASE = new ListBanksUseCase(BANK_REPOSITORY)
  const BANKS = await LIST_USE_CASE.execute({})

  return BANKS
}
