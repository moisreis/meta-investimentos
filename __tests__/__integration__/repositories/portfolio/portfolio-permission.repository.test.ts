import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  FRESH_PORTFOLIO_PERMISSION,
  newPortfolioPermissionRepository,
  OTHER_PORTFOLIO_PERMISSION,
  PORTFOLIO_PERMISSION,
  seedPortfolioPermission,
} from "@/__tests__/__helpers__/repositories/_portfolio-permission.test.helper";
import {
  PORTFOLIO_ID,
  seedPortfolioById,
} from "@/__tests__/__seeds__/_portfolio.seed";
import {
  OTHER_USER_ID,
  seedUserById,
  USER_ID,
} from "@/__tests__/__seeds__/_user.seed";
import {
  closeDatabase,
  resetDatabase,
} from "@/__tests__/__setup__/_database.setup";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";

describe("PortfolioPermissionRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("findById", () => {
    it("returns the persisted portfolio permission", async () => {
      const SEEDED = await seedPortfolioPermission(PORTFOLIO_PERMISSION);

      const FOUND = await newPortfolioPermissionRepository().findById(
        EntityId.create(SEEDED.id as string),
      );

      expect(FOUND?.equals(SEEDED)).toBe(true);
    });

    it("returns null when the portfolio permission does not exist", async () => {
      expect(
        await newPortfolioPermissionRepository().findById(
          EntityId.create(PORTFOLIO_PERMISSION.id as string),
        ),
      ).toBeNull();
    });
  });

  describe("findByUserIdAndPortfolioId", () => {
    it("returns the persisted portfolio permission", async () => {
      await seedPortfolioPermission(PORTFOLIO_PERMISSION);

      const FOUND =
        await newPortfolioPermissionRepository().findByUserIdAndPortfolioId(
          EntityId.create(OTHER_USER_ID),
          EntityId.create(PORTFOLIO_ID),
        );

      expect(FOUND?.role).toBe("VIEWER");
      expect(FOUND?.userId).toBe(OTHER_USER_ID);
      expect(FOUND?.portfolioId).toBe(PORTFOLIO_ID);
    });

    it("returns null when no permission exists for the user and portfolio", async () => {
      await seedPortfolioPermission(PORTFOLIO_PERMISSION);

      expect(
        await newPortfolioPermissionRepository().findByUserIdAndPortfolioId(
          EntityId.create(USER_ID),
          EntityId.create(PORTFOLIO_ID),
        ),
      ).toBeNull();
    });
  });

  describe("findAllByUserId", () => {
    it("returns every permission granted to the user", async () => {
      await seedPortfolioPermission(PORTFOLIO_PERMISSION);

      const FOUND = await newPortfolioPermissionRepository().findAllByUserId(
        EntityId.create(OTHER_USER_ID),
      );

      expect(FOUND).toHaveLength(1);
      expect(FOUND[0].role).toBe("VIEWER");
    });

    it("returns an empty array when the user has no permissions", async () => {
      expect(
        await newPortfolioPermissionRepository().findAllByUserId(
          EntityId.create(OTHER_USER_ID),
        ),
      ).toEqual([]);
    });
  });

  describe("findAllByPortfolioId", () => {
    it("returns every permission granted on the portfolio", async () => {
      await seedPortfolioPermission(PORTFOLIO_PERMISSION);

      const FOUND =
        await newPortfolioPermissionRepository().findAllByPortfolioId(
          EntityId.create(PORTFOLIO_ID),
        );

      expect(FOUND).toHaveLength(1);
      expect(FOUND[0].userId).toBe(OTHER_USER_ID);
    });

    it("returns an empty array when the portfolio has no permissions", async () => {
      expect(
        await newPortfolioPermissionRepository().findAllByPortfolioId(
          EntityId.create(PORTFOLIO_ID),
        ),
      ).toEqual([]);
    });
  });

  describe("save", () => {
    it("persists a new portfolio permission", async () => {
      await seedUserById(USER_ID);
      await seedUserById(OTHER_USER_ID);
      await seedPortfolioById(PORTFOLIO_ID);

      const SAVED = await newPortfolioPermissionRepository().save(
        FRESH_PORTFOLIO_PERMISSION,
      );

      expect(SAVED.id).toBeDefined();
      const FOUND = await newPortfolioPermissionRepository().findById(
        EntityId.create(SAVED.id as string),
      );
      expect(FOUND?.equals(SAVED)).toBe(true);
    });

    it("updates an existing portfolio permission role", async () => {
      const SEEDED = await seedPortfolioPermission(PORTFOLIO_PERMISSION);
      const UPDATED = SEEDED.updateRole("EDITOR");

      await newPortfolioPermissionRepository().save(UPDATED);

      const FOUND =
        await newPortfolioPermissionRepository().findByUserIdAndPortfolioId(
          EntityId.create(OTHER_USER_ID),
          EntityId.create(PORTFOLIO_ID),
        );

      expect(FOUND?.role).toBe("EDITOR");
      expect(FOUND?.equals(UPDATED)).toBe(true);
    });

    it("rejects a duplicate permission for the same user and portfolio", async () => {
      await seedPortfolioPermission(PORTFOLIO_PERMISSION);

      const DUPLICATE = PortfolioPermission.create(
        {
          userId: EntityId.create(OTHER_USER_ID),
          portfolioId: EntityId.create(PORTFOLIO_ID),
          role: "EDITOR",
          grantedByUserId: EntityId.create(USER_ID),
        },
        OTHER_PORTFOLIO_PERMISSION.id,
      );

      await expect(
        newPortfolioPermissionRepository().save(DUPLICATE),
      ).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("removes the persisted portfolio permission", async () => {
      const SEEDED = await seedPortfolioPermission(PORTFOLIO_PERMISSION);

      await newPortfolioPermissionRepository().delete(
        EntityId.create(SEEDED.id as string),
      );

      expect(
        await newPortfolioPermissionRepository().findById(
          EntityId.create(SEEDED.id as string),
        ),
      ).toBeNull();
    });
  });

  describe("deleteByUserIdAndPortfolioId", () => {
    it("removes the persisted portfolio permission by composite key", async () => {
      await seedPortfolioPermission(PORTFOLIO_PERMISSION);

      await newPortfolioPermissionRepository().deleteByUserIdAndPortfolioId(
        EntityId.create(OTHER_USER_ID),
        EntityId.create(PORTFOLIO_ID),
      );

      expect(
        await newPortfolioPermissionRepository().findByUserIdAndPortfolioId(
          EntityId.create(OTHER_USER_ID),
          EntityId.create(PORTFOLIO_ID),
        ),
      ).toBeNull();
    });
  });
});
