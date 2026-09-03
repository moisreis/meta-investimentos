import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { BANK } from "@/__tests__/__helpers__/interfaces/_bank.test.helper";
import { BENCHMARK } from "@/__tests__/__helpers__/interfaces/_benchmark.test.helper";
import { CATEGORY } from "@/__tests__/__helpers__/interfaces/_category.test.helper";
import { FUND } from "@/__tests__/__helpers__/interfaces/_fund.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { createBank } from "@/business/use-cases/bank/create-bank.uc";
import { createBenchmark } from "@/business/use-cases/benchmark/create-benchmark.uc";
import { createCategory } from "@/business/use-cases/fund/create-category.uc";
import { createFund } from "@/business/use-cases/fund/create-fund.uc";
import { createQuota } from "@/business/use-cases/fund/create-quota.uc";
import { createNorm } from "@/business/use-cases/norm/create-norm.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError, ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;
const QUOTA_DATE = new Date("2026-01-05T00:00:00.000Z");

describe("registry create flows", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("createCategory", () => {
    it("creates a category and attributes the mutation to the actor", async () => {
      const RESULT = await createCategory(unitOfWork as never, {
        actorId: ACTOR_ID,
        name: "Ações",
      });

      expect(RESULT.name).toBe("Ações");
      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });

    it("throws ValidationError when the category name already exists", async () => {
      unitOfWork.seed({ categories: [CATEGORY] });

      await expect(
        createCategory(unitOfWork as never, {
          actorId: ACTOR_ID,
          name: CATEGORY.name,
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe("createBenchmark", () => {
    it("creates a benchmark", async () => {
      const RESULT = await createBenchmark(unitOfWork as never, {
        actorId: ACTOR_ID,
        acronym: "IBOV",
        name: "Ibovespa",
      });

      expect(RESULT.acronym).toBe("IBOV");
    });

    it("throws ValidationError when the acronym already exists", async () => {
      unitOfWork.seed({ benchmarks: [BENCHMARK] });

      await expect(
        createBenchmark(unitOfWork as never, {
          actorId: ACTOR_ID,
          acronym: BENCHMARK.acronym,
          name: "Duplicate",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe("createBank", () => {
    it("creates a bank", async () => {
      const RESULT = await createBank(unitOfWork as never, {
        actorId: ACTOR_ID,
        code: "001",
        name: "Banco do Brasil",
      });

      expect(RESULT.code).toBe("001");
    });

    it("throws ValidationError when the code already exists", async () => {
      unitOfWork.seed({ banks: [BANK] });

      await expect(
        createBank(unitOfWork as never, {
          actorId: ACTOR_ID,
          code: BANK.code,
          name: "Duplicate",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe("createFund", () => {
    it("creates a fund referencing an existing bank", async () => {
      unitOfWork.seed({ banks: [BANK] });

      const RESULT = await createFund(unitOfWork as never, {
        actorId: ACTOR_ID,
        cnpj: "12345678000195",
        name: "Fundo Ações",
        bankId: ID.BANK.DEFAULT,
      });

      expect(RESULT.name).toBe("Fundo Ações");
      expect(RESULT.bankId).toBe(EntityId.create(ID.BANK.DEFAULT));
    });

    it("throws NotFoundError when the bank does not exist", async () => {
      await expect(
        createFund(unitOfWork as never, {
          actorId: ACTOR_ID,
          cnpj: "12345678000195",
          name: "Fundo Ações",
          bankId: ID.BANK.DEFAULT,
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("createQuota", () => {
    it("creates a quota for a fund", async () => {
      unitOfWork.seed({ funds: [FUND] });

      const RESULT = await createQuota(unitOfWork as never, {
        actorId: ACTOR_ID,
        fundId: ID.FUND.DEFAULT,
        date: QUOTA_DATE,
        price: "1000.00",
      });

      expect(RESULT.fundId).toBe(EntityId.create(ID.FUND.DEFAULT));
    });

    it("throws ValidationError when a quota already exists on the date", async () => {
      unitOfWork.seed({
        funds: [FUND],
        quotas: [
          {
            fundId: EntityId.create(ID.FUND.DEFAULT),
            date: QUOTA_DATE,
            price: { value: 1000 },
          } as never,
        ],
      });

      await expect(
        createQuota(unitOfWork as never, {
          actorId: ACTOR_ID,
          fundId: ID.FUND.DEFAULT,
          date: QUOTA_DATE,
          price: "1000.00",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe("createNorm", () => {
    it("throws NotFoundError when the category does not exist", async () => {
      await expect(
        createNorm(unitOfWork as never, {
          actorId: ACTOR_ID,
          articleNumber: "Art. 12",
          name: "Limite",
          categoryId: ID.CATEGORY.DEFAULT,
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "12",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
