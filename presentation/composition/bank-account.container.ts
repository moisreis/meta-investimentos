import { db } from "@/clients/database.client"
import { BankRepository } from "@/infrastructure/bank/repositories/bank.repository"
import { BankAccountRepository } from "@/infrastructure/bank-account/repositories/bank-account.repository"
import { CheckingAccountRepository } from "@/infrastructure/checking-account/repositories/checking-account.repository"
import { PortfolioRepository } from "@/infrastructure/portfolio/repositories/portfolio.repository"
import { ListBanksUseCase } from "@/services/bank/use-cases/list-banks.use-case"
import { BulkDeleteBankAccountsUseCase } from "@/services/bank-account/use-cases/bulk-delete-bank-accounts.use-case"
import { CreateBankAccountUseCase } from "@/services/bank-account/use-cases/create-bank-account.use-case"
import { DeleteBankAccountUseCase } from "@/services/bank-account/use-cases/delete-bank-account.use-case"
import { ListBankAccountsUseCase } from "@/services/bank-account/use-cases/list-bank-accounts.use-case"
import { ListBankRowSummariesUseCase } from "@/services/bank/use-cases/list-bank-row-summaries.use-case"
import { UpdateBankAccountUseCase } from "@/services/bank-account/use-cases/update-bank-account.use-case"
import { ListCheckingAccountsUseCase } from "@/services/checking-account/use-cases/list-checking-accounts.use-case"
import { ListPortfoliosUseCase } from "@/services/portfolio/use-cases/list-portfolios.use-case"

// The bank account use cases, plus the registries the route
// selects and the row summaries need, all wired to their
// repositories.
interface BankAccountUseCases {
  bulkDelete: BulkDeleteBankAccountsUseCase
  create: CreateBankAccountUseCase
  list: ListBankAccountsUseCase
  listBanks: ListBanksUseCase
  listBankRowSummaries: ListBankRowSummariesUseCase
  listCheckingAccounts: ListCheckingAccountsUseCase
  listPortfolios: ListPortfoliosUseCase
  remove: DeleteBankAccountUseCase
  update: UpdateBankAccountUseCase
}

/**
 * @summary
 * Wires the bank account use cases to their repositories.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot. The bank, portfolio and
 * checking account listings live here too, because the
 * bank account route resolves them from a single loader.
 *
 * @explanation
 * Use this container from any server module that needs a
 * bank account use case.
 *
 * @returns The wired bank account use cases.
 *
 * @example
 * const { create: CREATE_BANK_ACCOUNT } =
 *   BankAccountContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function BankAccountContainer(): BankAccountUseCases {
  const REPOSITORY = new BankAccountRepository(db)
  const BANK_REPOSITORY = new BankRepository(db)
  const PORTFOLIO_REPOSITORY = new PortfolioRepository(db)
  const CHECKING_ACCOUNT_REPOSITORY =
    new CheckingAccountRepository(db)

  return {
    bulkDelete: new BulkDeleteBankAccountsUseCase(REPOSITORY),
    create: new CreateBankAccountUseCase(REPOSITORY),
    list: new ListBankAccountsUseCase(REPOSITORY),
    listBanks: new ListBanksUseCase(BANK_REPOSITORY),
    listBankRowSummaries: new ListBankRowSummariesUseCase(
      REPOSITORY
    ),
    listCheckingAccounts: new ListCheckingAccountsUseCase(
      CHECKING_ACCOUNT_REPOSITORY
    ),
    listPortfolios: new ListPortfoliosUseCase(
      PORTFOLIO_REPOSITORY
    ),
    remove: new DeleteBankAccountUseCase(REPOSITORY),
    update: new UpdateBankAccountUseCase(REPOSITORY),
  }
}

export { BankAccountContainer, type BankAccountUseCases }
