import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest"

import { TransactionAllocation } from "@/domain/transaction-allocation/entities/transaction-allocation.entity"
import { TransactionAllocationRepository } from "@/infrastructure/transaction-allocation/repositories/transaction-allocation.repository"
import { EntityId } from "@/value-objects"
import { QuotaQuantity } from "@/value-objects/quota-quantity.vo"
import { ConcurrencyError } from "@/errors/concurrency.error"
import { NotFoundError } from "@/errors/not-found.error"
import {
  getTestDb,
  applyMigrationsOnce,
  resetDatabase,
  closeDatabase,
} from "__tests__/__setup__/_database.setup"
import { buildTransactionAllocation } from "__tests__/__setup__/_factories.setup"
import {
  seedApplication,
  seedWithdrawal,
} from "__tests__/__setup__/_seeds.setup"

const MISSING_ID = EntityId.create(
  "00000000-0000-0000-0000-000000000000"
)

describe("infrastructure/transaction-allocation/repositories/transaction-allocation.repository", () => {
  let repo: TransactionAllocationRepository
  let db: ReturnType<typeof getTestDb>

  beforeAll(async () => {
    await applyMigrationsOnce()
    db = getTestDb()
    repo = new TransactionAllocationRepository(db)
  }, 120_000)

  beforeEach(async () => {
    await resetDatabase()
  })

  afterAll(async () => {
    await closeDatabase()
  })

  describe("findById", () => {
    it("should return null when allocation does not exist", async () => {
      const result = await repo.findById(MISSING_ID)

      expect(result).toBeNull()
    })

    it("should return allocation when found by id", async () => {
      const application = await seedApplication(db)
      const withdrawal = await seedWithdrawal(db)

      const saved = await repo.save(
        buildTransactionAllocation({
          applicationId: application.id,
          withdrawId: withdrawal.id,
        })
      )

      const result = await repo.findById(saved.id!)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(saved.id)
      expect(result!.applicationId).toBe(application.id)
      expect(result!.withdrawId).toBe(withdrawal.id)
      expect(result!.quotasConsumed.value.toFixed(2)).toBe(
        "100.00"
      )
    })
  })

  describe("findAllByApplicationId", () => {
    it("should return empty array when nothing matches", async () => {
      const application = await seedApplication(db)

      const result = await repo.findAllByApplicationId(
        application.id
      )

      expect(result).toEqual([])
    })

    it("should return every allocation of the application", async () => {
      const application = await seedApplication(db)
      const firstWithdrawal = await seedWithdrawal(db)
      const secondWithdrawal = await seedWithdrawal(db)
      await repo.save(
        buildTransactionAllocation({
          applicationId: application.id,
          withdrawId: firstWithdrawal.id,
        })
      )
      await repo.save(
        buildTransactionAllocation({
          applicationId: application.id,
          withdrawId: secondWithdrawal.id,
        })
      )

      const result = await repo.findAllByApplicationId(
        application.id
      )

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByApplicationIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByApplicationIds([])

      expect(result).toEqual([])
    })

    it("should return allocations across multiple applications", async () => {
      const first = await seedApplication(db)
      const second = await seedApplication(db)
      const firstWithdrawal = await seedWithdrawal(db)
      const secondWithdrawal = await seedWithdrawal(db)
      await repo.save(
        buildTransactionAllocation({
          applicationId: first.id,
          withdrawId: firstWithdrawal.id,
        })
      )
      await repo.save(
        buildTransactionAllocation({
          applicationId: second.id,
          withdrawId: secondWithdrawal.id,
        })
      )

      const result = await repo.findAllByApplicationIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByWithdrawalId", () => {
    it("should return empty array when nothing matches", async () => {
      const withdrawal = await seedWithdrawal(db)

      const result = await repo.findAllByWithdrawalId(
        withdrawal.id
      )

      expect(result).toEqual([])
    })

    it("should return every allocation of the withdrawal", async () => {
      const withdrawal = await seedWithdrawal(db)
      const firstApplication = await seedApplication(db)
      const secondApplication = await seedApplication(db)
      await repo.save(
        buildTransactionAllocation({
          applicationId: firstApplication.id,
          withdrawId: withdrawal.id,
        })
      )
      await repo.save(
        buildTransactionAllocation({
          applicationId: secondApplication.id,
          withdrawId: withdrawal.id,
        })
      )

      const result = await repo.findAllByWithdrawalId(
        withdrawal.id
      )

      expect(result.length).toBe(2)
    })
  })

  describe("findAllByWithdrawIds", () => {
    it("should return empty array for empty input", async () => {
      const result = await repo.findAllByWithdrawIds([])

      expect(result).toEqual([])
    })

    it("should return allocations across multiple withdrawals", async () => {
      const first = await seedWithdrawal(db)
      const second = await seedWithdrawal(db)
      const firstApplication = await seedApplication(db)
      const secondApplication = await seedApplication(db)
      await repo.save(
        buildTransactionAllocation({
          applicationId: firstApplication.id,
          withdrawId: first.id,
        })
      )
      await repo.save(
        buildTransactionAllocation({
          applicationId: secondApplication.id,
          withdrawId: second.id,
        })
      )

      const result = await repo.findAllByWithdrawIds([
        first.id,
        second.id,
      ])

      expect(result.length).toBe(2)
    })
  })

  describe("sumQuotasConsumedByApplicationId", () => {
    it("should return null when the application has no allocations", async () => {
      const application = await seedApplication(db)

      const result = await repo.sumQuotasConsumedByApplicationId(
        application.id
      )

      expect(result).toBeNull()
    })

    it("should sum the consumed quotas", async () => {
      const application = await seedApplication(db)
      const firstWithdrawal = await seedWithdrawal(db)
      const secondWithdrawal = await seedWithdrawal(db)
      await repo.save(
        buildTransactionAllocation({
          applicationId: application.id,
          withdrawId: firstWithdrawal.id,
          quotasConsumed: QuotaQuantity.create("10.50"),
        })
      )
      await repo.save(
        buildTransactionAllocation({
          applicationId: application.id,
          withdrawId: secondWithdrawal.id,
          quotasConsumed: QuotaQuantity.create("4.25"),
        })
      )

      const result = await repo.sumQuotasConsumedByApplicationId(
        application.id
      )

      expect(result!.value.toFixed(2)).toBe("14.75")
    })
  })

  describe("save", () => {
    it("should insert new allocation and assign id", async () => {
      const application = await seedApplication(db)
      const withdrawal = await seedWithdrawal(db)

      const saved = await repo.save(
        buildTransactionAllocation({
          applicationId: application.id,
          withdrawId: withdrawal.id,
        })
      )

      expect(saved.id).toBeDefined()
      expect(saved.version).toBe(0)

      const rows = await repo.findAllByApplicationId(
        application.id
      )
      expect(rows.length).toBe(1)
    })

    it("should update existing allocation and bump the version", async () => {
      const application = await seedApplication(db)
      const withdrawal = await seedWithdrawal(db)
      const saved = await repo.save(
        buildTransactionAllocation({
          applicationId: application.id,
          withdrawId: withdrawal.id,
        })
      )

      const updated = await repo.save(
        TransactionAllocation.create(
          {
            applicationId: saved.applicationId,
            withdrawId: saved.withdrawId,
            quotasConsumed: QuotaQuantity.create("25.00"),
            createdAt: saved.createdAt,
          },
          saved.id
        )
      )

      expect(updated.id).toBe(saved.id)
      expect(updated.version).toBe(1)

      const rows = await repo.findAllByApplicationId(
        application.id
      )
      expect(rows[0].quotasConsumed.value.toFixed(2)).toBe(
        "25.00"
      )
    })

    it("should throw ConcurrencyError when the version is stale", async () => {
      const application = await seedApplication(db)
      const withdrawal = await seedWithdrawal(db)
      const saved = await repo.save(
        buildTransactionAllocation({
          applicationId: application.id,
          withdrawId: withdrawal.id,
        })
      )

      await repo.save(
        TransactionAllocation.create(
          {
            applicationId: saved.applicationId,
            withdrawId: saved.withdrawId,
            quotasConsumed: QuotaQuantity.create("25.00"),
            createdAt: saved.createdAt,
          },
          saved.id
        )
      )

      await expect(
        repo.save(
          TransactionAllocation.create(
            {
              applicationId: saved.applicationId,
              withdrawId: saved.withdrawId,
              quotasConsumed: QuotaQuantity.create("30.00"),
              createdAt: saved.createdAt,
            },
            saved.id
          )
        )
      ).rejects.toThrow(ConcurrencyError)
    })

    it("should throw NotFoundError when updating non-existent allocation", async () => {
      const application = await seedApplication(db)
      const withdrawal = await seedWithdrawal(db)
      const ghost = buildTransactionAllocation({
        applicationId: application.id,
        withdrawId: withdrawal.id,
        id: MISSING_ID,
      })

      await expect(repo.save(ghost)).rejects.toThrow(
        NotFoundError
      )
    })

    it("should reject a duplicate application/withdrawal pair", async () => {
      const application = await seedApplication(db)
      const withdrawal = await seedWithdrawal(db)
      await repo.save(
        buildTransactionAllocation({
          applicationId: application.id,
          withdrawId: withdrawal.id,
        })
      )

      await expect(
        repo.save(
          buildTransactionAllocation({
            applicationId: application.id,
            withdrawId: withdrawal.id,
          })
        )
      ).rejects.toThrow()
    })
  })

  describe("delete", () => {
    it("should delete allocation by id", async () => {
      const application = await seedApplication(db)
      const withdrawal = await seedWithdrawal(db)
      const saved = await repo.save(
        buildTransactionAllocation({
          applicationId: application.id,
          withdrawId: withdrawal.id,
        })
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
})
