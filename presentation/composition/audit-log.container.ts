import { db } from "@/clients/database.client"
import { AuditLogRepository } from "@/infrastructure/audit-log/repositories/audit-log.repository"
import { UserRepository } from "@/infrastructure/user/repositories/user.repository"
import { ListAuditLogsUseCase } from "@/services/audit-log/use-cases/list-audit-logs.use-case"
import { ListUsersByIdsUseCase } from "@/services/user/use-cases/list-users-by-ids.use-case"

// The audit log use cases, already wired to the repository.
interface AuditLogUseCases {
  list: ListAuditLogsUseCase
  listUsers: ListUsersByIdsUseCase
}

/**
 * @summary
 * Wires the audit log use cases to their repositories.
 *
 * @remarks
 * This is the only place allowed to know that a use case
 * is built on a Drizzle repository. Actions and loaders ask
 * the container for the use case they need, so the delivery
 * layer never reaches into the infrastructure layer and the
 * wiring lives in a single spot.
 *
 * @explanation
 * Use this container from any server module that needs an
 * audit log use case.
 *
 * @returns The wired audit log use cases.
 *
 * @example
 * const { list: LIST_AUDIT_LOGS } = AuditLogContainer();
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function AuditLogContainer(): AuditLogUseCases {
  const AUDIT_LOG_REPOSITORY = new AuditLogRepository(db)
  const USER_REPOSITORY = new UserRepository(db)

  return {
    list: new ListAuditLogsUseCase(AUDIT_LOG_REPOSITORY),
    listUsers: new ListUsersByIdsUseCase(USER_REPOSITORY),
  }
}

export { AuditLogContainer, type AuditLogUseCases }
