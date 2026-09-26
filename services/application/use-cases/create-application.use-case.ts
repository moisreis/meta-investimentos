import { Application } from "@domain/application/entities/application.entity"
import { IApplication } from "@domain/application/interfaces/application.interface"
import { NotFoundError } from "@errors/not-found.error"
import { IPosition } from "@domain/position/interfaces/position.interface"
import { EntityId } from "@/value-objects"
import type { ApplicationResponseDTO } from "../dto/application-response.dto"
import {
  toCreateApplicationProps,
  toResponseDTO,
} from "../mappers/application.mapper"

export interface CreateApplicationInput {
  positionId: string
  date: string
  amount: string
  quotas: string
}

/**
 * @summary
 * Creates a new `Application` and persists it.
 *
 * @remarks
 * Verifies the target position exists, builds entity
 * props through the create mapper, and saves the
 * application with the application repository.
 *
 * @explanation
 * Use this use case to register a new application
 * through the service layer.
 *
 * @example
 * const APPLICATION = await CREATE_APPLICATION_USE_CASE
 *   .execute({
 *     positionId: "position-1",
 *     date: "2026-01-10T00:00:00.000Z",
 *     amount: "1000",
 *     quotas: "80",
 *   });
 *
 * @author Moisés Reis
 *
 * @date 2026-09-15
 */
export class CreateApplicationUseCase {
  constructor(
    private applicationRepository: IApplication,
    private positionRepository: IPosition
  ) {}

  /**
   * @summary
   * Creates and persists a new application.
   *
   * @remarks
   * Verifies the target position exists, builds entity
   * props through the create mapper, and saves the
   * application with the application repository.
   *
   * @explanation
   * Use this method to register a new application
   * through the service layer.
   *
   * @param input - The application creation payload.
   *
   * @returns The saved application.
   *
   * @example
   * const APPLICATION = await CREATE_APPLICATION_USE_CASE
   *   .execute({
   *     positionId: "position-1",
   *     date: "2026-01-10T00:00:00.000Z",
   *     amount: "1000",
   *     quotas: "80",
   *   });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-15
   */
  async execute(
    input: CreateApplicationInput
  ): Promise<ApplicationResponseDTO> {
    const POSITION_ID = EntityId.create(input.positionId)
    const POSITION =
      await this.positionRepository.findById(POSITION_ID)
    if (!POSITION) {
      throw new NotFoundError("`Position` not found.")
    }
    const PROPS = toCreateApplicationProps(input)
    const APPLICATION = Application.create(PROPS)
    const SAVED =
      await this.applicationRepository.save(APPLICATION)
    return toResponseDTO(SAVED)
  }
}
