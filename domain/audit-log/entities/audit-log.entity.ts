import { EntityId } from "@/value-objects";
import { ValidationError } from "@/errors";

interface AuditLogProps {
  entity: string;
  entityId: EntityId;
  action: string;
  changes?: Record<string, unknown> | null;
  userId?: EntityId | null;
  createdAt?: Date;
}

/**
 * @summary
 * Represents an audit log entry.
 *
 * @remarks
 * Must have entity, entityId, action. Instances immutable after creation.
 *
 * @explanation
 * Tracks system changes for compliance and debugging.
 * Stores entity, action, changes, and actor.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export class AuditLog {
  private readonly _id?: EntityId;
  private readonly props: Required<AuditLogProps>;

  /**
   * @summary
   * Returns the unique identifier of the audit log.
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
   * Returns the entity the audit log refers to.
   *
   * @remarks
   * Required string.
   *
   * @explanation
   * Use to filter logs by entity type.
   *
   * @returns Entity name string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get entity(): string {
    return this.props.entity;
  }

  /**
   * @summary
   * Returns the entity ID the audit log refers to.
   *
   * @remarks
   * Valid EntityId.
   *
   * @explanation
   * Use to filter logs by entity instance.
   *
   * @returns EntityId.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get entityId(): EntityId {
    return this.props.entityId;
  }

  /**
   * @summary
   * Returns the action performed on the entity.
   *
   * @remarks
   * Required string (e.g., "CREATED", "UPDATED", "DELETED").
   *
   * @explanation
   * Use to filter logs by action type.
   *
   * @returns Action string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get action(): string {
    return this.props.action;
  }

  /**
   * @summary
   * Returns the changes recorded for the entity.
   *
   * @remarks
   * Nullable record of field changes.
   *
   * @explanation
   * Use to inspect what changed.
   *
   * @returns Changes record or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get changes(): Record<string, unknown> | null {
    return this.props.changes;
  }

  /**
   * @summary
   * Returns the user ID who performed the action.
   *
   * @remarks
   * Nullable EntityId.
   *
   * @explanation
   * Use for accountability tracking.
   *
   * @returns EntityId or null.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  get userId(): EntityId | null {
    return this.props.userId;
  }

  /**
   * @summary
   * Returns the creation timestamp of the audit log.
   *
   * @remarks
   * Defaults to current time.
   *
   * @explanation
   * Use for temporal queries.
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
   * Creates an AuditLog instance.
   *
   * @remarks
   * Private constructor enforces factory method usage.
   *
   * @explanation
   * Internal use only. Use AuditLog.create instead.
   *
   * @param props - Required audit log properties.
   * @param id - Optional unique identifier string.
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  private constructor(props: Required<AuditLogProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * @summary
   * Creates a valid AuditLog from the provided properties.
   *
   * @remarks
   * Validates entity, entityId, action. Optional fields default.
   * createdAt defaults to current time.
   *
   * @explanation
   * Factory method to construct a valid AuditLog.
   * Throws ValidationError if validation fails.
   *
   * @param props - Properties required to create the audit log.
   * @param id - Optional unique identifier.
   *
   * @returns Valid AuditLog instance.
   *
   * @example
   * const AUDIT_LOG = AuditLog.create({
   *   entity: "User",
   *   entityId: EntityId.create("ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2"),
   *   action: "CREATED",
   * });
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public static create(props: AuditLogProps, id?: string): AuditLog {
    if (!props.entity || props.entity.trim() === "") {
      throw new ValidationError("AuditLog must have an entity.");
    }
    if (!props.entityId || props.entityId.trim() === "") {
      throw new ValidationError("AuditLog must have an entity id.");
    }
    if (!props.action || props.action.trim() === "") {
      throw new ValidationError("AuditLog must have an action.");
    }

    const NOW = new Date();

    const NORMALIZED_PROPS: Required<AuditLogProps> = {
      ...props,
      changes: props.changes ?? null,
      userId: props.userId ?? null,
      createdAt: props.createdAt ?? NOW,
    };

    return new AuditLog(NORMALIZED_PROPS, id);
  }

  /**
   * @summary
   * Compares this AuditLog with another for equality.
   *
   * @remarks
   * Based on referential equality and unique ID.
   *
   * @explanation
   * Use to check if two instances represent same entity.
   *
   * @param object - The AuditLog to compare against.
   *
   * @returns True if both share the same ID.
   *
   * @example
   * const A = AuditLog.create(PROPS, ID);
   * const B = AuditLog.create(PROPS, ID);
   * A.equals(B); // true
   *
   * @author Moisés Reis
   *
   * @date 2026-09-13
   */
  public equals(object?: AuditLog | null): boolean {
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
