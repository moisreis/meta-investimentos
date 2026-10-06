import { describe, it, expect, beforeEach } from "vitest"

import { CreateAuditLogUseCase } from "@/services/audit-log/use-cases/create-audit-log.use-case"
import { createFakeAuditLogRepository } from "__tests__/__setup__/_fakes.setup"
import { buildEntityId } from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
} from "__tests__/__setup__/_clock.setup"

describe("services/audit-log/use-cases/create-audit-log.use-case", () => {
  let auditLogRepository: ReturnType<
    typeof createFakeAuditLogRepository
  >

  beforeEach(() => {
    useFixedClock()
    auditLogRepository = createFakeAuditLogRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should persist the entry and return its identifier", async () => {
      const useCase = new CreateAuditLogUseCase(
        auditLogRepository
      )

      const response = await useCase.execute({
        entity: "Portfolio",
        entityId: "portfolio-1",
        action: "CREATED",
      })

      expect(response.id).toBeDefined()
      expect(
        await auditLogRepository.findById(
          buildEntityId(response.id ?? "")
        )
      ).not.toBeNull()
    })

    it("should keep the entity, the entity id and the action", async () => {
      const useCase = new CreateAuditLogUseCase(
        auditLogRepository
      )

      const response = await useCase.execute({
        entity: "Portfolio",
        entityId: "portfolio-1",
        action: "UPDATED",
      })

      expect(response.entity).toBe("Portfolio")
      expect(response.entityId).toBe("portfolio-1")
      expect(response.action).toBe("UPDATED")
    })

    it("should store the changes the caller reported", async () => {
      const useCase = new CreateAuditLogUseCase(
        auditLogRepository
      )

      const response = await useCase.execute({
        entity: "Portfolio",
        entityId: "portfolio-1",
        action: "UPDATED",
        changes: { name: "Renda Fixa" },
      })

      expect(response.changes).toEqual({ name: "Renda Fixa" })
    })

    it("should store null changes when the caller reports none", async () => {
      const useCase = new CreateAuditLogUseCase(
        auditLogRepository
      )

      const response = await useCase.execute({
        entity: "Portfolio",
        entityId: "portfolio-1",
        action: "CREATED",
        changes: null,
      })

      expect(response.changes).toBeNull()
    })

    it("should keep the acting user the caller reported", async () => {
      const useCase = new CreateAuditLogUseCase(
        auditLogRepository
      )

      const response = await useCase.execute({
        entity: "User",
        entityId: "user-1",
        action: "CREATED",
        userId: "user-9",
      })

      expect(response.userId).toBe("user-9")
    })

    it("should store null user when the caller reports none", async () => {
      const useCase = new CreateAuditLogUseCase(
        auditLogRepository
      )

      const response = await useCase.execute({
        entity: "Portfolio",
        entityId: "portfolio-1",
        action: "CREATED",
        userId: null,
      })

      expect(response.userId).toBeNull()
    })

    it("should stamp the entry with the creation date", async () => {
      const useCase = new CreateAuditLogUseCase(
        auditLogRepository
      )

      const response = await useCase.execute({
        entity: "Portfolio",
        entityId: "portfolio-1",
        action: "CREATED",
      })

      expect(response.createdAt).toBeDefined()
      expect(
        new Date(response.createdAt).getTime()
      ).not.toBeNaN()
    })

    it("should keep every entry it created side by side", async () => {
      const useCase = new CreateAuditLogUseCase(
        auditLogRepository
      )

      await useCase.execute({
        entity: "Portfolio",
        entityId: "portfolio-1",
        action: "CREATED",
      })
      await useCase.execute({
        entity: "Portfolio",
        entityId: "portfolio-2",
        action: "UPDATED",
      })

      expect((await auditLogRepository.findAll()).length).toBe(2)
    })
  })
})
