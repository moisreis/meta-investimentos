import { describe, it, expect, beforeEach } from "vitest"

import { CreateBankUseCase } from "@/services/bank/use-cases/create-bank.use-case"
import { createFakeBankRepository } from "__tests__/__setup__/_fakes.setup"
import { buildBank } from "__tests__/__setup__/_factories.setup"

describe("services/bank/use-cases/create-bank.use-case", () => {
  let bankRepository: ReturnType<typeof createFakeBankRepository>

  beforeEach(() => {
    bankRepository = createFakeBankRepository()
  })

  describe("execute", () => {
    it("should persist a bank built from the payload when creating a bank", async () => {
      const useCase = new CreateBankUseCase(bankRepository)

      const response = await useCase.execute({
        code: "237",
        name: "Banco Bradesco",
      })

      expect(response.code).toBe("237")
      expect(response.name).toBe("Banco Bradesco")
      expect(response.id).toBeDefined()
    })

    it("should store exactly one row when creating a bank", async () => {
      const useCase = new CreateBankUseCase(bankRepository)

      await useCase.execute({
        code: "341",
        name: "Banco Itau",
      })

      const stored = await bankRepository.findAll({})

      expect(stored.length).toBe(1)
    })

    it("should throw ValidationError when the code is blank", async () => {
      const useCase = new CreateBankUseCase(bankRepository)

      await expect(
        useCase.execute({ code: "   ", name: "Banco Bradesco" })
      ).rejects.toThrow()
    })

    it("should keep the previous rows when creating a bank", async () => {
      await bankRepository.save(buildBank({ code: "001" }))
      const useCase = new CreateBankUseCase(bankRepository)

      await useCase.execute({
        code: "341",
        name: "Banco Itau",
      })

      const stored = await bankRepository.findAll({})

      expect(stored.length).toBe(2)
    })
  })
})
