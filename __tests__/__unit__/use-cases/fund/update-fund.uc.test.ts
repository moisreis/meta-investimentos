import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import {
  BENCHMARK,
  OTHER_BENCHMARK,
} from "@/__tests__/__helpers__/interfaces/_benchmark.test.helper";
import {
  CATEGORY,
  OTHER_CATEGORY,
} from "@/__tests__/__helpers__/interfaces/_category.test.helper";
import { FUND } from "@/__tests__/__helpers__/interfaces/_fund.test.helper";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { User } from "@/business/entities/user/user.entity";
import { updateFund } from "@/business/use-cases/fund/update-fund.uc";
import { CPF } from "@/business/value-objects/cpf.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { NotFoundError } from "@/shared/errors";

const MANAGER_ID = "f1e2d3c4-5b6a-4f7e-8d9c-0a1b2c3d4e5f";
const MANAGER = User.create(
  {
    name: "Admin Manager",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "Manager",
    cpf: CPF.create("39053344705"),
    role: "MANAGER",
  },
  MANAGER_ID,
);

describe("updateFund", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("renames a fund", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        funds: [FUND],
        benchmarks: [BENCHMARK],
        categories: [CATEGORY],
      });

      const RESULT = await updateFund(unitOfWork as never, {
        actorId: MANAGER_ID,
        fundId: ID.FUND.DEFAULT,
        name: "Fundo Atualizado",
      });

      expect(RESULT.name).toBe("Fundo Atualizado");
    });

    it("updates the benchmark reference", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        funds: [FUND],
        benchmarks: [BENCHMARK, OTHER_BENCHMARK],
        categories: [CATEGORY],
      });

      const RESULT = await updateFund(unitOfWork as never, {
        actorId: MANAGER_ID,
        fundId: ID.FUND.DEFAULT,
        benchmarkId: ID.BENCHMARK.OTHER,
      });

      expect(RESULT.benchmarkId?.toString()).toBe(ID.BENCHMARK.OTHER);
    });

    it("clears the benchmark reference with null", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        funds: [FUND],
        benchmarks: [BENCHMARK],
        categories: [CATEGORY],
      });

      const RESULT = await updateFund(unitOfWork as never, {
        actorId: MANAGER_ID,
        fundId: ID.FUND.DEFAULT,
        benchmarkId: null,
      });

      expect(RESULT.benchmarkId).toBeNull();
    });

    it("updates the category reference", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        funds: [FUND],
        benchmarks: [BENCHMARK],
        categories: [CATEGORY, OTHER_CATEGORY],
      });

      const RESULT = await updateFund(unitOfWork as never, {
        actorId: MANAGER_ID,
        fundId: ID.FUND.DEFAULT,
        categoryId: ID.CATEGORY.OTHER,
      });

      expect(RESULT.categoryId?.toString()).toBe(ID.CATEGORY.OTHER);
    });

    it("attributes the mutation to the actor", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        funds: [FUND],
        benchmarks: [BENCHMARK],
        categories: [CATEGORY],
      });

      await updateFund(unitOfWork as never, {
        actorId: MANAGER_ID,
        fundId: ID.FUND.DEFAULT,
        name: "Fundo Atualizado",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(MANAGER_ID));
    });
  });

  describe("authorization", () => {
    it("throws NotFoundError when the fund does not exist", async () => {
      unitOfWork.seed({ users: [MANAGER] });

      await expect(
        updateFund(unitOfWork as never, {
          actorId: MANAGER_ID,
          fundId: "00000000-0000-4000-8000-000000000000",
          name: "X",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the actor is not a manager", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        funds: [FUND],
        benchmarks: [BENCHMARK],
        categories: [CATEGORY],
      });

      await expect(
        updateFund(unitOfWork as never, {
          actorId: EntityId.create(ID.USER.DEFAULT).toString(),
          fundId: ID.FUND.DEFAULT,
          name: "X",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the referenced benchmark does not exist", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        funds: [FUND],
        benchmarks: [BENCHMARK],
        categories: [CATEGORY],
      });

      await expect(
        updateFund(unitOfWork as never, {
          actorId: MANAGER_ID,
          fundId: ID.FUND.DEFAULT,
          benchmarkId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("throws NotFoundError when the referenced category does not exist", async () => {
      unitOfWork.seed({
        users: [MANAGER],
        funds: [FUND],
        benchmarks: [BENCHMARK],
        categories: [CATEGORY],
      });

      await expect(
        updateFund(unitOfWork as never, {
          actorId: MANAGER_ID,
          fundId: ID.FUND.DEFAULT,
          categoryId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });
});
