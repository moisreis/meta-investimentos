import type { CNPJ } from "@/business/value-objects/cnpj.vo";
import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { SignedPercentage } from "@/business/value-objects/signed-percentage.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the properties required to create a {@link Fund}.
 *
 * The administration fee, performance fee, benchmark id, and category id
 * default to `null`, and the timestamps default to the current time when
 * not provided.
 *
 * Use {@link Fund.create} to create a valid `Fund` instance.
 */
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
 * Represents an investment fund.
 *
 * A `Fund`:
 * - must have a cnpj.
 * - must have a name.
 * - must have a bank id.
 *
 * `Fund` instances are immutable after creation.
 */
export class Fund {
  private readonly _id?: EntityId;
  private readonly props: Required<FundProps>;

  /**
   * Returns the unique identifier of the fund.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the cnpj of the fund.
   */
  get cnpj(): CNPJ {
    return this.props.cnpj;
  }

  /**
   * Returns the name of the fund.
   */
  get name(): string {
    return this.props.name;
  }

  /**
   * Returns the administration fee of the fund.
   */
  get administrationFee(): SignedPercentage | null {
    return this.props.administrationFee;
  }

  /**
   * Returns the performance fee of the fund.
   */
  get performanceFee(): SignedPercentage | null {
    return this.props.performanceFee;
  }

  /**
   * Returns the id of the bank the fund belongs to.
   */
  get bankId(): EntityId {
    return this.props.bankId;
  }

  /**
   * Returns the id of the benchmark the fund is compared against.
   */
  get benchmarkId(): EntityId | null {
    return this.props.benchmarkId;
  }

  /**
   * Returns the id of the category the fund belongs to.
   */
  get categoryId(): EntityId | null {
    return this.props.categoryId;
  }

  /**
   * Returns the creation timestamp of the fund.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the fund.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Creates a `Fund`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Fund.create} and therefore satisfy the
   * fund's invariants.
   */
  private constructor(props: Required<FundProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * Creates a valid `Fund` from the provided properties.
   *
   * The administration fee, performance fee, benchmark id, and category
   * id default to `null`, and the timestamps to the current time when
   * those properties are not provided.
   *
   * @param props - The properties required to create the fund.
   * @param id - The unique identifier of the fund.
   *
   * @returns A valid `Fund` instance.
   *
   * @throws {ValidationError} If `props.cnpj` is blank.
   * @throws {ValidationError} If `props.name` is blank.
   * @throws {ValidationError} If `props.bankId` is blank.
   */
  public static create(props: FundProps, id?: string): Fund {
    if (!props.cnpj) {
      throw new ValidationError("Fund must have a cnpj.");
    }
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("Fund must have a name.");
    }
    if (!props.bankId || props.bankId.trim() === "") {
      throw new ValidationError("Fund must have a bank id.");
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
   * Determines whether this `Fund` represents the same fund as the
   * provided instance, based on referential equality and the unique id.
   *
   * @param object - The fund to compare against.
   * @returns `true` when both funds share the same id; otherwise, `false`.
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
