import { IPosition } from "@domain/position/interfaces/position.interface"
import { EntityId } from "@/value-objects"

export interface BulkDeletePositionsInput {
  positionIds: string[]
}

/**
 * @summary
 * Deletes multiple `Position` records.
 *
 * @remarks
 * Hydrates each position by its id and removes the rows
 * that still exist. Rows that no longer exist are silently
 * skipped. The repository contract exposes single-row
 * deletes, so each removal runs through `delete(id)`.
 *
 * @explanation
 * Use this use case to remove many positions of the
 * registry through the service layer.
 *
 * @example
 * await BULK_DELETE_POSITIONS_USE_CASE.execute({
 *   positionIds: ["position-1", "position-2"],
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
export class BulkDeletePositionsUseCase {
  constructor(private positionRepository: IPosition) {}

  /**
   * @summary
   * Removes the positions with the provided ids.
   *
   * @remarks
   * Skips ids without a matching row. Returns early when
   * the list is empty.
   *
   * @explanation
   * Use this method to delete the selected position rows
   * of the registry in a single flow.
   *
   * @param input - Payload with the target position ids.
   *
   * @returns Resolves when the rows are removed.
   *
   * @example
   * await BULK_DELETE_POSITIONS_USE_CASE.execute({
   *   positionIds: ["position-1", "position-2"],
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-10-20
   */
  async execute(input: BulkDeletePositionsInput): Promise<void> {
    if (input.positionIds.length === 0) {
      return
    }

    for (const id of input.positionIds) {
      const ENTITY_ID = EntityId.create(id)
      const POSITION =
        await this.positionRepository.findById(ENTITY_ID)

      if (POSITION) {
        await this.positionRepository.delete(ENTITY_ID)
      }
    }
  }
}
