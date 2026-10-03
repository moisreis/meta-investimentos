import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"
import { eq } from "drizzle-orm"

import { User } from "@/domain/user/entities/user.entity"
import { UserRepository } from "@/infrastructure/user/repositories/user.repository"
import { user } from "@/database/schemas"
import { EntityId } from "@/value-objects"
import { CPF } from "@/value-objects/cpf.vo"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import {
  buildCpf,
  buildUniqueCpf,
  buildUser,
} from "__tests__/__setup__/_factories.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)
const NOW = new Date("2026-06-15T10:00:00.000Z")

describe("infrastructure/user/repositories/user.repository", () => {
  let repo: UserRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new UserRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when user does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return user when found by id", async () => {
      const saved = await repo.save(buildUser())

      const result = await repo.findById(saved.id!)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(saved.id)
      expect(result!.email).toBe("test@example.com")
      expect(result!.cpf.value).toBe("52998224725")
    })
  })

  describe("findByEmail", () => {
    it("should return null when user does not exist", async () => {
      const result = await repo.findByEmail("nobody@example.com")

      expect(result).toBeNull()
    })

    it("should return user when found by email", async () => {
      await repo.save(buildUser({ email: "unique@example.com" }))

      const result = await repo.findByEmail("unique@example.com")

      expect(result).not.toBeNull()
      expect(result!.email).toBe("unique@example.com")
    })
  })

  describe("findByCpf", () => {
    it("should return null when user does not exist", async () => {
      const result = await repo.findByCpf(
        buildCpf("11144477735") as CPF
      )

      expect(result).toBeNull()
    })

    it("should return user when found by cpf", async () => {
      await repo.save(buildUser({ cpf: buildCpf() }))

      const result = await repo.findByCpf(buildCpf() as CPF)

      expect(result).not.toBeNull()
      expect(result!.cpf.value).toBe("52998224725")
    })
  })

  describe("findAll", () => {
    it("should return empty array when no users exist", async () => {
      const result = await repo.findAll()

      expect(result).toEqual([])
    })

    it("should return all users ordered by createdAt", async () => {
      await repo.save(
        buildUser({
          email: "b@example.com",
          cpf: buildUniqueCpf("111444777"),
          createdAt: new Date("2026-02-01T00:00:00.000Z"),
        })
      )
      await repo.save(
        buildUser({
          email: "a@example.com",
          cpf: buildUniqueCpf("268408670"),
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        })
      )

      const result = await repo.findAll()

      expect(result.map((u) => u.email)).toEqual([
        "a@example.com",
        "b@example.com",
      ])
    })

    it("should support pagination with limit and offset", async () => {
      await repo.save(
        buildUser({
          email: "a@example.com",
          cpf: buildUniqueCpf("111444777"),
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        })
      )
      await repo.save(
        buildUser({
          email: "b@example.com",
          cpf: buildUniqueCpf("268408670"),
          createdAt: new Date("2026-02-01T00:00:00.000Z"),
        })
      )
      await repo.save(
        buildUser({
          email: "c@example.com",
          cpf: buildUniqueCpf("390533447"),
          createdAt: new Date("2026-03-01T00:00:00.000Z"),
        })
      )

      const page1 = await repo.findAll({ limit: 2, offset: 0 })
      expect(page1.map((u) => u.email)).toEqual([
        "a@example.com",
        "b@example.com",
      ])

      const page2 = await repo.findAll({ limit: 2, offset: 2 })
      expect(page2.map((u) => u.email)).toEqual([
        "c@example.com",
      ])
    })
  })

  describe("findAllByIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByIds([])

      expect(result).toEqual([])
    })

    it("should return matching users by ids", async () => {
      const first = await repo.save(
        buildUser({
          email: "a@example.com",
          cpf: buildUniqueCpf("111444777"),
        })
      )
      const second = await repo.save(
        buildUser({
          email: "b@example.com",
          cpf: buildUniqueCpf("268408670"),
        })
      )

      const result = await repo.findAllByIds([
        first.id!,
        second.id!,
      ])

      expect(result.length).toBe(2)
      expect(result.map((u) => u.email).sort()).toEqual([
        "a@example.com",
        "b@example.com",
      ])
    })

    it("should only return existing ids", async () => {
      const first = await repo.save(buildUser())

      const result = await repo.findAllByIds([
        first.id!,
        MISSING_ID,
      ])

      expect(result.length).toBe(1)
    })
  })

  describe("save", () => {
    it("should insert new user and assign id", async () => {
      const saved = await repo.save(buildUser())

      expect(saved.id).toBeDefined()

      const rows = await db
        .select()
        .from(user)
        .where(eq(user.email, "test@example.com"))
        .execute()

      expect(rows.length).toBe(1)
    })

    it("should update existing user", async () => {
      const saved = await repo.save(buildUser())

      const updated = await repo.save(
        saved.updateProfile({ name: "Nome Atualizado" }, NOW)
      )

      expect(updated.id).toBe(saved.id)
      expect(updated.name).toBe("Nome Atualizado")

      const rows = await db
        .select()
        .from(user)
        .where(eq(user.id, saved.id!))
        .execute()

      expect(rows[0].name).toBe("Nome Atualizado")
    })

    it("should throw NotFoundError when updating non-existent user", async () => {
      const ghost = User.create(
        {
          name: "Fantasma",
          email: "ghost@example.com",
          firstName: "Fantasma",
          lastName: "User",
          cpf: buildCpf(),
        },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete user by id", async () => {
      const saved = await repo.save(buildUser())

      await repo.delete(saved.id!)

      expect(await repo.findById(saved.id!)).toBeNull()
    })

    it("should do nothing when deleting non-existent id", async () => {
      await expect(
        repo.delete(MISSING_ID)
      ).resolves.toBeUndefined()
    })
  })
})
