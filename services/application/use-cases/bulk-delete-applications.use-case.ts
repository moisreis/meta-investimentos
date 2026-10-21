import { IApplication } from "@domain/application/interfaces/application.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeleteApplicationsInput {
  applicationIds: string[]
}

/**
 * @summary
 * Deletes multiple `Application` records.
 *
 * @remarks
 * Hydrates each application by its id and removes the rows
 * that still exist. Rows that no longer exist are silently
 * skipped. The repository contract exposes single-row
 * deletes, so each removal runs through `delete(id)`.
 *
 * @explanation
 * Use this use case to remove many applications of the
 * registry through the service layer.
 *
 * @example
 * await BULK_DELETE_APPLICATIONS_USE_CASE.execute({
 *   applicationIds: ["application-1", "application-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
export class BulkDeleteApplicationsUseCase {
  constructor(private applicationRepository: IApplication) {}

  /**
   * @summary
   * Removes the applications with the provided ids.
   *
   * @remarks
   * Skips ids without a matching row. Returns early when
   * the list is empty.
   *
   * @explanation
   * Use this method to delete the selected application rows
   * of the registry in a single flow.
   *
   * @param input - Payload with the target application ids.
   *
   * @returns Resolves when the rows are removed.
   *
   * @example
   * await BULK_DELETE_APPLICATIONS_USE_CASE.execute({
   *   applicationIds: ["application-1", "application-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-10-20
   */
  async execute(
    input: BulkDeleteApplicationsInput
  ): Promise<void> {
    if (input.applicationIds.length === 0) {
      return
    }

    for (const id of input.applicationIds) {
      const ENTITY_ID = EntityId.create(id)
      const APPLICATION =
        await this.applicationRepository.findById(ENTITY_ID)

      if (APPLICATION) {
        await this.applicationRepository.delete(ENTITY_ID)
      }
    }
  }
}
