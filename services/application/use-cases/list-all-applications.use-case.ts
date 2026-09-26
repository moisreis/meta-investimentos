import { IApplication } from "@domain/application/interfaces/application.interface"
import { EntityId } from "@/value-objects"
import type { ApplicationResponseDTO } from "../dto/application-response.dto"
import { toResponseDTO } from "../mappers/application.mapper"

export interface ListAllApplicationsInput {
  positionIds: string[]
}

/**
 * @summary
 * Lists all `Application` entries across the provided
 * positions.
 *
 * @remarks
 * Maps the position ids into entity ids, short-circuits
 * when no position is provided, and delegates the query
 * to the application repository bulk lookup by position
 * ids.
 *
 * @explanation
 * Use this use case to feed the application registry
 * screen, where rows come from every portfolio of the
 * session user instead of a single position.
 *
 * @example
 * const APPLICATIONS = await LIST_ALL_APPLICATIONS_USE_CASE
 *   .execute({
 *     positionIds: ["position-1", "position-2"],
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListAllApplicationsUseCase {
  constructor(private applicationRepository: IApplication) {}

  /**
   * @summary
   * Fetches all applications of the provided positions.
   *
   * @remarks
   * Returns an empty array when the position id list is
   * empty.
   *
   * @explanation
   * Use this method to list the applications of many
   * positions through the service layer.
   *
   * @param input - Payload with the target position ids.
   *
   * @returns The matching applications.
   *
   * @example
   * const APPLICATIONS = await LIST_ALL_APPLICATIONS_USE_CASE
   *   .execute({
   *     positionIds: ["position-1"],
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(
    input: ListAllApplicationsInput
  ): Promise<ApplicationResponseDTO[]> {
    if (input.positionIds.length === 0) return []

    const POSITION_IDS = input.positionIds.map((positionId) =>
      EntityId.create(positionId)
    )

    const APPLICATIONS =
      await this.applicationRepository.findAllByPositionIds(
        POSITION_IDS
      )

    return APPLICATIONS.map(toResponseDTO)
  }
}
