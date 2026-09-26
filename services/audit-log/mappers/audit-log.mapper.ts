import { AuditLog } from "@domain/audit-log/entities/audit-log.entity"
import type { AuditLogResponseDTO } from "../dto/audit-log-response.dto"

/**
 * @summary
 * Maps an `AuditLog` entity into a response DTO.
 *
 * @remarks
 * Serializes the creation timestamp to an ISO 8601 string
 * and keeps the primitive payload columns as-is.
 *
 * @explanation
 * Use this function to expose an entity as the response DTO.
 *
 * @param entity - The audit log domain entity.
 *
 * @returns The response payload.
 *
 * @example
 * const RESPONSE = toResponseDTO(ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function toResponseDTO(
  entity: AuditLog
): AuditLogResponseDTO {
  return {
    id: entity.id as string,
    entity: entity.entity,
    entityId: entity.entityId,
    action: entity.action,
    changes: entity.changes,
    userId: entity.userId,
    createdAt: entity.createdAt.toISOString(),
  }
}
