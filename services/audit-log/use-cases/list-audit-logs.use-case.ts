import { IAuditLog } from "@domain/audit-log/interfaces/audit-log.interface"
import type { AuditLogResponseDTO } from "../dto/audit-log-response.dto"
import { toResponseDTO } from "../mappers/audit-log.mapper"

/**
 * @summary
 * Lists every audit log of the system.
 *
 * @remarks
 * Delegates to the repository `findAll` which orders the
 * entries by creation timestamp, most recent first.
 *
 * @explanation
 * Use this use case to render the system-wide audit trail
 * in a read-only registry screen.
 *
 * @example
 * const LOGS = await LIST_AUDIT_LOGS_USE_CASE.execute();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export class ListAuditLogsUseCase {
  constructor(private auditLogRepository: IAuditLog) {}

  /**
   * @summary
   * Fetches all audit log entries.
   *
   * @remarks
   * The repository returns the newest entries first.
   *
   * @explanation
   * Use this method to list the full activity trail of the
   * system through the service layer.
   *
   * @returns The audit log entries.
   *
   * @example
   * const LOGS = await LIST_AUDIT_LOGS_USE_CASE.execute();
   *
   * @author Moisés Reis
   *
   * @date 2026-09-25
   */
  async execute(): Promise<AuditLogResponseDTO[]> {
    const LOGS = await this.auditLogRepository.findAll()

    return LOGS.map(toResponseDTO)
  }
}
