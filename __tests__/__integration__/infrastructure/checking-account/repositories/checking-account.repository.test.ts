import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { CheckingAccount } from "@/domain/checking-account/entities/checking-account.entity"
import { CheckingAccountRepository } from "@/infrastructure/checking-account/repositories/checking-account.repository"
import { EntityId } from "@/value-objects"
import { SignedMoney } from "@/value-objects/signed-money.vo"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildCheckingAccount } from "__tests__/__setup__/_factories.setup"
import { seedBankAccount } from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)
const JAN = new Date("2026-01-15T00:00:00.000Z")
const FEB = new Date("2026-02-15T00:00:00.000Z")
const MAR = new Date("2026-03-15T00:00:00.000Z")

describe("infrastructure/checking-account/repositories/checking-account.repository", () => {
  let repo: CheckingAccountRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new CheckingAccountRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when record does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return record when found by id", async () => {
      const account = await seedBankAccount(db)
      const saved = await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
        })
      )

      const result = await repo.findById(saved.id!)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(saved.id)
      expect(result!.bankAccountId).toBe(account.id)
      expect(result!.value.value.toFixed(2)).toBe("1000.00")
    })
  })

  describe("findAll", () => {
    it("should return empty array when no records exist", async () => {
      const result = await repo.findAll()

      expect(result).toEqual([])
    })

    it("should return all records ordered by date descending", async () => {
      const account = await seedBankAccount(db)
      await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: JAN,
        })
      )
      await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: MAR,
        })
      )

      const result = await repo.findAll()

      expect(result.map((c) => c.date)).toEqual([MAR, JAN])
    })

    it("should support pagination with limit and offset", async () => {
      const account = await seedBankAccount(db)
      await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: MAR,
        })
      )
      await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: FEB,
        })
      )
      await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: JAN,
        })
      )

      const page1 = await repo.findAll({ limit: 2, offset: 0 })
      expect(page1.map((c) => c.date)).toEqual([MAR, FEB])

      const page2 = await repo.findAll({ limit: 2, offset: 2 })
      expect(page2.map((c) => c.date)).toEqual([JAN])
    })
  })

  describe("findAllByBankAccountId", () => {
    it("should return empty array when the bank account has none", async () => {
      const account = await seedBankAccount(db)

      const result = await repo.findAllByBankAccountId(
        account.id
      )

      expect(result).toEqual([])
    })

    it("should return records of the bank account", async () => {
      const account = await seedBankAccount(db)
      await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: JAN,
        })
      )

      const result = await repo.findAllByBankAccountId(
        account.id
      )

      expect(result.length).toBe(1)
    })
  })

  describe("findAllByBankAccountIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByBankAccountIds([])

      expect(result).toEqual([])
    })

    it("should return records across multiple bank accounts", async () => {
      const first = await seedBankAccount(db)
      const second = await seedBankAccount(db)
      await repo.save(
        buildCheckingAccount({ bankAccountId: first.id })
      )
      await repo.save(
        buildCheckingAccount({ bankAccountId: second.id })
      )

      const result = await repo.findAllByBankAccountIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByBankAccountIdsInPeriod", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByBankAccountIdsInPeriod(
        [],
        JAN,
        FEB
      )

      expect(result).toEqual([])
    })

    it("should only return records inside the inclusive period", async () => {
      const account = await seedBankAccount(db)
      await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: JAN,
        })
      )
      await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: FEB,
        })
      )
      await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: MAR,
        })
      )

      const result = await repo.findAllByBankAccountIdsInPeriod(
        [account.id],
        JAN,
        FEB
      )

      expect(result.map((c) => c.date)).toEqual([JAN, FEB])
    })
  })

  describe("findByBankAccountIdAndDate", () => {
    it("should return null when no record matches", async () => {
      const account = await seedBankAccount(db)

      const result = await repo.findByBankAccountIdAndDate(
        account.id,
        JAN
      )

      expect(result).toBeNull()
    })

    it("should return record when bank account and date match", async () => {
      const account = await seedBankAccount(db)
      await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: JAN,
          value: SignedMoney.create("-250.50"),
        })
      )

      const result = await repo.findByBankAccountIdAndDate(
        account.id,
        JAN
      )

      expect(result!.value.value.toFixed(2)).toBe("-250.50")
    })
  })

  describe("findAllByIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByIds([])

      expect(result).toEqual([])
    })

    it("should return matching records by ids", async () => {
      const account = await seedBankAccount(db)
      const first = await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: JAN,
        })
      )
      const second = await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: FEB,
        })
      )

      const result = await repo.findAllByIds([
        first.id!,
        second.id!,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("save", () => {
    it("should insert new record and assign id", async () => {
      const account = await seedBankAccount(db)

      const saved = await repo.save(
        buildCheckingAccount({ bankAccountId: account.id })
      )

      expect(saved.id).toBeDefined()

      const rows = await repo.findAllByBankAccountId(account.id)
      expect(rows.length).toBe(1)
    })

    it("should update existing record", async () => {
      const account = await seedBankAccount(db)
      const saved = await repo.save(
        buildCheckingAccount({ bankAccountId: account.id })
      )

      const updated = await repo.save(
        saved.updateValue(SignedMoney.create("-42.00"))
      )

      expect(updated.id).toBe(saved.id)
      expect(updated.value.value.toFixed(2)).toBe("-42.00")
    })

    it("should throw NotFoundError when updating non-existent record", async () => {
      const account = await seedBankAccount(db)
      const ghost = CheckingAccount.create(
        {
          bankAccountId: account.id,
          date: JAN,
          value: SignedMoney.create("10.00"),
        },
        MISSING_ID
      )

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })
  })

  describe("delete", () => {
    it("should delete record by id", async () => {
      const account = await seedBankAccount(db)
      const saved = await repo.save(
        buildCheckingAccount({ bankAccountId: account.id })
      )

      await repo.delete(saved.id!)

      expect(await repo.findById(saved.id!)).toBeNull()
    })

    it("should do nothing when deleting non-existent id", async () => {
      await expect(
        repo.delete(MISSING_ID)
      ).resolves.toBeUndefined()
    })
  })

  describe("deleteByIds", () => {
    it("should do nothing for empty array", async () => {
      await expect(repo.deleteByIds([])).resolves.toBeUndefined()
    })

    it("should delete multiple records by ids", async () => {
      const account = await seedBankAccount(db)
      const first = await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: JAN,
        })
      )
      const second = await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: FEB,
        })
      )
      const kept = await repo.save(
        buildCheckingAccount({
          bankAccountId: account.id,
          date: MAR,
        })
      )

      await repo.deleteByIds([first.id!, second.id!])

      expect((await repo.findAll()).map((c) => c.id)).toEqual([
        kept.id,
      ])
    })
  })
})
