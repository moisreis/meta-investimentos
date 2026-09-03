import { beforeEach, describe, expect, it } from "vitest";

import { ID } from "@/__tests__/__fixtures__";
import { FakeUnitOfWork } from "@/__tests__/__helpers__/use-cases/_unit-of-work.test.helper";
import { createPortfolio } from "@/business/use-cases/portfolio/create-portfolio.uc";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ValidationError } from "@/shared/errors";

const ACTOR_ID = ID.USER.DEFAULT;

describe("createPortfolio", () => {
  let unitOfWork: FakeUnitOfWork;

  beforeEach(() => {
    unitOfWork = new FakeUnitOfWork();
  });

  describe("success", () => {
    it("creates a portfolio owned by the actor", async () => {
      const RESULT = await createPortfolio(unitOfWork as never, {
        actorId: ACTOR_ID,
        acronym: "FIA",
        name: "Fundo de Investimento em Ações",
        annualInterestRate: "10",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      });

      expect(RESULT.acronym).toBe("FIA");
      expect(RESULT.userId).toBe(ACTOR_ID);
      expect(RESULT.targetAllocation).toBe("12");

      const saved = await unitOfWork.portfolios.findById(
        EntityId.create(RESULT.id),
      );
      expect(saved).not.toBeNull();
      expect(saved?.userId).toBe(EntityId.create(ACTOR_ID));
    });

    it("attributes the mutation to the actor", async () => {
      await createPortfolio(unitOfWork as never, {
        actorId: ACTOR_ID,
        acronym: "FIA",
        name: "Fundo de Investimento em Ações",
        annualInterestRate: "10",
        minAllocation: "5",
        maxAllocation: "20",
        targetAllocation: "12",
      });

      expect(unitOfWork.lastActor?.userId).toBe(EntityId.create(ACTOR_ID));
    });
  });

  describe("validation", () => {
    it("throws ValidationError when the minimum exceeds the target", async () => {
      await expect(
        createPortfolio(unitOfWork as never, {
          actorId: ACTOR_ID,
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          annualInterestRate: "10",
          minAllocation: "30",
          maxAllocation: "20",
          targetAllocation: "12",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it("throws ValidationError when the target exceeds the maximum", async () => {
      await expect(
        createPortfolio(unitOfWork as never, {
          actorId: ACTOR_ID,
          acronym: "FIA",
          name: "Fundo de Investimento em Ações",
          annualInterestRate: "10",
          minAllocation: "5",
          maxAllocation: "20",
          targetAllocation: "30",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
