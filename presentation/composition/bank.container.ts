import { db } from "@/clients/database.client"
import { BankRepository } from "@/infrastructure/bank/repositories/bank.repository"
import { BulkDeleteBanksUseCase } from "@/services/bank/use-cases/bulk-delete-banks.use-case"
import { CreateBankUseCase } from "@/services/bank/use-cases/create-bank.use-case"
import { DeleteBankUseCase } from "@/services/bank/use-cases/delete-bank.use-case"
import { ListBanksUseCase } from "@/services/bank/use-cases/list-banks.use-case"
import { UpdateBankUseCase } from "@/services/bank/use-cases/update-bank.use-case"

// The bank use cases, already wired to the repository.
interface BankUseCases {
  bulkDelete: BulkDeleteBanksUseCase
  create: CreateBankUseCase
  list: ListBanksUseCase
  remove: DeleteBankUseCase
  update: UpdateBankUseCase
}

/**
 * @summary
 * Wires the bank use cases to the bank repository.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot.
 *
 * @explanation
 * Use this container from any server module that needs a
 * bank use case.
 *
 * @returns The wired bank use cases.
 *
 * @example
 * const { create: CREATE_BANK } = BankContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function BankContainer(): BankUseCases {
  const REPOSITORY = new BankRepository(db)

  return {
    bulkDelete: new BulkDeleteBanksUseCase(REPOSITORY),
    create: new CreateBankUseCase(REPOSITORY),
    list: new ListBanksUseCase(REPOSITORY),
    remove: new DeleteBankUseCase(REPOSITORY),
    update: new UpdateBankUseCase(REPOSITORY),
  }
}

export { BankContainer, type BankUseCases }
