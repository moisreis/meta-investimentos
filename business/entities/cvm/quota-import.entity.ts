import { EntityId } from "@/business/value-objects/entity-id.vo";
import type { QuotaPrice } from "@/business/value-objects/quota-price.vo";
import { ValidationError } from "@/shared/errors";

/**
 * The action taken on a quota row during an import run.
 *
 * - `INSERT` — a new quota row was created.
 * - `UPDATE` — an existing quota row was corrected.
 * - `SKIP` — the record was skipped (e.g. duplicate or invalid).
 */
export type QuotaImportAction = "INSERT" | "UPDATE" | "SKIP";

/**
 * The properties required to create a {@link QuotaImport}.
 */
interface QuotaImportProps {
  importId: EntityId;
  fundId: EntityId;
  date: Date;
  price: QuotaPrice;
  action: QuotaImportAction;
  createdAt?: Date;
}

/**
 * Represents the provenance of a quota row handled by an import run.
 *
 * A `QuotaImport` links a quota (fund, date, price) back to the
 * {@link CvmImport} run that produced it and records the action taken,
 * so affected portfolios can be recomputed afterwards.
 *
 * `QuotaImport` instances are immutable after creation.
 */
export class QuotaImport {
  private readonly _id?: EntityId;
  private readonly props: Required<QuotaImportProps>;

  /**
   * Returns the unique identifier of the provenance record.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the id of the import run that produced this record.
   */
  get importId(): EntityId {
    return this.props.importId;
  }

  /**
   * Returns the id of the affected fund.
   */
  get fundId(): EntityId {
    return this.props.fundId;
  }

  /**
   * Returns the date of the quota row.
   */
  get date(): Date {
    return this.props.date;
  }

  /**
   * Returns the price of the quota row.
   */
  get price(): QuotaPrice {
    return this.props.price;
  }

  /**
   * Returns the action taken on the quota row.
   */
  get action(): QuotaImportAction {
    return this.props.action;
  }

  /**
   * Returns the creation timestamp of the provenance record.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Creates a `QuotaImport`.
   *
   * The constructor is private to ensure that all instances are created
   * through {@link QuotaImport.create} and therefore satisfy the
   * record's invariants.
   */
  private constructor(props: Required<QuotaImportProps>, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze(props);
  }

  /**
   * Creates a valid `QuotaImport` from the provided properties.
   *
   * @param props - The properties required to create the record.
   * @param id - The unique identifier of the record.
   * @returns A valid `QuotaImport` instance.
   *
   * @throws {ValidationError} If `props.importId` is blank.
   * @throws {ValidationError} If `props.fundId` is blank.
   * @throws {ValidationError} If `props.date` is not provided.
   * @throws {ValidationError} If `props.price` is not provided.
   * @throws {ValidationError} If `props.action` is not provided.
   */
  public static create(props: QuotaImportProps, id?: string): QuotaImport {
    if (!props.importId || props.importId.trim() === "") {
      throw new ValidationError("QuotaImport must have an import id.");
    }
    if (!props.fundId || props.fundId.trim() === "") {
      throw new ValidationError("QuotaImport must have a fund id.");
    }
    if (!props.date) {
      throw new ValidationError("QuotaImport must have a date.");
    }
    if (!props.price) {
      throw new ValidationError("QuotaImport must have a price.");
    }
    if (!props.action) {
      throw new ValidationError("QuotaImport must have an action.");
    }

    return new QuotaImport(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
