import { describe, it, expect, beforeEach } from "vitest"

import { ListAuditLogsUseCase } from "@/services/audit-log/use-cases/list-audit-logs.use-case"
import { createFakeAuditLogRepository } from "__tests__/__setup__/_fakes.setup"
import {
  buildAuditLog,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

describe("services/audit-log/use-cases/list-audit-logs.use-case", () => {
  let auditLogRepository: ReturnType<
    typeof createFakeAuditLogRepository
  >

  beforeEach(() => {
    auditLogRepository = createFakeAuditLogRepository()
  })

  describe("execute", () => {
    it("should return every entry with the newest first", async () => {
      await auditLogRepository.save(
        buildAuditLog({
          entity: "Portfolio",
          entityId: buildEntityId("portfolio-1"),
          action: "CREATE",
          createdAt: new Date("2026-01-10T10:00:00.000Z"),
        })
      )
      await auditLogRepository.save(
        buildAuditLog({
          entity: "Bank",
          entityId: buildEntityId("bank-1"),
          action: "UPDATE",
          createdAt: new Date("2026-03-10T10:00:00.000Z"),
        })
      )
      await auditLogRepository.save(
        buildAuditLog({
          entity: "Fund",
          entityId: buildEntityId("fund-1"),
          action: "DELETE",
          createdAt: new Date("2026-02-10T10:00:00.000Z"),
        })
      )
      const useCase = new ListAuditLogsUseCase(
        auditLogRepository
      )

      const response = await useCase.execute()

      expect(response.length).toBe(3)
      expect(response.map((row) => row.entity)).toEqual([
        "Bank",
        "Fund",
        "Portfolio",
      ])
    })

    it("should serialize every payload column of the entry", async () => {
      await auditLogRepository.save(
        buildAuditLog({
          entity: "Portfolio",
          entityId: buildEntityId("portfolio-1"),
          action: "UPDATE",
          changes: { name: { from: "A", to: "B" } },
          userId: buildEntityId("user-1"),
          createdAt: new Date("2026-01-20T08:30:00.000Z"),
        })
      )
      const useCase = new ListAuditLogsUseCase(
        auditLogRepository
      )

      const response = await useCase.execute()

      expect(response[0].id).toBeDefined()
      expect(response[0].entity).toBe("Portfolio")
      expect(response[0].entityId).toBe("portfolio-1")
      expect(response[0].action).toBe("UPDATE")
      expect(response[0].changes).toEqual({
        name: { from: "A", to: "B" },
      })
      expect(response[0].userId).toBe("user-1")
      expect(response[0].createdAt).toBe(
        "2026-01-20T08:30:00.000Z"
      )
    })

    it("should expose null changes and user for system entries", async () => {
      await auditLogRepository.save(
        buildAuditLog({
          entity: "Portfolio",
          entityId: buildEntityId("portfolio-1"),
          action: "CREATE",
          changes: null,
          userId: null,
          createdAt: new Date("2026-01-20T08:30:00.000Z"),
        })
      )
      const useCase = new ListAuditLogsUseCase(
        auditLogRepository
      )

      const response = await useCase.execute()

      expect(response[0].changes).toBeNull()
      expect(response[0].userId).toBeNull()
    })

    it("should return an empty array when there is no entry", async () => {
      const useCase = new ListAuditLogsUseCase(
        auditLogRepository
      )

      const response = await useCase.execute()

      expect(response).toEqual([])
      expect(response.length).toBe(0)
    })
  })
})
