import { IApplication } from "@domain/application/interfaces/application.interface"
import { EntityId } from "@/value-objects"
import type { ApplicationResponseDTO } from "../dto/application-response.dto"
import { toResponseDTO } from "../mappers/application.mapper"

export interface ListApplicationsInput {
  positionId: string
}

/**
 * @summary
 * Lists all `Application` entries of a position.
 *
 * @remarks
 * Uses the position id to scope the application query.
 *
 * @explanation
 * Use this use case to list the applications of a given
 * position through the service layer.
 *
 * @example
 * const APPLICATIONS = await LIST_APPLICATIONS_USE_CASE
 *   .execute({
 *     positionId: "position-1",
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ListApplicationsUseCase {
  constructor(private applicationRepository: IApplication) {}

  /**
   * @summary
   * Fetches all applications of the provided position.
   *
   * @remarks
   * Uses the position id to scope the application query.
   *
   * @explanation
   * Use this method to list the applications of a given
   * position through the service layer.
   *
   * @param input - Payload with the target position id.
   *
   * @returns The matched applications.
   *
   * @example
   * const APPLICATIONS = await LIST_APPLICATIONS_USE_CASE
   *   .execute({
   *     positionId: "position-1",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: ListApplicationsInput
  ): Promise<ApplicationResponseDTO[]> {
    const POSITION_ID = EntityId.create(input.positionId)
    const APPLICATIONS =
      await this.applicationRepository.findAllByPositionId(POSITION_ID)
    return APPLICATIONS.map(toResponseDTO)
  }
}
