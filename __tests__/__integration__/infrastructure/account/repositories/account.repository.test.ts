import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { Account } from "@/domain/account/entities/account.entity"
import { AccountRepository } from "@/infrastructure/account/repositories/account.repository"
import { EntityId } from "@/value-objects"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildAccount } from "__tests__/__setup__/_factories.setup"
import {
  seedAccount,
  seedUser,
} from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)

describe("infrastructure/account/repositories/account.repository", () => {
  let repo: AccountRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new AccountRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when account does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return account when found by id", async () => {
      const seeded = await seedAccount(db, {
        providerId: "google",
        accessToken: "access-token",
      })

      const result = await repo.findById(seeded.id)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(seeded.id)
      expect(result!.providerId).toBe("google")
      expect(result!.accessToken).toBe("access-token")
    })
  })

  describe("findByProviderAndAccountId", () => {
    it("should return null when no account matches", async () => {
      const result = await repo.findByProviderAndAccountId(
        "google",
        "unknown@example.com"
      )

      expect(result).toBeNull()
    })

    it("should return account when provider and account id match", async () => {
      const seeded = await seedAccount(db, {
        providerId: "google",
      })

      const result = await repo.findByProviderAndAccountId(
        "google",
        seeded.accountId
      )

      expect(result!.id).toBe(seeded.id)
    })

    it("should return null when only the provider matches", async () => {
      await seedAccount(db, { providerId: "google" })

      const result = await repo.findByProviderAndAccountId(
        "google",
        "other@example.com"
      )

      expect(result).toBeNull()
    })
  })

  describe("findAllByUserId", () => {
    it("should return empty array when the user has no accounts", async () => {
      const owner = await seedUser(db)

      const result = await repo.findAllByUserId(owner.id)

      expect(result).toEqual([])
    })

    it("should return only the accounts of the given user", async () => {
      const owner = await seedUser(db)
      await seedAccount(db, { userId: owner.id })
      await seedAccount(db, { userId: owner.id })
      await seedAccount(db)

      const result = await repo.findAllByUserId(owner.id)

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByUserIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByUserIds([])

      expect(result).toEqual([])
    })

    it("should return accounts across multiple users", async () => {
      const first = await seedUser(db)
      const second = await seedUser(db)
      await seedAccount(db, { userId: first.id })
      await seedAccount(db, { userId: second.id })

      const result = await repo.findAllByUserIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("save", () => {
    it("should insert new account and assign id", async () => {
      const owner = await seedUser(db)

      const saved = await repo.save(
        buildAccount({ userId: owner.id })
      )

      expect(saved.id).toBeDefined()

      const rows = await repo.findAllByUserId(owner.id)
      expect(rows.length).toBe(1)
    })

    it("should update existing account", async () => {
      const seeded = await seedAccount(db, {
        accessToken: "old-token",
      })
      const now = new Date("2026-06-15T10:00:00.000Z")

      const updated = await repo.save(
        Account.create(
          {
            providerId: seeded.providerId,
            accountId: seeded.accountId,
            userId: seeded.userId,
            accessToken: "new-token",
            refreshToken: seeded.refreshToken,
            idToken: seeded.idToken,
            accessTokenExpiresAt: seeded.accessTokenExpiresAt,
            refreshTokenExpiresAt: seeded.refreshTokenExpiresAt,
            scope: seeded.scope,
            password: seeded.password,
            issuer: seeded.issuer,
            createdAt: seeded.createdAt,
            updatedAt: now,
          },
          seeded.id
        )
      )

      expect(updated.id).toBe(seeded.id)
      expect(updated.accessToken).toBe("new-token")
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        seeded.updatedAt.getTime()
      )
    })

    it("should throw NotFoundError when updating non-existent account", async () => {
      const owner = await seedUser(db)
      const ghost = Account.create(
        {
          providerId: "credential",
          accountId: "ghost@example.com",
          userId: owner.id,
        },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete account by id", async () => {
      const seeded = await seedAccount(db)

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
