import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ValidationError } from "@/shared/errors";

/**
 * Represents the access level granted to a user on a portfolio.
 *
 * A `VIEWER` can only read portfolio data. An `EDITOR` can also
 * create, update, and delete positions, applications, and withdrawals.
 */
export type PortfolioPermissionRole = "VIEWER" | "EDITOR";

/**
 * Represents the properties required to create a
 * {@link PortfolioPermission}.
 *
 * The timestamps default to the current time when not provided.
 *
 * Use {@link PortfolioPermission.create} to create a valid
 * `PortfolioPermission` instance.
 */
interface PortfolioPermissionProps {
  userId: EntityId;
  portfolioId: EntityId;
  role: PortfolioPermissionRole;
  grantedByUserId: EntityId;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents the permission granted to a user on a portfolio.
 *
 * A `PortfolioPermission`:
 * - must have a user id.
 * - must have a portfolio id.
 * - must have a role.
 * - must have a granted-by user id.
 * - must not grant access to the portfolio owner (ownership is implicit).
 *
 * `PortfolioPermission` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const PERMISSION = PortfolioPermission.create({
 *   userId: 'f8d4d5e9-1c2b-4a3b-8c1d-2e4f6a8b0c1d',
 *   portfolioId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 *   role: 'VIEWER',
 *   grantedByUserId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 * })
 *
 * PERMISSION.role
 * // 'VIEWER'
 * ```
 */
export class PortfolioPermission {
  private readonly _id?: EntityId;
  private readonly props: Required<PortfolioPermissionProps>;

  /**
   * Returns the unique identifier of the portfolio permission.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the id of the user the permission grants access to.
   */
  get userId(): EntityId {
    return this.props.userId;
  }

  /**
   * Returns the id of the portfolio the permission grants access to.
   */
  get portfolioId(): EntityId {
    return this.props.portfolioId;
  }

  /**
   * Returns the role granted to the user.
   */
  get role(): PortfolioPermissionRole {
    return this.props.role;
  }

  /**
   * Returns the id of the user who granted the permission.
   */
  get grantedByUserId(): EntityId {
    return this.props.grantedByUserId;
  }

  /**
   * Returns the creation timestamp of the portfolio permission.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Returns the last update timestamp of the portfolio permission.
   */
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Creates a `PortfolioPermission`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link PortfolioPermission.create} and therefore
   * satisfy the portfolio permission's invariants.
   */
  private constructor(props: Required<PortfolioPermissionProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * Creates a valid `PortfolioPermission` from the provided properties.
   *
   * The timestamps default to the current time when not provided.
   *
   * @param props - The properties required to create the portfolio
   *   permission.
   * @param id - The unique identifier of the portfolio permission.
   *
   * @returns A valid `PortfolioPermission` instance.
   *
   * @throws {ValidationError} If `props.userId` is blank.
   * @throws {ValidationError} If `props.portfolioId` is blank.
   * @throws {ValidationError} If `props.role` is not a valid role.
   * @throws {ValidationError} If `props.grantedByUserId` is blank.
   * @throws {ValidationError} If `props.userId` equals
   *   `props.grantedByUserId`.
   */
  public static create(
    props: PortfolioPermissionProps,
    id?: string,
  ): PortfolioPermission {
    if (!props.userId || props.userId.trim() === "") {
      throw new ValidationError("PortfolioPermission must have a user id.");
    }
    if (!props.portfolioId || props.portfolioId.trim() === "") {
      throw new ValidationError(
        "PortfolioPermission must have a portfolio id.",
      );
    }
    if (props.role !== "VIEWER" && props.role !== "EDITOR") {
      throw new ValidationError("PortfolioPermission must have a valid role.");
    }
    if (!props.grantedByUserId || props.grantedByUserId.trim() === "") {
      throw new ValidationError(
        "PortfolioPermission must have a granted-by user id.",
      );
    }
    if (props.userId === props.grantedByUserId) {
      throw new ValidationError(
        "PortfolioPermission must not grant access to the portfolio owner.",
      );
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<PortfolioPermissionProps> = {
      ...props,
      createdAt: props.createdAt ?? NOW,
      updatedAt: props.updatedAt ?? NOW,
    };

    return new PortfolioPermission(NORMALIZED_PROPS, id);
  }

  /**
   * Updates the role of this portfolio permission.
   *
   * @param role - The new role.
   * @param now - The update timestamp, defaulting to the current time.
   *
   * @returns A new `PortfolioPermission` instance with the updated role.
   *
   * @throws {ValidationError} If `role` is not a valid role.
   */
  public updateRole(
    role: PortfolioPermissionRole,
    now?: Date,
  ): PortfolioPermission {
    if (role !== "VIEWER" && role !== "EDITOR") {
      throw new ValidationError("PortfolioPermission must have a valid role.");
    }

    const NOW = now ?? new Date();

    return new PortfolioPermission(
      {
        ...this.props,
        role,
        updatedAt: NOW,
      },
      this._id,
    );
  }

  /**
   * Determines whether this `PortfolioPermission` represents the same
   * permission as the provided instance, based on referential equality
   * and the unique id.
   *
   * @param object - The permission to compare against.
   * @returns `true` when both permissions share the same id;
   *   otherwise, `false`.
   */
  public equals(object?: PortfolioPermission | null): boolean {
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
