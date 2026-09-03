import type { PortfolioPermissionRole } from "@/business/entities/portfolio/portfolio-permission.entity";
import type { UserRole } from "@/business/entities/user/user.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The public representation of a portfolio permission.
 */
export interface PortfolioPermissionDto {
  id: EntityId;
  userId: EntityId;
  portfolioId: EntityId;
  role: PortfolioPermissionRole;
  grantedByUserId: EntityId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The public representation of a user granted access to a portfolio,
 * including the resolved role.
 */
export interface PortfolioAccessDto {
  userId: EntityId;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  portfolioId: EntityId;
  role: PortfolioPermissionRole;
  grantedAt: Date;
}
