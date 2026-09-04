import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { BANK } from "@/__tests__/__helpers__/interfaces/_bank.test.helper";
import { FUND } from "@/__tests__/__helpers__/interfaces/_fund.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { createFund } from "@/business/use-cases/fund/create-fund.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("createFund", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates a fund with fees, benchmark, and category", async () => {
      unitOfWork.seed({ banks: [BANK] });

      const RESULT = await createFund(unitOfWork as never, {
        actorId: ACTOR_ID,
        cnpj: "41142260000189",
        name: "Fundo Multimercado",
        administrationFee: "1.2",
        performanceFee: "15",
        bankId: ID.BANK.DEFAULT,
        benchmarkId: ID.BENCHMARK.DEFAULT,
        categoryId: ID.CATEGORY.DEFAULT,
      });

      expect(RESULT.name).toBe("Fundo Multimercado");
      expect(RESULT.bankId).toBe(EntityId.create(ID.BANK.DEFAULT));
      expect(RESULT.administrationFee).toBe("1.2");
      expect(RESULT.performanceFee).toBe("15");
      expect(RESULT.benchmarkId).toBe(EntityId.create(ID.BENCHMARK.DEFAULT));
      expect(RESULT.categoryId).toBe(EntityId.create(ID.CATEGORY.DEFAULT));

      const saved = await unitOfWork.funds.findByCnpj("41142260000189");
      expect(saved).not.toBeNull();
      expect(saved?.name).toBe("Fundo Multimercado");
    });

    it("creates a fund with no fees, benchmark, or category", async () => {
      unitOfWork.seed({ banks: [BANK] });

      const RESULT = await createFund(unitOfWork as never, {
        actorId: ACTOR_ID,
        cnpj: "11222333000181",
        name: "Fundo Renda Fixa",
        bankId: ID.BANK.DEFAULT,
      });

      expect(RESULT.administrationFee).toBeNull();
      expect(RESULT.performanceFee).toBeNull();
      expect(RESULT.benchmarkId).toBeNull();
      expect(RESULT.categoryId).toBeNull();
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({ banks: [BANK] });

      await createFund(unitOfWork as never, {
        actorId: ACTOR_ID,
        cnpj: "41142260000189",
        name: "Fundo Multimercado",
        bankId: ID.BANK.DEFAULT,
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("not found", () => {
    it("throws NotFoundError when the referenced bank does not exist", async () => {
      await expect(
        createFund(unitOfWork as never, {
          actorId: ACTOR_ID,
          cnpj: "41142260000189",
          name: "Fundo Multimercado",
          bankId: ID.BANK.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("validation", () => {
    it("throws ValidationError when a fund with the same CNPJ already exists", async () => {
      unitOfWork.seed({
        banks: [BANK],
        funds: [FUND],
      });

      await expect(
        createFund(unitOfWork as never, {
          actorId: ACTOR_ID,
          cnpj: FUND.cnpj.value,
          name: "Fundo Duplicado",
          bankId: ID.BANK.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
