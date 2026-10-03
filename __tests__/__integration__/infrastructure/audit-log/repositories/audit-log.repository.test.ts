import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { AuditLogRepository } from "@/infrastructure/audit-log/repositories/audit-log.repository"
import { EntityId } from "@/value-objects"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildAuditLog } from "__tests__/__setup__/_factories.setup"
import {
  seedAuditLog,
  seedUser,
} from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)
const ENTITY_ID = EntityId.create(
  "11111111-1111-1111-1111-111111111111"
)
const OTHER_ENTITY_ID = EntityId.create(
  "22222222-2222-2222-2222-222222222222"
)

describe("infrastructure/audit-log/repositories/audit-log.repository", () => {
  let repo: AuditLogRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new AuditLogRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when audit log does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return audit log when found by id", async () => {
      const actor = await seedUser(db)
      const seeded = await seedAuditLog(db, {
        userId: actor.id,
        changes: { name: "Novo" },
      })

      const result = await repo.findById(seeded.id)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(seeded.id)
      expect(result!.entity).toBe("Portfolio")
      expect(result!.action).toBe("UPDATE")
      expect(result!.changes).toEqual({ name: "Novo" })
      expect(result!.userId).toBe(actor.id)
    })
  })

  describe("findAll", () => {
    it("should return empty array when no audit logs exist", async () => {
      const result = await repo.findAll()

      expect(result).toEqual([])
    })

    it("should return all audit logs ordered by createdAt descending", async () => {
      await seedAuditLog(db, {
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      })
      await seedAuditLog(db, {
        createdAt: new Date("2026-03-01T00:00:00.000Z"),
      })
      await seedAuditLog(db, {
        createdAt: new Date("2026-02-01T00:00:00.000Z"),
      })

      const result = await repo.findAll()

      expect(result.map((a) => a.createdAt)).toEqual([
        new Date("2026-03-01T00:00:00.000Z"),
        new Date("2026-02-01T00:00:00.000Z"),
        new Date("2026-01-01T00:00:00.000Z"),
      ])
    })
  })

  describe("findAllByEntity", () => {
    it("should return empty array when the entity is unknown", async () => {
      const result = await repo.findAllByEntity("Position")

      expect(result).toEqual([])
    })

    it("should return only the audit logs of the entity", async () => {
      await seedAuditLog(db, { entity: "Portfolio" })
      await seedAuditLog(db, { entity: "Portfolio" })
      await seedAuditLog(db, { entity: "Position" })

      const result = await repo.findAllByEntity("Portfolio")

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByEntityAndEntityId", () => {
    it("should return empty array when no match exists", async () => {
      await seedAuditLog(db, { entity: "Portfolio" })

      const result = await repo.findAllByEntityAndEntityId(
        "Portfolio",
        ENTITY_ID
      )

      expect(result).toEqual([])
    })

    it("should return audit logs matching both fields", async () => {
      await seedAuditLog(db, {
        entity: "Portfolio",
        entityId: ENTITY_ID,
      })
      await seedAuditLog(db, {
        entity: "Portfolio",
        entityId: OTHER_ENTITY_ID,
      })
      await seedAuditLog(db, {
        entity: "Position",
        entityId: ENTITY_ID,
      })

      const result = await repo.findAllByEntityAndEntityId(
        "Portfolio",
        ENTITY_ID
      )

      expect(result.length).toBe(1)
      expect(result[0].entityId).toBe(ENTITY_ID)
    })
  })

  describe("findAllByEntityAndEntityIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByEntityAndEntityIds(
        "Portfolio",
        []
      )

      expect(result).toEqual([])
    })

    it("should return audit logs across multiple entity ids", async () => {
      await seedAuditLog(db, {
        entity: "Portfolio",
        entityId: ENTITY_ID,
      })
      await seedAuditLog(db, {
        entity: "Portfolio",
        entityId: OTHER_ENTITY_ID,
      })
      await seedAuditLog(db, { entity: "Position" })

      const result = await repo.findAllByEntityAndEntityIds(
        "Portfolio",
        [ENTITY_ID, OTHER_ENTITY_ID]
      )

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByUserId", () => {
    it("should return empty array when the user has no entries", async () => {
      const user = await seedUser(db)

      const result = await repo.findAllByUserId(user.id)

      expect(result).toEqual([])
    })

    it("should return only the audit logs of the given user", async () => {
      const user = await seedUser(db)
      await seedAuditLog(db, { userId: user.id })
      await seedAuditLog(db, { userId: user.id })
      await seedAuditLog(db, { userId: null })

      const result = await repo.findAllByUserId(user.id)

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByUserIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByUserIds([])

      expect(result).toEqual([])
    })

    it("should return audit logs across multiple users", async () => {
      const first = await seedUser(db)
      const second = await seedUser(db)
      await seedAuditLog(db, { userId: first.id })
      await seedAuditLog(db, { userId: second.id })

      const result = await repo.findAllByUserIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("save", () => {
    it("should always insert a new row even when an id is present", async () => {
      const first = await seedAuditLog(db)

      const second = await repo.save(
        buildAuditLog({ id: first.id })
      )

      expect(second.id).not.toBe(first.id)

      const rows = await repo.findAll()
      expect(rows.length).toBe(2)
    })

    it("should persist null userId", async () => {
      const seeded = await seedAuditLog(db, { userId: null })

      const result = await repo.findById(seeded.id)

      expect(result!.userId).toBeNull()
    })
  })
})
