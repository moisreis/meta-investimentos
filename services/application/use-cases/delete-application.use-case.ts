import { IApplication } from "@domain/application/interfaces/application.interface"
import { NotFoundError } from "@errors/not-found.error"
import { EntityId } from "@/value-objects"

export interface DeleteApplicationInput {
  applicationId: string
}

/**
 * @summary
 * Deletes an existing `Application`.
 *
 * @remarks
 * Fetches the application and removes it when it exists.
 * Throws **NotFoundError** when no application matches the
 * provided id.
 *
 * @explanation
 * Use this use case to remove an application through the
 * service layer.
 *
 * @example
 * await DELETE_APPLICATION_USE_CASE.execute({
 *   applicationId: "application-1",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export class DeleteApplicationUseCase {
  constructor(private applicationRepository: IApplication) {}

  /**
   * @summary
   * Deletes the application with the provided id.
   *
   * @remarks
   * Fetches the application and removes it when it exists.
   * Throws **NotFoundError** when no application matches the
   * provided id.
   *
   * @explanation
   * Use this method to remove an application through the
   * service layer.
   *
   * @param input - Payload with the target application id.
   *
   * @returns Resolves when removed.
   *
   * @example
   * await DELETE_APPLICATION_USE_CASE.execute({
   *   applicationId: "application-1",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-27
   */
  async execute(input: DeleteApplicationInput): Promise<void> {
    const ID = EntityId.create(input.applicationId)
    const APPLICATION =
      await this.applicationRepository.findById(ID)
    if (!APPLICATION) {
      throw new NotFoundError("`Application` not found.")
    }
    await this.applicationRepository.delete(ID)
  }
}
