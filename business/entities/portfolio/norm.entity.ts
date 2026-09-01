import { EntityId } from "@/business/value-objects/entity-id.vo";
import type SignedPercentage from "@/business/value-objects/signed-percentage.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the properties required to create a {@link Norm}.
 *
 * The timestamps default to the current time when not provided.
 *
 * Use {@link Norm.create} to create a valid `Norm` instance.
 */
interface NormProps {
  articleNumber: string;
  name: string;
  categoryId: EntityId;
  minAllocation: SignedPercentage;
  maxAllocation: SignedPercentage;
  targetAllocation: SignedPercentage;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a regulatory norm that constrains allocations.
 *
 * A `Norm`:
 * - must have an article number.
 * - must have a name.
 * - must have a category id.
 * - must have a minimum allocation.
 * - must have a maximum allocation.
 * - must have a target allocation.
 *
 * `Norm` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const NORM = Norm.create({
 *   articleNumber: 'Art. 12',
 *   name: 'Limite de Concentração',
 *   categoryId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 *   minAllocation: SignedPercentage.create('5'),
 *   maxAllocation: SignedPercentage.create('20'),
 *   targetAllocation: SignedPercentage.create('12'),
 * })
 *
 * NORM.articleNumber
 * // 'Art. 12'
 * ```
 */
export class Norm {
  private readonly _id?: EntityId;
  private readonly props: Required<NormProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the norm.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the article number of the norm.
   */
  get articleNumber(): string {
    return this.props.articleNumber;
  }

  /**
   * Returns the name of the norm.
   */
  get name(): string {
    return this.props.name;
  }

  /**
   * Returns the id of the category the norm belongs to.
   */
  get categoryId(): EntityId {
    return this.props.categoryId;
  }

  /**
   * Returns the minimum allocation of the norm.
   */
  get minAllocation(): SignedPercentage {
    return this.props.minAllocation;
  }

  /**
   * Returns the maximum allocation of the norm.
   */
  get maxAllocation(): SignedPercentage {
    return this.props.maxAllocation;
  }

  /**
   * Returns the target allocation of the norm.
   */
  get targetAllocation(): SignedPercentage {
    return this.props.targetAllocation;
  }

  /**
   * Returns the creation timestamp of the norm.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the norm.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates a `Norm`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link Norm.create} and therefore satisfy the norm's
   * invariants.
   */
  private constructor(props: Required<NormProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `Norm` from the provided properties.
   *
   * The timestamps default to the current time when not provided.
   *
   * @param props - The properties required to create the norm.
   * @param id - The unique identifier of the norm.
   *
   * @returns A valid `Norm` instance.
   *
   * @throws {ValidationError} If `props.articleNumber` is blank.
   * @throws {ValidationError} If `props.name` is blank.
   * @throws {ValidationError} If `props.categoryId` is blank.
   * @throws {ValidationError} If `props.minAllocation` is missing.
   * @throws {ValidationError} If `props.maxAllocation` is missing.
   * @throws {ValidationError} If `props.targetAllocation` is missing.
   */
  public static create(props: NormProps, id?: string): Norm {
    if (!props.articleNumber || props.articleNumber.trim() === "") {
      throw new ValidationError("Norm must have an article number.");
    }
    if (!props.name || props.name.trim() === "") {
      throw new ValidationError("Norm must have a name.");
    }
    if (!props.categoryId || props.categoryId.trim() === "") {
      throw new ValidationError("Norm must have a category id.");
    }
    if (!props.minAllocation) {
      throw new ValidationError("Norm must have a minimum allocation.");
    }
    if (!props.maxAllocation) {
      throw new ValidationError("Norm must have a maximum allocation.");
    }
    if (!props.targetAllocation) {
      throw new ValidationError("Norm must have a target allocation.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<NormProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new Norm(NORMALIZED_PROPS, id);
  }

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `Norm` represents the same norm as the
   * provided instance, based on referential equality and the unique id.
   *
   * @param object - The norm to compare against.
   * @returns `true` when both norms share the same id; otherwise, `false`.
   */
  public equals(object?: Norm | null): boolean {
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
