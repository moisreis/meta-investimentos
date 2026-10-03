import { describe, it, expect } from "vitest"

import { Bank } from "@/domain/bank/entities/bank.entity"
import {
  toCreateBankProps,
  toResponseDTO,
} from "@/services/bank/mappers/bank.mapper"
import {
  buildBank,
  buildEntityId,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000001"

describe("services/bank/mappers/bank.mapper", () => {
  describe("toCreateBankProps", () => {
    it("should carry the code and name of the payload when mapping a create DTO", () => {
      const props = toCreateBankProps({
        code: "237",
        name: "Banco Bradesco",
      })

      expect(props.code).toBe("237")
      expect(props.name).toBe("Banco Bradesco")
    })

    it("should produce props accepted by Bank.create when mapping a create DTO", () => {
      const props = toCreateBankProps({
        code: "341",
        name: "Banco Itau",
      })

      expect(() => Bank.create(props)).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a bank", () => {
      const bank = buildBank({ id: buildEntityId(ID) })

      const response = toResponseDTO(bank)

      expect(response.id).toBe(ID)
    })

    it("should expose the timestamps as ISO 8601 strings when serializing a bank", () => {
      const bank = buildBank({
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-15T12:00:00.000Z"),
      })

      const response = toResponseDTO(bank)

      expect(response.createdAt).toBe("2026-01-01T00:00:00.000Z")
      expect(response.updatedAt).toBe("2026-02-15T12:00:00.000Z")
    })

    it("should carry the code and name when serializing a bank", () => {
      const bank = buildBank({
        code: "001",
        name: "Banco do Brasil",
      })

      const response = toResponseDTO(bank)

      expect(response.code).toBe("001")
      expect(response.name).toBe("Banco do Brasil")
    })
  })
})
