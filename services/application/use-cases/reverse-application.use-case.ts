import { IApplication } from "@domain/application/interfaces/application.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"
import type { ApplicationResponseDTO } from "../dto/application-response.dto"
import { toResponseDTO } from "../mappers/application.mapper"

export interface ReverseApplicationInput {
  applicationId: string
  reversedByUserId: string
}

/**
 * @summary
 * Reverses an existing `Application`.
 *
 * @remarks
 * Fetches the application and applies `reverse` with
 * the provided user, then persists the updated entity.
 *
 * @explanation
 * Use this use case to cancel an application through
 * the service layer.
 *
 * @example
 * const APPLICATION = await REVERSE_APPLICATION_USE_CASE
 *   .execute({
 *     applicationId: "application-1",
 *     reversedByUserId: "user-1",
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class ReverseApplicationUseCase {
  constructor(private applicationRepository: IApplication) {}

  /**
   * @summary
   * Reverses and persists the application.
   *
   * @remarks
   * Fetches the application and applies `reverse` with
   * the provided user, then persists the updated entity.
   *
   * @explanation
   * Use this method to cancel an application through
   * the service layer.
   *
   * @param input - Payload with the target application
   *                id and the reversing user id.
   *
   * @returns The reversed application.
   *
   * @example
   * const APPLICATION = await REVERSE_APPLICATION_USE_CASE
   *   .execute({
   *     applicationId: "application-1",
   *     reversedByUserId: "user-1",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: ReverseApplicationInput
  ): Promise<ApplicationResponseDTO> {
    const ID = EntityId.create(input.applicationId)
    const APPLICATION = await this.applicationRepository.findById(ID)
    if (!APPLICATION) {
      throw new NotFoundError("`Application` not found.")
    }
    const REVERSE_USER_ID = EntityId.create(input.reversedByUserId)
    const REVERSED = APPLICATION.reverse(REVERSE_USER_ID)
    const SAVED = await this.applicationRepository.save(REVERSED)
    return toResponseDTO(SAVED)
  }
}
