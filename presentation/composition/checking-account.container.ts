import { db } from "@/clients/database.client"
import { BankRepository } from "@/infrastructure/bank/repositories/bank.repository"
import { BankAccountRepository } from "@/infrastructure/bank-account/repositories/bank-account.repository"
import { CheckingAccountRepository } from "@/infrastructure/checking-account/repositories/checking-account.repository"
import { ListBanksUseCase } from "@/services/bank/use-cases/list-banks.use-case"
import { ListBankAccountsUseCase } from "@/services/bank-account/use-cases/list-bank-accounts.use-case"
import { BulkDeleteCheckingAccountsUseCase } from "@/services/checking-account/use-cases/bulk-delete-checking-accounts.use-case"
import { DeleteCheckingAccountUseCase } from "@/services/checking-account/use-cases/delete-checking-account.use-case"
import { ListCheckingAccountsUseCase } from "@/services/checking-account/use-cases/list-checking-accounts.use-case"
import { RecordCheckingAccountUseCase } from "@/services/checking-account/use-cases/record-checking-account.use-case"
import { UpdateCheckingAccountUseCase } from "@/services/checking-account/use-cases/update-checking-account.use-case"

// The checking account use cases, already wired to the
// repository.
interface CheckingAccountUseCases {
  bulkDelete: BulkDeleteCheckingAccountsUseCase
  list: ListCheckingAccountsUseCase
  listBankAccounts: ListBankAccountsUseCase
  listBanks: ListBanksUseCase
  record: RecordCheckingAccountUseCase
  remove: DeleteCheckingAccountUseCase
  update: UpdateCheckingAccountUseCase
}

/**
 * @summary
 * Wires the checking account use cases to their
 * repositories.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot.
 *
 * Recording an entry spans two aggregates, so the bank
 * account repository is wired as well: the use case checks
 * that the target bank account exists before saving. The
 * bank account and bank listers are wired for the same
 * reason the fund route wires its registries, the route
 * needs them to resolve the name columns and the form
 * selects.
 *
 * @explanation
 * Use this container from any server module that needs a
 * checking account use case.
 *
 * @returns The wired checking account use cases.
 *
 * @example
 * const { record: RECORD_ENTRY } =
 *   CheckingAccountContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function CheckingAccountContainer(): CheckingAccountUseCases {
  const REPOSITORY = new CheckingAccountRepository(db)
  const BANK_ACCOUNT_REPOSITORY = new BankAccountRepository(db)
  const BANK_REPOSITORY = new BankRepository(db)

  return {
    bulkDelete: new BulkDeleteCheckingAccountsUseCase(
      REPOSITORY
    ),
    list: new ListCheckingAccountsUseCase(REPOSITORY),
    listBankAccounts: new ListBankAccountsUseCase(
      BANK_ACCOUNT_REPOSITORY
    ),
    listBanks: new ListBanksUseCase(BANK_REPOSITORY),
    record: new RecordCheckingAccountUseCase(
      REPOSITORY,
      BANK_ACCOUNT_REPOSITORY
    ),
    remove: new DeleteCheckingAccountUseCase(REPOSITORY),
    update: new UpdateCheckingAccountUseCase(REPOSITORY),
  }
}

export { CheckingAccountContainer, type CheckingAccountUseCases }
