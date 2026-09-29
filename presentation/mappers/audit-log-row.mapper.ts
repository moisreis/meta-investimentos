import type { AuditLogRow } from "@/presentation/types/audit-log-row.types"
import type { AuditLogResponseDTO } from "@/services/audit-log/dto/audit-log-response.dto"

/**
 * @summary
 * Projects a audit log read model onto the audit log row.
 *
 * @remarks
 * Copies the 7 fields the screens
 * render. The shapes match today, so the copy only
 * exists to keep the boundary explicit and uniform.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dto - The audit log read model.
 *
 * @returns The audit log row.
 *
 * @example
 * const ROW = ToAuditLogRow(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToAuditLogRow(
  dto: AuditLogResponseDTO
): AuditLogRow {
  return {
    id: dto.id,
    entity: dto.entity,
    entityId: dto.entityId,
    action: dto.action,
    changes: dto.changes,
    userId: dto.userId,
    createdAt: dto.createdAt,
  }
}

/**
 * @summary
 * Projects the audit log read models onto the audit log rows.
 *
 * @remarks
 * Copies the 7 fields the screens
 * render. The shapes match today, so the copy only
 * exists to keep the boundary explicit and uniform.
 *
 * @explanation
 * Use this mapper in the route loaders, the only place
 * allowed to read the service layer, so tables,
 * dialogs, forms and hooks never import a DTO.
 *
 * @param dtos - The audit log read models.
 *
 * @returns The audit log rows.
 *
 * @example
 * const ROWS = ToAuditLogRows(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export function ToAuditLogRows(
  dtos: AuditLogResponseDTO[]
): AuditLogRow[] {
  return dtos.map(ToAuditLogRow)
}
