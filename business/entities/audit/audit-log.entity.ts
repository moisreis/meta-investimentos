/**
 * Represents the properties required to create an {@link AuditLog}.
 *
 * The `changes` and `userId` default to `null`, and the `createdAt`
 * timestamp defaults to the current time when not provided.
 *
 * Use {@link AuditLog.create} to create a valid `AuditLog` instance.
 */
interface AuditLogProps {
  entity: string;
  entityId: string;
  action: string;
  changes?: Record<string, unknown> | null;
  userId?: string | null;
  createdAt?: Date;
}

/**
 * Represents an audit log entry.
 *
 * An `AuditLog`:
 * - must have an entity.
 * - must have an entity id.
 * - must have an action.
 *
 * `AuditLog` instances are immutable after creation.
 *
 * @example
 * ```ts
 * const AUDIT_LOG = AuditLog.create({
 *   entity: 'User',
 *   entityId: 'ba57ad33-3d94-4a4a-9a6f-b3f916f7b4a2',
 *   action: 'CREATED',
 * })
 *
 * AUDIT_LOG.action
 * // 'CREATED'
 * ```
 */
export class AuditLog {
  private readonly _id?: string;
  private readonly props: Required<AuditLogProps>;

  // --------------------------------------
  // GETTERS
  // --------------------------------------

  /**
   * Returns the unique identifier of the audit log.
   */
  get id(): string | undefined {
    return this._id;
  }

  /**
   * Returns the entity the audit log refers to.
   */
  get entity(): string {
    return this.props.entity;
  }

  /**
   * Returns the id of the entity the audit log refers to.
   */
  get entityId(): string {
    return this.props.entityId;
  }

  /**
   * Returns the action performed on the entity.
   */
  get action(): string {
    return this.props.action;
  }

  /**
   * Returns the changes recorded for the entity.
   */
  get changes(): Record<string, unknown> | null {
    return this.props.changes;
  }

  /**
   * Returns the id of the user who performed the action.
   */
  get userId(): string | null {
    return this.props.userId;
  }

  /**
   * Returns the creation timestamp of the audit log.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  // --------------------------------------
  // CONSTRUCTOR
  // --------------------------------------

  /**
   * Creates an `AuditLog`.
   *
   * The constructor is private to ensure that all instances are
   * created through {@link AuditLog.create} and therefore satisfy the
   * audit log's invariants.
   */
  private constructor(props: Required<AuditLogProps>, id?: string) {
    this._id = id;
    this.props = props;
  }

  // --------------------------------------
  // FACTORY METHODS
  // --------------------------------------

  /**
   * Creates a valid `AuditLog` from the provided properties.
   *
   * The `changes` and `userId` default to `null`, and the `createdAt`
   * timestamp defaults to the current time when not provided.
   *
   * @param props - The properties required to create the audit log.
   * @param id - The unique identifier of the audit log.
   *
   * @returns A valid `AuditLog` instance.
   *
   * @throws {Error} If `props.entity` is blank.
   * @throws {Error} If `props.entityId` is blank.
   * @throws {Error} If `props.action` is blank.
   */
  public static create(props: AuditLogProps, id?: string): AuditLog {
    if (!props.entity || props.entity.trim() === "") {
      throw new Error("AuditLog must have an entity.");
    }
    if (!props.entityId || props.entityId.trim() === "") {
      throw new Error("AuditLog must have an entity id.");
    }
    if (!props.action || props.action.trim() === "") {
      throw new Error("AuditLog must have an action.");
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

  // --------------------------------------
  // COMPARISON METHODS
  // --------------------------------------

  /**
   * Determines whether this `AuditLog` represents the same audit log
   * as the provided instance, based on referential equality and the
   * unique id.
   *
   * @param object - The audit log to compare against.
   * @returns `true` when both audit logs share the same id; otherwise, `false`.
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
