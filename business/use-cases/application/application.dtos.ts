import type { Application } from "@/business/entities/portfolio/application.entity";
import type { EntityId } from "@/business/value-objects/entity-id.vo";

/**
 * The public representation of an application.
 */
export interface ApplicationDto {
  id: EntityId;
  positionId: EntityId;
  date: Date;
  amount: string;
  quotas: string;
  reversedAt: Date | null;
  reversedByUserId: EntityId | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Maps an `Application` entity to its public DTO representation.
 *
 * @param application - The application entity.
 * @returns The application DTO.
 */
export function toApplicationDto(application: Application): ApplicationDto {
  return {
    id: application.id as EntityId,
    positionId: application.positionId,
    date: application.date,
    amount: application.amount.value.toString(),
    quotas: application.quotas.value.toString(),
    reversedAt: application.reversedAt,
    reversedByUserId: application.reversedByUserId,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
  };
}
