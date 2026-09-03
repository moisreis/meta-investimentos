import type { Category } from "@/business/entities/fund/category.entity";
import type { Fund } from "@/business/entities/fund/fund.entity";
import type { Quota } from "@/business/entities/fund/quota.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The public representation of a fund.
 */
export interface FundDto {
  id: EntityId;
  cnpj: string;
  name: string;
  administrationFee: string | null;
  performanceFee: string | null;
  bankId: EntityId;
  benchmarkId: EntityId | null;
  categoryId: EntityId | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The public representation of a fund category.
 */
export interface CategoryDto {
  id: EntityId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * The public representation of a quota.
 */
export interface QuotaDto {
  id: EntityId;
  fundId: EntityId;
  date: Date;
  price: string;
  createdAt: Date;
}

/**
 * Maps a `Fund` entity to its public DTO representation.
 *
 * @param fund - The fund entity.
 * @returns The fund DTO.
 */
export function toFundDto(fund: Fund): FundDto {
  return {
    id: fund.id as EntityId,
    cnpj: fund.cnpj.value,
    name: fund.name,
    administrationFee: fund.administrationFee?.value.toString() ?? null,
    performanceFee: fund.performanceFee?.value.toString() ?? null,
    bankId: fund.bankId,
    benchmarkId: fund.benchmarkId,
    categoryId: fund.categoryId,
    createdAt: fund.createdAt,
    updatedAt: fund.updatedAt,
  };
}

/**
 * Maps a `Category` entity to its public DTO representation.
 *
 * @param category - The category entity.
 * @returns The category DTO.
 */
export function toCategoryDto(category: Category): CategoryDto {
  return {
    id: category.id as EntityId,
    name: category.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

/**
 * Maps a `Quota` entity to its public DTO representation.
 *
 * @param quota - The quota entity.
 * @returns The quota DTO.
 */
export function toQuotaDto(quota: Quota): QuotaDto {
  return {
    id: quota.id as EntityId,
    fundId: quota.fundId,
    date: quota.date,
    price: quota.price.value.toString(),
    createdAt: quota.createdAt,
  };
}
