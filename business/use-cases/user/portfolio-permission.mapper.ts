import type { PortfolioPermission } from "@/business/entities/portfolio/portfolio-permission.entity";
import type { UserRole } from "@/business/entities/user/user.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

import type {
  PortfolioAccessDto,
  PortfolioPermissionDto,
} from "./portfolio-permission.dtos";

/**
 * Maps a `PortfolioPermission` entity to its public
 * {@link PortfolioPermissionDto} representation.
 *
 * @param permission - The permission entity to map.
 * @returns The public permission DTO.
 */
export function toPortfolioPermissionDto(
  permission: PortfolioPermission,
): PortfolioPermissionDto {
  return {
    id: permission.id as EntityId,
    userId: permission.userId,
    portfolioId: permission.portfolioId,
    role: permission.role,
    grantedByUserId: permission.grantedByUserId,
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
  };
}

/**
 * Maps a portfolio permission together with the granted user's profile
 * into a {@link PortfolioAccessDto}.
 *
 * @param permission - The permission entity.
 * @param userName - The granted user's name.
 * @param userEmail - The granted user's email.
 * @param userRole - The granted user's role.
 * @returns The combined access DTO.
 */
export function toPortfolioAccessDto(
  permission: PortfolioPermission,
  userName: string,
  userEmail: string,
  userRole: UserRole,
): PortfolioAccessDto {
  return {
    userId: permission.userId,
    userName,
    userEmail,
    userRole,
    portfolioId: permission.portfolioId,
    role: permission.role,
    grantedAt: permission.createdAt,
  };
}
