import { ID } from "@/__tests__/__fixtures__";
import { db } from "@/__tests__/__setup__/_database.setup";
import { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { portfolioPermission } from "@/infrastructure/database/schemas";
import { seedPortfolioById } from "./_portfolio.seed";
import { seedUserById } from "./_user.seed";

/**
 * Represents the default portfolio permission fixture
 * granting the other user `VIEWER` access to the default
 * portfolio.
 */
const PORTFOLIO_PERMISSION = PortfolioPermission.create(
  {
    userId: EntityId.create(ID.USER.OTHER),
    portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
    role: "VIEWER",
    grantedByUserId: EntityId.create(ID.USER.DEFAULT),
  },
  "01a2b3c4-5d6e-4f7a-8b9c-0d1e2f3a4b5c",
);

/**
 * Represents a second portfolio permission fixture
 * granting the other user `EDITOR` access to the other
 * portfolio.
 */
const OTHER_PORTFOLIO_PERMISSION = PortfolioPermission.create(
  {
    userId: EntityId.create(ID.USER.DEFAULT),
    portfolioId: EntityId.create(ID.PORTFOLIO.OTHER),
    role: "EDITOR",
    grantedByUserId: EntityId.create(ID.USER.OTHER),
  },
  "12b3c4d5-6e7f-4a8b-9c0d-1e2f3a4b5c6d",
);

/**
 * Represents a fresh portfolio permission fixture without
 * a fixed ID for insert tests.
 */
const FRESH_PORTFOLIO_PERMISSION = PortfolioPermission.create({
  userId: EntityId.create(ID.USER.OTHER),
  portfolioId: EntityId.create(ID.PORTFOLIO.DEFAULT),
  role: "EDITOR",
  grantedByUserId: EntityId.create(ID.USER.DEFAULT),
});

export {
  PORTFOLIO_PERMISSION,
  OTHER_PORTFOLIO_PERMISSION,
  FRESH_PORTFOLIO_PERMISSION,
};

/**
 * Seeds a single {@link PortfolioPermission} row together
 * with all of its foreign-key parents.
 *
 * Seeds the granted-by user, the target user, and the
 * target portfolio before inserting the permission.
 *
 * @param permission - The permission to persist.
 * @returns The inserted permission row with its database id.
 */
export async function seedPortfolioPermission(
  permission: PortfolioPermission,
): Promise<PortfolioPermission> {
  await seedUserById(permission.grantedByUserId);
  await seedUserById(permission.userId);
  await seedPortfolioById(permission.portfolioId);

  const [row] = await db
    .insert(portfolioPermission)
    .values({
      userId: permission.userId,
      portfolioId: permission.portfolioId,
      role: permission.role,
      grantedByUserId: permission.grantedByUserId,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    })
    .returning();

  return PortfolioPermission.create(
    {
      userId: EntityId.create(row.userId),
      portfolioId: EntityId.create(row.portfolioId),
      role: row.role as "VIEWER" | "EDITOR",
      grantedByUserId: EntityId.create(row.grantedByUserId),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
    row.id,
  );
}
