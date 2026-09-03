import { Fund } from "@/business/entities/fund/fund.entity";
import { CNPJ } from "@/business/value-objects/cnpj.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import type { UnitOfWork } from "@/infrastructure/unit-of-work";
import { NotFoundError, ValidationError } from "@/shared/errors";

import type { FundDto } from "./fund.dtos";
import { toFundDto } from "./fund.dtos";

/**
 * Input for {@link createFund}.
 */
export interface CreateFundInput {
  /**
   * The id of the authenticated actor.
   */
  actorId: string;

  /**
   * The CNPJ of the fund, with or without formatting.
   */
  cnpj: string;

  /**
   * The name of the fund.
   */
  name: string;

  /**
   * The administration fee, as a decimal string.
   */
  administrationFee?: string | null;

  /**
   * The performance fee, as a decimal string.
   */
  performanceFee?: string | null;

  /**
   * The id of the bank the fund belongs to.
   */
  bankId: string;

  /**
   * The id of the benchmark the fund is compared against.
   */
  benchmarkId?: string | null;

  /**
   * The id of the category the fund belongs to.
   */
  categoryId?: string | null;
}

/**
 * Creates a fund.
 *
 * The fund is created inside one `UnitOfWork` transaction so the
 * insertion and its audit log commit atomically.
 *
 * @param unitOfWork - The transaction coordinator.
 * @param input - The fund properties.
 * @returns The created {@link FundDto}.
 *
 * @throws {ValidationError} When the fund CNPJ already exists.
 * @throws {NotFoundError} When the referenced bank does not exist.
 */
export async function createFund(
  unitOfWork: UnitOfWork,
  input: CreateFundInput,
): Promise<FundDto> {
  return unitOfWork.run(
    async (tx) => {
      const cnpj = CNPJ.create(input.cnpj);

      const existing = await tx.funds.findByCnpj(cnpj.value);

      if (existing !== null) {
        throw new ValidationError(
          `Fund with cnpj ${cnpj.value} already exists.`,
        );
      }

      const bank = await tx.banks.findById(EntityId.create(input.bankId));

      if (bank === null) {
        throw new NotFoundError(`Bank with id ${input.bankId} was not found.`);
      }

      const fund = Fund.create({
        cnpj,
        name: input.name,
        administrationFee:
          input.administrationFee !== undefined &&
          input.administrationFee !== null
            ? SignedPercentage.create(input.administrationFee)
            : null,
        performanceFee:
          input.performanceFee !== undefined && input.performanceFee !== null
            ? SignedPercentage.create(input.performanceFee)
            : null,
        bankId: EntityId.create(input.bankId),
        benchmarkId:
          input.benchmarkId != null
            ? EntityId.create(input.benchmarkId)
            : undefined,
        categoryId:
          input.categoryId != null
            ? EntityId.create(input.categoryId)
            : undefined,
      });

      const saved = await tx.funds.save(fund);

      return toFundDto(saved);
    },
    { userId: EntityId.create(input.actorId) },
  );
}
