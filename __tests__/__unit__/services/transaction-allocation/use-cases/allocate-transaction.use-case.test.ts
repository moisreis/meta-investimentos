import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "vitest"

import { AllocateTransactionUseCase } from "@/services/transaction-allocation/use-cases/allocate-transaction.use-case"
import { NotFoundError } from "@errors/not-found.error"
import {
  createFakeApplicationRepository,
  createFakeTransactionAllocationRepository,
  createFakeWithdrawalRepository,
} from "__tests__/__setup__/_fakes.setup"
import {
  buildApplication,
  buildEntityId,
  buildWithdrawal,
} from "__tests__/__setup__/_factories.setup"
import {
  useFixedClock,
  useRealClock,
  getFixedDate,
} from "__tests__/__setup__/_clock.setup"

const APPLICATION_ID = "application-1"
const WITHDRAWAL_ID = "withdrawal-1"

describe("services/transaction-allocation/use-cases/allocate-transaction.use-case", () => {
  let transactionAllocationRepository: ReturnType<
    typeof createFakeTransactionAllocationRepository
  >
  let applicationRepository: ReturnType<
    typeof createFakeApplicationRepository
  >
  let withdrawalRepository: ReturnType<
    typeof createFakeWithdrawalRepository
  >

  beforeEach(() => {
    useFixedClock()
    transactionAllocationRepository =
      createFakeTransactionAllocationRepository()
    applicationRepository = createFakeApplicationRepository()
    withdrawalRepository = createFakeWithdrawalRepository()
  })

  afterEach(() => {
    useRealClock()
  })

  describe("execute", () => {
    it("should persist one allocation built from the payload when both rows exist", async () => {
      await applicationRepository.save(
        buildApplication({ id: buildEntityId(APPLICATION_ID) })
      )
      await withdrawalRepository.save(
        buildWithdrawal({ id: buildEntityId(WITHDRAWAL_ID) })
      )
      const useCase = new AllocateTransactionUseCase(
        transactionAllocationRepository,
        applicationRepository,
        withdrawalRepository
      )

      const response = await useCase.execute({
        applicationId: APPLICATION_ID,
        withdrawId: WITHDRAWAL_ID,
        quotasConsumed: "250.25",
      })

      const stored =
        await transactionAllocationRepository.findAllByWithdrawalId(
          buildEntityId(WITHDRAWAL_ID)
        )

      expect(stored.length).toBe(1)
      expect(response.applicationId).toBe(APPLICATION_ID)
      expect(response.withdrawId).toBe(WITHDRAWAL_ID)
      expect(response.quotasConsumed).toBe("250.25")
    })

    it("should expose an assigned id and the creation timestamp when allocating", async () => {
      await applicationRepository.save(
        buildApplication({ id: buildEntityId(APPLICATION_ID) })
      )
      await withdrawalRepository.save(
        buildWithdrawal({ id: buildEntityId(WITHDRAWAL_ID) })
      )
      const useCase = new AllocateTransactionUseCase(
        transactionAllocationRepository,
        applicationRepository,
        withdrawalRepository
      )

      const response = await useCase.execute({
        applicationId: APPLICATION_ID,
        withdrawId: WITHDRAWAL_ID,
        quotasConsumed: "250.25",
      })

      expect(response.id).toBeDefined()
      expect(response.createdAt).toBe(
        getFixedDate().toISOString()
      )
    })

    it("should throw NotFoundError when the application does not exist", async () => {
      await withdrawalRepository.save(
        buildWithdrawal({ id: buildEntityId(WITHDRAWAL_ID) })
      )
      const useCase = new AllocateTransactionUseCase(
        transactionAllocationRepository,
        applicationRepository,
        withdrawalRepository
      )

      await expect(
        useCase.execute({
          applicationId: APPLICATION_ID,
          withdrawId: WITHDRAWAL_ID,
          quotasConsumed: "250.25",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should throw NotFoundError when the withdrawal does not exist", async () => {
      await applicationRepository.save(
        buildApplication({ id: buildEntityId(APPLICATION_ID) })
      )
      const useCase = new AllocateTransactionUseCase(
        transactionAllocationRepository,
        applicationRepository,
        withdrawalRepository
      )

      await expect(
        useCase.execute({
          applicationId: APPLICATION_ID,
          withdrawId: WITHDRAWAL_ID,
          quotasConsumed: "250.25",
        })
      ).rejects.toThrow(NotFoundError)
    })

    it("should not persist an allocation when the withdrawal does not exist", async () => {
      await applicationRepository.save(
        buildApplication({ id: buildEntityId(APPLICATION_ID) })
      )
      const useCase = new AllocateTransactionUseCase(
        transactionAllocationRepository,
        applicationRepository,
        withdrawalRepository
      )

      await expect(
        useCase.execute({
          applicationId: APPLICATION_ID,
          withdrawId: WITHDRAWAL_ID,
          quotasConsumed: "250.25",
        })
      ).rejects.toThrow(NotFoundError)

      const stored =
        await transactionAllocationRepository.findAllByApplicationId(
          buildEntityId(APPLICATION_ID)
        )

      expect(stored.length).toBe(0)
    })
  })
})
