import {
  type CNPJ,
  EntityId,
  type SignedPercentage,
} from "@/value-objects"
import { ValidationError } from "@/errors"

export interface FundRegisteredProps {
  fundId: EntityId
  cnpj: CNPJ
  name: string
  bankId: EntityId
  administrationFee?: SignedPercentage | null
  performanceFee?: SignedPercentage | null
  benchmarkId?: EntityId | null
  categoryId?: EntityId | null
  occurredAt?: Date
}

/**
 * @summary
 * Registers a new investment fund.
 *
 * @remarks
 * Emitted after the **Fund** entity is persisted.
 * Carries the registered profile and the custodian,
 * benchmark and category references.
 *
 * @explanation
 * Use this event to react to new fund creation. It
 * exposes the fund snapshot consumed by downstream
 * contexts for compliance, classification, and
 * performance attribution.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-30
 */
export class FundRegistered {
  private readonly _id?: EntityId
  private readonly props: Required<FundRegisteredProps>

  // Returns the unique identifier of the event.
  get id(): EntityId | undefined {
    return this._id
  }

  // Returns the identifier of the registered fund.
  get fundId(): EntityId {
    return this.props.fundId
  }

  // Returns the **CNPJ** of the registered fund.
  get cnpj(): CNPJ {
    return this.props.cnpj
  }

  // Returns the name of the registered fund.
  get name(): string {
    return this.props.name
  }

  // Returns the identifier of the custodian bank.
  get bankId(): EntityId {
    return this.props.bankId
  }

  // Returns the administration fee of the registered fund.
  get administrationFee(): SignedPercentage | null {
    return this.props.administrationFee
  }

  // Returns the performance fee of the registered fund.
  get performanceFee(): SignedPercentage | null {
    return this.props.performanceFee
  }

  // Returns the identifier of the benchmark, if linked.
  get benchmarkId(): EntityId | null {
    return this.props.benchmarkId
  }

  // Returns the identifier of the category, if linked.
  get categoryId(): EntityId | null {
    return this.props.categoryId
  }

  // Returns when the event occurred.
  get occurredAt(): Date {
    return new Date(this.props.occurredAt)
  }

  private constructor(
    props: Required<FundRegisteredProps>,
    id?: string
  ) {
    this._id = id ? EntityId.create(id) : undefined
    this.props = Object.freeze({
      ...props,
      occurredAt: new Date(props.occurredAt),
    })
  }

  /**
   * @summary
   * Creates a valid **FundRegistered** event.
   *
   * @remarks
   * Validates the required registration fields. The
   * fee, benchmark and category fields default to
   * null when omitted.
   *
   * @explanation
   * Factory method to build the event after the
   * **Fund** is stored. Throws a **ValidationError**
   * when a required field is missing.
   *
   * @param props - Properties of the registered fund.
   * @param id - Optional unique identifier of the event.
   *
   * @returns Valid event instance.
   *
   * @example
   * const EVENT = FundRegistered.create({
   *   fundId: EntityId.create(
   *     "123e4567-e89b-42d3-a456-426614174000"
   *   ),
   *   cnpj: CNPJ.create("00.000.000/0001-91"),
   *   name: "Fundo Multi Mercado",
   *   bankId: EntityId.create(
   *     "223e4567-e89b-42d3-a456-426614174000"
   *   ),
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-30
   */
  public static create(
    props: FundRegisteredProps,
    id?: string
  ): FundRegistered {
    if (!props.fundId) {
      throw new ValidationError(
        "`FundRegistered` must have a fund id."
      )
    }
    if (!props.cnpj) {
      throw new ValidationError(
        "`FundRegistered` must have a cnpj."
      )
    }
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError(
        "`FundRegistered` must have a name."
      )
    }
    if (!props.bankId) {
      throw new ValidationError(
        "`FundRegistered` must have a bank id."
      )
    }

    const NOW = new Date()

    type RequiredProps = Required<FundRegisteredProps>

    const NORMALIZED_PROPS: RequiredProps = {
      ...props,
      administrationFee: props.administrationFee ?? null,
      performanceFee: props.performanceFee ?? null,
      benchmarkId: props.benchmarkId ?? null,
      categoryId: props.categoryId ?? null,
      occurredAt: props.occurredAt ?? NOW,
    }

    return new FundRegistered(NORMALIZED_PROPS, id)
  }

  // Compares this event with another for equality.
  public equals(object?: FundRegistered | null): boolean {
    if (object == null || object === undefined) {
      return false
    }
    if (this === object) {
      return true
    }
    if (!this._id || !object._id) {
      return false
    }

    return this._id === object._id
  }
}
