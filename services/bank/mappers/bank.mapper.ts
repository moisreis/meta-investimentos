import {
  Bank,
  type BankProps,
} from "@domain/bank/entities/bank.entity"
import type { CreateBankDTO } from "../dto/create-bank.dto"
import type { BankResponseDTO } from "../dto/bank-response.dto"

/**
 * @summary
 * Maps a create `Bank` DTO into entity props.
 *
 * @remarks
 * Code and name are plain strings already accepted
 * by the entity factory.
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
 * const PROPS = toCreateBankProps(DTO);
 *
 * @author Moisés Reis
 *
 * @date 2026-09-22
 */
export function toCreateBankProps(
  dto: CreateBankDTO
): BankProps {
  return {
    code: dto.code,
    name: dto.name,
  }
}

/**
 * @summary
 * Maps a `Bank` entity into a response DTO.
 *
 * @remarks
 * Serializes the id to a string and timestamps to
 * ISO 8601 strings.
 *
 * @explanation
 * Use this function to expose an entity as the response DTO.
 *
 * @param entity - The bank domain entity.
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
export function toResponseDTO(entity: Bank): BankResponseDTO {
  return {
    id: entity.id as string,
    code: entity.code,
    name: entity.name,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  }
}
