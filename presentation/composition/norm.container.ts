import { db } from "@/clients/database.client"
import { NormRepository } from "@/infrastructure/norm/repositories/norm.repository"
import { CreateNormUseCase } from "@/services/norm/use-cases/create-norm.use-case"
import { GetNormUseCase } from "@/services/norm/use-cases/get-norm.use-case"
import { ListNormsUseCase } from "@/services/norm/use-cases/list-norms.use-case"
import { UpdateNormUseCase } from "@/services/norm/use-cases/update-norm.use-case"

// The norm use cases, already wired to the repository.
interface NormUseCases {
  create: CreateNormUseCase
  get: GetNormUseCase
  list: ListNormsUseCase
  update: UpdateNormUseCase
}

/**
 * @summary
 * Wires the norm use cases to the norm repository.
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
 * norm use case.
 *
 * @returns The wired norm use cases.
 *
 * @example
 * const { create: CREATE_NORM } = NormContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function NormContainer(): NormUseCases {
  const REPOSITORY = new NormRepository(db)

  return {
    create: new CreateNormUseCase(REPOSITORY),
    get: new GetNormUseCase(REPOSITORY),
    list: new ListNormsUseCase(REPOSITORY),
    update: new UpdateNormUseCase(REPOSITORY),
  }
}

export { NormContainer, type NormUseCases }
