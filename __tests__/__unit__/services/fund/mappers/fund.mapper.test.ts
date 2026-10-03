import { describe, it, expect } from "vitest"

import { Fund } from "@/domain/fund/entities/fund.entity"
import {
  toCreateFundProps,
  toResponseDTO,
} from "@/services/fund/mappers/fund.mapper"
import {
  buildCnpj,
  buildEntityId,
  buildFund,
  buildSignedPercentage,
} from "__tests__/__setup__/_factories.setup"

const ID = "00000000-0000-0000-0000-000000000004"

describe("services/fund/mappers/fund.mapper", () => {
  describe("toCreateFundProps", () => {
    it("should convert the cnpj into a CNPJ value object when mapping a create DTO", () => {
      const props = toCreateFundProps({
        cnpj: "11.222.333/0001-81",
        name: "Fundo Master",
        bankId: "bank-1",
      })

      expect(props.cnpj.value).toBe("11222333000181")
      expect(props.cnpj.value).toBe(
        buildCnpj("11222333000181").value
      )
    })

    it("should carry the name when mapping a create DTO", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Exemplo",
        bankId: "bank-1",
      })

      expect(props.name).toBe("Fundo Exemplo")
    })

    it("should convert the administration fee into a SignedPercentage when the payload provides it", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Master",
        administrationFee: "1.50",
        bankId: "bank-1",
      })

      expect(props.administrationFee?.value.toString()).toBe(
        "1.5"
      )
      expect(props.administrationFee?.value.toFixed(2)).toBe(
        "1.50"
      )
    })

    it("should set the administration fee to null when the payload omits it", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Master",
        bankId: "bank-1",
      })

      expect(props.administrationFee).toBeNull()
    })

    it("should set the administration fee to null when the payload provides an empty string", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Master",
        administrationFee: "",
        bankId: "bank-1",
      })

      expect(props.administrationFee).toBeNull()
    })

    it("should convert the performance fee into a SignedPercentage when the payload provides it", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Master",
        performanceFee: "20.25",
        bankId: "bank-1",
      })

      expect(props.performanceFee?.value.toString()).toBe(
        "20.25"
      )
      expect(props.performanceFee?.value.toFixed(2)).toBe(
        "20.25"
      )
    })

    it("should set the performance fee to null when the payload omits it", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Master",
        bankId: "bank-1",
      })

      expect(props.performanceFee).toBeNull()
    })

    it("should set the performance fee to null when the payload provides null", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Master",
        performanceFee: null,
        bankId: "bank-1",
      })

      expect(props.performanceFee).toBeNull()
    })

    it("should convert the bank id into an EntityId when mapping a create DTO", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Master",
        bankId: "  bank-77  ",
      })

      expect(props.bankId).toBe("bank-77")
    })

    it("should convert the benchmark id into an EntityId when the payload provides it", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Master",
        bankId: "bank-1",
        benchmarkId: " benchmark-9 ",
      })

      expect(props.benchmarkId).toBe("benchmark-9")
    })

    it("should set the benchmark id to null when the payload omits it", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Master",
        bankId: "bank-1",
      })

      expect(props.benchmarkId).toBeNull()
    })

    it("should convert the category id into an EntityId when the payload provides it", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Master",
        bankId: "bank-1",
        categoryId: "category-5",
      })

      expect(props.categoryId).toBe("category-5")
    })

    it("should set the category id to null when the payload omits it", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Master",
        bankId: "bank-1",
      })

      expect(props.categoryId).toBeNull()
    })

    it("should produce props accepted by Fund.create when mapping a create DTO", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Master",
        administrationFee: "1.00",
        performanceFee: "20.00",
        bankId: "bank-1",
        benchmarkId: "benchmark-1",
        categoryId: "category-1",
      })

      expect(() => Fund.create(props)).not.toThrow()
    })

    it("should produce props accepted by Fund.create when the optional fields are omitted", () => {
      const props = toCreateFundProps({
        cnpj: "11222333000181",
        name: "Fundo Master",
        bankId: "bank-1",
      })

      expect(() => Fund.create(props)).not.toThrow()
    })
  })

  describe("toResponseDTO", () => {
    it("should expose the id as a string when serializing a fund", () => {
      const fund = buildFund({ id: buildEntityId(ID) })

      const response = toResponseDTO(fund)

      expect(response.id).toBe(ID)
    })

    it("should expose the sanitized cnpj digits when serializing a fund", () => {
      const fund = buildFund({
        cnpj: buildCnpj("11222333000181"),
      })

      const response = toResponseDTO(fund)

      expect(response.cnpj).toBe("11222333000181")
    })

    it("should carry the name when serializing a fund", () => {
      const fund = buildFund({ name: "Fundo Exemplo" })

      const response = toResponseDTO(fund)

      expect(response.name).toBe("Fundo Exemplo")
    })

    it("should expose the administration fee as a decimal string when it is present", () => {
      const fund = buildFund({
        administrationFee: buildSignedPercentage("1.50"),
      })

      const response = toResponseDTO(fund)

      expect(response.administrationFee).toBe("1.5")
    })

    it("should expose the administration fee as null when it is absent", () => {
      const fund = buildFund({ administrationFee: null })

      const response = toResponseDTO(fund)

      expect(response.administrationFee).toBeNull()
    })

    it("should expose the performance fee as a decimal string when it is present", () => {
      const fund = buildFund({
        performanceFee: buildSignedPercentage("20.00"),
      })

      const response = toResponseDTO(fund)

      expect(response.performanceFee).toBe("20")
    })

    it("should expose the performance fee as null when it is absent", () => {
      const fund = buildFund({ performanceFee: null })

      const response = toResponseDTO(fund)

      expect(response.performanceFee).toBeNull()
    })

    it("should carry the bank id when serializing a fund", () => {
      const fund = buildFund({
        bankId: buildEntityId("bank-33"),
      })

      const response = toResponseDTO(fund)

      expect(response.bankId).toBe("bank-33")
    })

    it("should carry the benchmark id when it is present", () => {
      const fund = buildFund({
        benchmarkId: buildEntityId("benchmark-2"),
      })

      const response = toResponseDTO(fund)

      expect(response.benchmarkId).toBe("benchmark-2")
    })

    it("should expose the benchmark id as null when it is absent", () => {
      const fund = buildFund({ benchmarkId: null })

      const response = toResponseDTO(fund)

      expect(response.benchmarkId).toBeNull()
    })

    it("should carry the category id when it is present", () => {
      const fund = buildFund({
        categoryId: buildEntityId("category-8"),
      })

      const response = toResponseDTO(fund)

      expect(response.categoryId).toBe("category-8")
    })

    it("should expose the category id as null when it is absent", () => {
      const fund = buildFund({ categoryId: null })

      const response = toResponseDTO(fund)

      expect(response.categoryId).toBeNull()
    })

    it("should expose the timestamps as ISO 8601 strings when serializing a fund", () => {
      const fund = buildFund({
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-02-15T12:00:00.000Z"),
      })

      const response = toResponseDTO(fund)

      expect(response.createdAt).toBe("2026-01-01T00:00:00.000Z")
      expect(response.updatedAt).toBe("2026-02-15T12:00:00.000Z")
    })

    it("should expose every field when serializing a fully populated fund", () => {
      const fund = buildFund({
        cnpj: buildCnpj("11222333000181"),
        name: "Fundo Completo",
        administrationFee: buildSignedPercentage("1.50"),
        performanceFee: buildSignedPercentage("20.00"),
        bankId: buildEntityId("bank-1"),
        benchmarkId: buildEntityId("benchmark-1"),
        categoryId: buildEntityId("category-1"),
        createdAt: new Date("2026-03-01T00:00:00.000Z"),
        updatedAt: new Date("2026-03-02T00:00:00.000Z"),
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(fund)

      expect(response).toStrictEqual({
        id: ID,
        cnpj: "11222333000181",
        name: "Fundo Completo",
        administrationFee: "1.5",
        performanceFee: "20",
        bankId: "bank-1",
        benchmarkId: "benchmark-1",
        categoryId: "category-1",
        createdAt: "2026-03-01T00:00:00.000Z",
        updatedAt: "2026-03-02T00:00:00.000Z",
      })
    })

    it("should preserve the null fees and links when serializing a sparse fund", () => {
      const fund = buildFund({
        name: "Fundo Enxuto",
        administrationFee: null,
        performanceFee: null,
        benchmarkId: null,
        categoryId: null,
        createdAt: new Date("2026-04-01T00:00:00.000Z"),
        updatedAt: new Date("2026-04-02T00:00:00.000Z"),
        id: buildEntityId(ID),
      })

      const response = toResponseDTO(fund)

      expect(response.administrationFee).toBeNull()
      expect(response.performanceFee).toBeNull()
      expect(response.benchmarkId).toBeNull()
      expect(response.categoryId).toBeNull()
    })
  })
})
