import {
  type CNPJ,
  EntityId,
  type SignedPercentage,
} from "@/value-objects";
import { ValidationError } from "@/errors";

interface FundProps {
  cnpj: CNPJ;
  name: string;
  administrationFee?: SignedPercentage | null;
  performanceFee?: SignedPercentage | null;
  bankId: EntityId;
  benchmarkId?: EntityId | null;
  categoryId?: EntityId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @summary
 * Represents an investment fund.
 *
 * @remarks
 * Must have CNPJ, name, bankId. Instances immutable after creation.
 *
 * @explanation
 * Core fund entity with fees, bank, benchmark, category links.
 * Supports profile updates.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class Fund {
  private readonly _id?: EntityId;
  private readonly props: Required<FundProps>;

  /**
   * @summary
   * Returns the unique identifier of the fund.
   *
   * @remarks
   * Undefined if not yet persisted.
   *
   * @explanation
   * Use for persistence and equality checks.
   *
   * @returns EntityId or undefined.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * @summary
   * Returns the CNPJ of the fund.
   *
   * @remarks
   * Valid CNPJ value object.
   *
   * @explanation
   * Use for regulatory identification.
   *
   * @returns CNPJ.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get cnpj(): CNPJ {
    return this.props.cnpj;
  }

  /**
   * @summary
   * Returns the name of the fund.
   *
   * @remarks
   * Required string.
   *
   * @explanation
   * Use for display and identification.
   *
   * @returns Name string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get name(): string {
    return this.props.name;
  }

  /**
   * @summary
   * Returns the administration fee of the fund.
   *
   * @remarks
   * Nullable SignedPercentage.
   *
   * @explanation
   * Use for fee disclosure.
   *
   * @returns SignedPercentage or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get administrationFee(): SignedPercentage | null {
    return this.props.administrationFee;
  }

  /**
   * @summary
   * Returns the performance fee of the fund.
   *
   * @remarks
   * Nullable SignedPercentage.
   *
   * @explanation
   * Use for fee disclosure.
   *
   * @returns SignedPercentage or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get performanceFee(): SignedPercentage | null {
    return this.props.performanceFee;
  }

  /**
   * @summary
   * Returns the bank ID of the fund.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Use to associate fund with custodian bank.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get bankId(): EntityId {
    return this.props.bankId;
  }

  /**
   * @summary
   * Returns the benchmark ID of the fund.
   *
   * @remarks
   * Nullable EntityId.
   *
   * @explanation
   * Use for performance comparison.
   *
   * @returns EntityId or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get benchmarkId(): EntityId | null {
    return this.props.benchmarkId;
  }

  /**
   * @summary
   * Returns the category ID of the fund.
   *
   * @remarks
   * Nullable EntityId.
   *
   * @explanation
   * Use for classification and norms.
   *
   * @returns EntityId or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get categoryId(): EntityId | null {
    return this.props.categoryId;
  }

  /**
   * @summary
   * Returns the creation timestamp of the fund.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Use for audit and ordering.
   *
   * @returns Creation Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * @summary
   * Returns the last update timestamp of the fund.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Use for audit and cache invalidation.
   *
   * @returns Last update Date.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * @summary
   * Creates a Fund instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use Fund.create instead.
   *
   * @param props - Required fund properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<FundProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * @summary
   * Creates a valid Fund from the provided properties.
   *
   * @remarks
   * Validates CNPJ, name, bankId. Optional fields default to null.
   * Timestamps default to current time.
   *
   * @explanation
   * Factory method to construct a valid Fund.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the fund.
   * @param id - Optional unique identifier.
   *
   * @returns Valid Fund instance.
   *
   * @example
   * const FUND = Fund.create({
   *   cnpj: CNPJ.create("00.000.000/0001-91"),
   *   name: "Fundo Exemplo",
   *   bankId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: FundProps, id?: string): Fund {
    if (!props.cnpj) {
      throw new ValidationError("`Fund` must have a cnpj.");
    }
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("`Fund` must have a name.");
    }
    if (!props.bankId || props.bankId.trim() === "") {
      throw new ValidationError("`Fund` must have a bank id.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<FundProps> = {
      ...props,
      administrationFee: props.administrationFee ?? null,
      performanceFee: props.performanceFee ?? null,
      benchmarkId: props.benchmarkId ?? null,
      categoryId: props.categoryId ?? null,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new Fund(NORMALIZED_PROPS, id);
  }

  /**
   * @summary
   * Updates the mutable profile fields of this fund.
   *
   * @remarks
   * Only provided fields changed; undefined leaves existing; null clears.
   *
   * @explanation
   * Returns new Fund instance with updated fields.
   * Original unchanged.
   *
   * @param options - Fields to update.
   * @param now - Update timestamp (optional, defaults to now).
   *
   * @returns New Fund instance with updated fields.
   *
   * @example
   * const UPDATED = fund.update({
   *   name: "Novo Nome",
   *   administrationFee: SignedPercentage.create("1.5"),
   *   benchmarkId: null,
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public update(
    options: {
      name?: string;
      administrationFee?: SignedPercentage | null;
      performanceFee?: SignedPercentage | null;
      benchmarkId?: EntityId | null;
      categoryId?: EntityId | null;
    },
    now?: Date,
  ): Fund {
    if (options.name !== undefined && options.name.trim() === "") {
      throw new ValidationError("`Fund` must have a name.");
    }

    const NOW = now ?? new Date();

    return new Fund(
      {
        ...this.props,
        name: options.name ?? this.props.name,
        administrationFee:
          options.administrationFee === undefined
            ? this.props.administrationFee
            : options.administrationFee,
        performanceFee:
          options.performanceFee === undefined
            ? this.props.performanceFee
            : options.performanceFee,
        benchmarkId:
          options.benchmarkId === undefined
            ? this.props.benchmarkId
            : options.benchmarkId,
        categoryId:
          options.categoryId === undefined
            ? this.props.categoryId
            : options.categoryId,
        updatedAt: NOW,
      },
      this._id,
    );
  }

  /**
   * @summary
   * Compares this Fund with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Use to check if two instances represent same entity.
   *
   * @param object - The Fund to compare against.
   *
   * @returns True if both share the same ID.
   *
   * @example
   * const A = Fund.create(PROPS, ID);
   * const B = Fund.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: Fund | null): boolean {
    if (object == null || object === undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    if (!this._id || !object._id) {
      return false;
    }

    return this._id === object._id;
  }
}
