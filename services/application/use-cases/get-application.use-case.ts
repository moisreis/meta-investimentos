import { IApplication } from "@domain/application/interfaces/application.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { ApplicationResponseDTO } from "../dto/application-response.dto"
import { toResponseDTO } from "../mappers/application.mapper"

export interface GetApplicationInput {
  applicationId: string
}

/**
 * @summary
 * Retrieves an existing `Application` by its id.
 *
 * @remarks
 * Throws **NotFoundError** when no application matches
 * the provided id.
 *
 * @explanation
 * Use this use case to fetch a single application
 * through the service layer.
 *
 * @example
 * const APPLICATION = await GET_APPLICATION_USE_CASE.execute({
 *   applicationId: "application-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class GetApplicationUseCase {
  constructor(private applicationRepository: IApplication) {}

  /**
   * @summary
   * Fetches the application with the provided id.
   *
   * @remarks
   * Throws **NotFoundError** when no application matches
   * the provided id.
   *
   * @explanation
   * Use this method to fetch a single application
   * through the service layer.
   *
   * @param input - Payload with the target application
   *                id.
   *
   * @returns The matching application.
   *
   * @example
   * const APPLICATION = await GET_APPLICATION_USE_CASE.execute({
   *   applicationId: "application-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: GetApplicationInput
  ): Promise<ApplicationResponseDTO> {
    const ID = EntityId.create(input.applicationId)
    const APPLICATION =
      await this.applicationRepository.findById(ID)
    if (!APPLICATION) {
      throw new NotFoundError("`Application` not found.")
    }
    return toResponseDTO(APPLICATION)
  }
}
