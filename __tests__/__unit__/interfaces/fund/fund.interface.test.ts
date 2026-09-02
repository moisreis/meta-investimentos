import { beforeEach, describe, expect, it } from "vitest";

import {
  createInMemoryFundRepository,
  FUND,
  FUND_ID,
} from "@/__tests__/__helpers__/interfaces/_fund.test.helper";

import { Fund } from "@/business/entities/fund/fund.entity";
import type { IFund } from "@/business/interfaces/fund/fund.interface";
import { CNPJ } from "@/business/value-objects/cnpj.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("IFund", () => {
  let REPOSITORY: IFund;

  beforeEach(() => {
    REPOSITORY = createInMemoryFundRepository();
  });

  describe("findById", () => {
    it("returns the persisted fund", async () => {
      await REPOSITORY.save(FUND);

      const FOUND = await REPOSITORY.findById(EntityId.create(FUND_ID));

      expect(FOUND?.equals(FUND)).toBe(true);
    });

    it("returns null when the fund does not exist", async () => {
      expect(await REPOSITORY.findById(EntityId.create(FUND_ID))).toBeNull();
    });
  });

  describe("findByCnpj", () => {
    it("returns the persisted fund matching the cnpj", async () => {
      await REPOSITORY.save(FUND);

      const FOUND = await REPOSITORY.findByCnpj(FUND.cnpj.value);

      expect(FOUND?.equals(FUND)).toBe(true);
    });

    it("returns null when the fund does not exist", async () => {
      expect(await REPOSITORY.findByCnpj(FUND.cnpj.value)).toBeNull();
    });
  });

  describe("save", () => {
    it("persists a new fund", async () => {
      await REPOSITORY.save(FUND);

      const FOUND = await REPOSITORY.findById(EntityId.create(FUND_ID));

      expect(FOUND?.equals(FUND)).toBe(true);
    });

    it("updates an existing fund", async () => {
      await REPOSITORY.save(FUND);

      const UPDATED_FUND = Fund.create(
        {
          cnpj: CNPJ.create("41142260000189"),
          name: "Fundo Teste Atualizado",
          bankId: EntityId.create("f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d"),
        },
        FUND_ID,
      );

      await REPOSITORY.save(UPDATED_FUND);

      const FOUND = await REPOSITORY.findById(EntityId.create(FUND_ID));

      expect(FOUND?.name).toBe("Fundo Teste Atualizado");
    });
  });

  describe("delete", () => {
    it("removes the persisted fund", async () => {
      await REPOSITORY.save(FUND);

      await REPOSITORY.delete(EntityId.create(FUND_ID));

      expect(await REPOSITORY.findById(EntityId.create(FUND_ID))).toBeNull();
    });
  });
});
