import {
  BankAccount,
  type BankAccountProps,
} from "@domain/bank-account/entities/bank-account.entity"
import { EntityId } from "@/value-objects"
import type { CreateBankAccountDTO } from "../dto/create-bank-account.dto"
import type { BankAccountResponseDTO } from "../dto/bank-account-response.dto"

/**
 * @summary
 * Maps a create `BankAccount` DTO into entity props.
 *
 * @remarks
 * Parses the primitive DTO values into domain value
 * objects required by the entity factory.
 *
 * @explanation
 * Use this function to translate the service payload
 * into valid entity props.
 *
 * @param dto - Transport payload from the service layer.
 *
 * @returns Entity creation props.
 *
 * @example
 * const PROPS = toCreateBankAccountProps(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toCreateBankAccountProps(
  dto: CreateBankAccountDTO
): BankAccountProps {
  return {
    portfolioId: EntityId.create(dto.portfolioId),
    bankId: EntityId.create(dto.bankId),
    agency: dto.agency,
    accountNumber: dto.accountNumber,
  }
}

/**
 * @summary
 * Maps a `BankAccount` entity into a response DTO.
 *
 * @remarks
 * Serializes ids to strings and timestamps to ISO
 * 8601 strings.
 *
 * @explanation
 * Use this function to expose an entity as the response DTO.
 *
 * @param entity - The bank account domain entity.
 *
 * @returns Response DTO payload.
 *
 * @example
 * const RESPONSE = toResponseDTO(ENTITY);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toResponseDTO(
  entity: BankAccount
): BankAccountResponseDTO {
  return {
    id: entity.id as string,
    portfolioId: entity.portfolioId,
    bankId: entity.bankId,
    agency: entity.agency,
    accountNumber: entity.accountNumber,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }
}
