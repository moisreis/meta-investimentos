import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { Verification } from "@/domain/verification/entities/verification.entity"
import { VerificationRepository } from "@/infrastructure/verification/repositories/verification.repository"
import { EntityId } from "@/value-objects"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildVerification } from "__tests__/__setup__/_factories.setup"
import { seedVerification } from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create("missing-verification-id")
const EXPIRES_AT = new Date("2026-12-31T23:59:59.000Z")

describe("infrastructure/verification/repositories/verification.repository", () => {
  let repo: VerificationRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new VerificationRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when verification does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return verification when found by id", async () => {
      const seeded = await seedVerification(db, {
        identifier: "alvo@example.com",
        value: "654321",
      })

      const result = await repo.findById(seeded.id)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(seeded.id)
      expect(result!.identifier).toBe("alvo@example.com")
      expect(result!.value).toBe("654321")
      expect(result!.expiresAt).toEqual(EXPIRES_AT)
    })
  })

  describe("findAllByIdentifier", () => {
    it("should return empty array when the identifier is unknown", async () => {
      const result = await repo.findAllByIdentifier(
        "alvo@example.com"
      )

      expect(result).toEqual([])
    })

    it("should return every verification for the identifier", async () => {
      await seedVerification(db, {
        identifier: "alvo@example.com",
        value: "111111",
      })
      await seedVerification(db, {
        identifier: "alvo@example.com",
        value: "222222",
      })
      await seedVerification(db, { value: "333333" })

      const result = await repo.findAllByIdentifier(
        "alvo@example.com"
      )

      expect(result.map((v) => v.value).sort()).toEqual([
        "111111",
        "222222",
      ])
    })
  })

  describe("findAllByIdentifiers", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByIdentifiers([])

      expect(result).toEqual([])
    })

    it("should return verifications across identifiers", async () => {
      await seedVerification(db, {
        identifier: "a@example.com",
      })
      await seedVerification(db, {
        identifier: "b@example.com",
      })

      const result = await repo.findAllByIdentifiers([
        "a@example.com",
        "b@example.com",
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("save", () => {
    it("should insert new verification and assign id", async () => {
      const saved = await repo.save(
        buildVerification({ identifier: "novo@example.com" })
      )

      expect(saved.id).toBeDefined()

      const rows = await repo.findAllByIdentifier(
        "novo@example.com"
      )
      expect(rows.length).toBe(1)
    })

    it("should update existing verification", async () => {
      const seeded = await seedVerification(db, {
        value: "111111",
      })
      const now = new Date("2026-06-15T10:00:00.000Z")

      const updated = await repo.save(
        Verification.create(
          {
            identifier: seeded.identifier,
            value: "999999",
            expiresAt: seeded.expiresAt,
            createdAt: seeded.createdAt,
            updatedAt: now,
          },
          seeded.id
        )
      )

      expect(updated.id).toBe(seeded.id)
      expect(updated.value).toBe("999999")
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        seeded.updatedAt.getTime()
      )
    })

    it("should throw NotFoundError when updating non-existent verification", async () => {
      const ghost = Verification.create(
        {
          identifier: "ghost@example.com",
          value: "000000",
          expiresAt: EXPIRES_AT,
        },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete verification by id", async () => {
      const seeded = await seedVerification(db)

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
