import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { Session } from "@/domain/session/entities/session.entity"
import { SessionRepository } from "@/infrastructure/session/repositories/session.repository"
import { EntityId } from "@/value-objects"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildSession } from "__tests__/__setup__/_factories.setup"
import {
  seedSession,
  seedUser,
} from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)

describe("infrastructure/session/repositories/session.repository", () => {
  let repo: SessionRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new SessionRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when session does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return session when found by id", async () => {
      const seeded = await seedSession(db, {
        ipAddress: "10.0.0.9",
      })

      const result = await repo.findById(seeded.id)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(seeded.id)
      expect(result!.token).toBe(seeded.token)
      expect(result!.ipAddress).toBe("10.0.0.9")
    })
  })

  describe("findByToken", () => {
    it("should return null when token is unknown", async () => {
      const result = await repo.findByToken("unknown-token")

      expect(result).toBeNull()
    })

    it("should return session when found by token", async () => {
      const seeded = await seedSession(db)

      const result = await repo.findByToken(seeded.token)

      expect(result!.id).toBe(seeded.id)
    })
  })

  describe("findAllByUserId", () => {
    it("should return empty array when the user has no sessions", async () => {
      const owner = await seedUser(db)

      const result = await repo.findAllByUserId(owner.id)

      expect(result).toEqual([])
    })

    it("should return only the sessions of the given user", async () => {
      const owner = await seedUser(db)
      await seedSession(db, { userId: owner.id })
      await seedSession(db, { userId: owner.id })
      await seedSession(db)

      const result = await repo.findAllByUserId(owner.id)

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByUserIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByUserIds([])

      expect(result).toEqual([])
    })

    it("should return sessions across multiple users", async () => {
      const first = await seedUser(db)
      const second = await seedUser(db)
      await seedSession(db, { userId: first.id })
      await seedSession(db, { userId: second.id })

      const result = await repo.findAllByUserIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("save", () => {
    it("should insert new session and assign id", async () => {
      const owner = await seedUser(db)

      const saved = await repo.save(
        buildSession({ userId: owner.id })
      )

      expect(saved.id).toBeDefined()

      const rows = await repo.findAllByUserId(owner.id)
      expect(rows.length).toBe(1)
    })

    it("should update existing session", async () => {
      const seeded = await seedSession(db)
      const now = new Date("2026-06-15T10:00:00.000Z")

      const updated = await repo.save(
        Session.create(
          {
            userId: seeded.userId,
            token: "rotated-token",
            expiresAt: seeded.expiresAt,
            ipAddress: "127.0.0.2",
            userAgent: "vitest/2.0",
            createdAt: seeded.createdAt,
            updatedAt: now,
          },
          seeded.id
        )
      )

      expect(updated.id).toBe(seeded.id)
      expect(updated.token).toBe("rotated-token")
      expect(updated.ipAddress).toBe("127.0.0.2")
      expect(updated.userAgent).toBe("vitest/2.0")
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        seeded.updatedAt.getTime()
      )
    })

    it("should throw NotFoundError when updating non-existent session", async () => {
      const owner = await seedUser(db)
      const ghost = Session.create(
        {
          userId: owner.id,
          token: "ghost-token",
          expiresAt: new Date("2026-12-31T23:59:59.000Z"),
        },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete session by id", async () => {
      const seeded = await seedSession(db)

      await repo.delete(seeded.id)

      expect(await repo.findById(seeded.id)).toBeNull()
    })

    it("should do nothing when deleting non-existent id", async () => {
      await expect(
        repo.delete(MISSING_ID)
      ).resolves.toBeUndefined()
    })
  })
})
