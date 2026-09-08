import type { AuditLog } from "@/business/entities/audit/audit-log.entity";

import type { NotificationDto } from "./audit.dtos";

/**
 * Maps an `AuditLog` entity to its public {@link NotificationDto}
 * representation.
 *
 * @param log - The audit log entry to map.
 * @returns The notification DTO.
 */
export function toNotificationDto(log: AuditLog): NotificationDto {
  return {
    id: log.id ?? "",
    entity: log.entity,
    entityId: log.entityId,
    action: log.action,
    createdAt: log.createdAt.toISOString(),
  };
}
