import {
  CheckingAccount,
  type CheckingAccountProps,
} from "@domain/checking-account/entities/checking-account.entity"
import { EntityId, SignedMoney } from "@/value-objects"
import type { CreateCheckingAccountDTO } from "../dto/create-checking-account.dto"
import type { CheckingAccountResponseDTO } from "../dto/checking-account-response.dto"

/**
 * @summary
 * Maps a create `CheckingAccount` DTO into entity props.
 *
 * @remarks
 * Parses the primitive DTO values into domain value
 * objects required by the entity factory.
 *
 * @param dto - Transport payload from the service layer.
 * @returns Props for `CheckingAccount`.create.
 */
export function toCreateCheckingAccountProps(
  dto: CreateCheckingAccountDTO
): CheckingAccountProps {
  return {
    bankAccountId: EntityId.create(dto.bankAccountId),
    date: new Date(dto.date),
    value: SignedMoney.create(dto.value),
  }
}

/**
 * @summary
 * Maps a `CheckingAccount` entity into a response DTO.
 *
 * @remarks
 * Serializes value objects to decimal strings and dates
 * to ISO 8601 strings.
 *
 * @param entity - The checking account domain entity.
 * @returns The transport response payload.
 */
export function toResponseDTO(
  entity: CheckingAccount
): CheckingAccountResponseDTO {
  return {
    id: entity.id as string,
    bankAccountId: entity.bankAccountId,
    date: entity.date.toISOString(),
    value: entity.value.value.toString(),
  }
}
