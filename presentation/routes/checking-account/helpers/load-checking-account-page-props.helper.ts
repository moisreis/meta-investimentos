import { LoadCheckingAccounts } from "../helpers/load-checking-accounts.helper"
import { BuildCheckingAccountNameLookups } from "../helpers/build-checking-account-name-lookups.helper"
import type { CheckingAccountListProps } from "../pages/list"

/**
 * @summary
 * Resolves the props for the checking account list page.
 *
 * @remarks
 * Loads the session checking account entries and their
 * display names.
 *
 * @returns The checking account list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadCheckingAccountPageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export async function LoadCheckingAccountPageProps(): Promise<CheckingAccountListProps> {
  const LOADED = await LoadCheckingAccounts()

  if (LOADED) {
    const ENTRIES = LOADED.entries
    const OPTIONS = {
      bankAccounts: LOADED.bankAccounts,
      banks: LOADED.banks,
    }
    const NAMES = BuildCheckingAccountNameLookups(
      LOADED.bankAccounts,
      LOADED.banks
    )

    return { data: ENTRIES, options: OPTIONS, names: NAMES }
  }

  return {
    data: null,
    options: null,
    names: { bankAccounts: {} },
  }
}
