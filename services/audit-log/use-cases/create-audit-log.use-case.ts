import { AuditLog } from "@domain/audit-log/entities/audit-log.entity"
import { IAuditLog } from "@domain/audit-log/interfaces/audit-log.interface"
import { EntityId } from "@/value-objects"
import type { AuditLogResponseDTO } from "../dto/audit-log-response.dto"
import { toResponseDTO } from "../mappers/audit-log.mapper"

export interface CreateAuditLogInput {
  entity: string
  entityId: string
  action: string
  changes?: Record<string, unknown> | null
  userId?: string | null
}

/**
 * @summary
 * Creates an audit log entry.
 *
 * @remarks
 * Builds the audit log entity through the factory method
 * and persists it through the audit log repository.
 *
 * @explanation
 * Use this use case from server actions to record
 * significant operations for compliance and debugging.
 *
 * @param input - The audit log creation payload.
 *
 * @returns The created audit log entry.
 *
 * @example
 * const AUDIT_LOG = await CREATE_AUDIT_LOG_USE_CASE.execute({
 *   entity: "User",
 *   entityId: "user-123",
 *   action: "CREATED",
 *   userId: "user-456",
 * });
 *
 * @author Moisés Reis
 *
 * @date 2026-10-04
 */
export class CreateAuditLogUseCase {
  constructor(private auditLogRepository: IAuditLog) {}

  /**
   * @summary
   * Creates and persists an audit log entry.
   *
   * @remarks
   * Builds the audit log entity through the factory method
   * and saves it through the repository.
   *
   * @explanation
   * Use this method to record an operation for audit trail.
   *
   * @param input - The audit log creation payload.
   *
   * @returns The created audit log entry.
   *
   * @example
   * const AUDIT_LOG = await CREATE_AUDIT_LOG_USE_CASE.execute({
   *   entity: "User",
   *   entityId: "user-123",
   *   action: "CREATED",
   *   userId: "user-456",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-10-04
   */
  async execute(
    input: CreateAuditLogInput
  ): Promise<AuditLogResponseDTO> {
    const AUDIT_LOG = AuditLog.create({
      entity: input.entity,
      entityId: EntityId.create(input.entityId),
      action: input.action,
      changes: input.changes ?? null,
      userId: input.userId
        ? EntityId.create(input.userId)
        : null,
    })

    const SAVED = await this.auditLogRepository.save(AUDIT_LOG)
    return toResponseDTO(SAVED)
  }
}
