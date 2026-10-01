import { RequireSessionUser } from "@/lib/auth/require-session"
import { BankContainer } from "@/presentation/composition/bank.container"
import { ToBankRows } from "@/presentation/mappers/bank-row.mapper"
import type { BankRow } from "@/presentation/types/bank-row.types"

/**
 * @summary
 * Resolves the session user and the registered banks.
 *
 * @remarks
 * Derives the acting user from the session and lists all
 * banks of the platform through the use case. Returns null
 * when there is no active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the bank listing stay in a single place.
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
export async function LoadBanks(): Promise<BankRow[] | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const { list: LIST_BANKS } = BankContainer()

  return ToBankRows(await LIST_BANKS.execute({}))
}
