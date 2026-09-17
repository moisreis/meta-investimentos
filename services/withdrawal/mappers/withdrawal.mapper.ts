import {
  Withdrawal,
  type WithdrawalProps,
} from "@domain/withdrawal/entities/withdrawal.entity"
import { EntityId, PositiveMoney, QuotaQuantity } from "@/value-objects"
import type { CreateWithdrawalDTO } from "../dto/create-withdrawal.dto"
import type { WithdrawalResponseDTO } from "../dto/withdrawal-response.dto"
import type { ReverseWithdrawalDTO } from "../dto/reverse-withdrawal.dto"

/**
 * @summary
 * Maps a create `Withdrawal` DTO into entity props.
 *
 * @remarks
 * Parses the primitive DTO values into domain value
 * objects required by the entity factory.
 *
 * @param dto - Transport payload from the service layer.
 * @returns Props accepted by `Withdrawal.create`.
 */
export function toCreateWithdrawalProps(
  dto: CreateWithdrawalDTO
): WithdrawalProps {
  return {
    positionId: EntityId.create(dto.positionId),
    date: new Date(dto.date),
    amount: PositiveMoney.create(dto.amount),
    quotas: QuotaQuantity.create(dto.quotas),
  }
}

/**
 * @summary
 * Maps a reverse `Withdrawal` DTO into entity props.
 *
 * @remarks
 * Only the reversing user is carried by the payload.
 *
 * @param dto - Transport payload from the service layer.
 * @returns Props accepted by `Withdrawal.reverse`.
 */
export function toReverseWithdrawalProps(
  dto: ReverseWithdrawalDTO
): Pick<WithdrawalProps, "reversedByUserId"> {
  return {
    reversedByUserId: EntityId.create(dto.reversedByUserId),
  }
}

/**
 * @summary
 * Maps a `Withdrawal` entity into a response DTO.
 *
 * @remarks
 * Serializes value objects to decimal strings and dates
 * to ISO 8601 strings.
 *
 * @param entity - The withdrawal domain entity.
 * @returns The transport response payload.
 */
export function toResponseDTO(entity: Withdrawal): WithdrawalResponseDTO {
  return {
    id: entity.id as string,
    positionId: entity.positionId,
    date: entity.date.toISOString(),
    amount: entity.amount.value.toString(),
    quotas: entity.quotas.value.toString(),
    reversedAt: entity.reversedAt ? entity.reversedAt.toISOString() : null,
    reversedByUserId: entity.reversedByUserId,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }
}
