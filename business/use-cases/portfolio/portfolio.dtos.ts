import type { Portfolio } from "@/business/entities/portfolio/portfolio.entity";

/**
 * The public representation of a portfolio.
 */
export interface PortfolioDto {
  id: string;
  acronym: string;
  name: string;
  userId: string;
  annualInterestRate: string;
  minAllocation: string;
  maxAllocation: string;
  targetAllocation: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The public representation of a portfolio the actor can access,
 * including the access level.
 */
export interface AccessiblePortfolioDto extends PortfolioDto {
  accessRole: "OWNER" | "VIEWER" | "EDITOR";
}

/**
 * The access role of an actor over a portfolio.
 */
export type PortfolioAccessRole = "OWNER" | "VIEWER" | "EDITOR";

/**
 * Maps a `Portfolio` entity to its public DTO representation.
 *
 * @param portfolio - The portfolio entity.
 * @returns The portfolio DTO.
 */
export function toPortfolioDto(portfolio: Portfolio): PortfolioDto {
  return {
    id: portfolio.id as string,
    acronym: portfolio.acronym,
    name: portfolio.name,
    userId: portfolio.userId,
    annualInterestRate: portfolio.annualInterestRate.value.toString(),
    minAllocation: portfolio.minAllocation.value.toString(),
    maxAllocation: portfolio.maxAllocation.value.toString(),
    targetAllocation: portfolio.targetAllocation.value.toString(),
    createdAt: portfolio.createdAt,
    updatedAt: portfolio.updatedAt,
  };
}

/**
 * Maps a `Portfolio` entity and its resolved access role to an
 * accessible-portfolio DTO.
 *
 * @param portfolio - The portfolio entity.
 * @param accessRole - The actor's access level on the portfolio.
 * @returns The accessible-portfolio DTO.
 */
export function toAccessiblePortfolioDto(
  portfolio: Portfolio,
  accessRole: PortfolioAccessRole,
): AccessiblePortfolioDto {
  return {
    ...toPortfolioDto(portfolio),
    accessRole,
  };
}
