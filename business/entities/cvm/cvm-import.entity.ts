import { EntityId } from "@/business/value-objects/entity-id.vo";
import { ValidationError } from "@/shared/errors";

/**
 * The set of lifecycle states a {@link CvmImport} run can be in.
 *
 * - `RUNNING` — the import started and has not finished yet.
 * - `SUCCESS` — every requested file was processed.
 * - `PARTIAL` — some files were unavailable or some records were
 *   skipped, but the import completed.
 * - `FAILED` — a hard error prevented the import from completing.
 */
export type CvmImportStatus = "RUNNING" | "SUCCESS" | "PARTIAL" | "FAILED";

/**
 * The result counters recorded for a {@link CvmImport} run.
 */
export interface CvmImportCounts {
  /**
   * The number of monthly files the requested range mapped to.
   */
  filesFound: number;

  /**
   * The number of files successfully downloaded and processed.
   */
  filesDownloaded: number;

  /**
   * The number of files that were unavailable (404/403) or failed to
   * process.
   */
  filesUnavailable: number;

  /**
   * The number of CSV records that matched a known fund.
   */
  recordsMatched: number;

  /**
   * The number of records written to the database (inserts and
   * updates).
   */
  recordsImported: number;

  /**
   * The number of records that updated an existing quota row.
   */
  recordsUpserted: number;

  /**
   * The number of records skipped (unknown fund, invalid value, or
   * duplicate).
   */
  recordsSkipped: number;
}

/**
 * The properties required to create a {@link CvmImport}.
 */
interface CvmImportProps extends CvmImportCounts {
  source: string;
  status: CvmImportStatus;
  requestedStart?: Date;
  requestedEnd?: Date;
  requestedFundCnpjs?: string[];
  monthsBack: number;
  error?: string;
  startedAt: Date;
  finishedAt?: Date;
  createdAt?: Date;
}

/**
 * Represents the summary record of a single CVM historical quota import
 * run.
 *
 * A `CvmImport`:
 * - records the data source and the requested scope (date range, funds).
 * - records the lifecycle timestamps and the final status.
 * - records the result counts and any error message.
 *
 * `CvmImport` instances are immutable after creation.
 */
export class CvmImport {
  private readonly _id?: EntityId;
  private readonly props: {
    source: string;
    status: CvmImportStatus;
    requestedStart?: Date;
    requestedEnd?: Date;
    requestedFundCnpjs?: string[];
    monthsBack: number;
    filesFound: number;
    filesDownloaded: number;
    filesUnavailable: number;
    recordsMatched: number;
    recordsImported: number;
    recordsUpserted: number;
    recordsSkipped: number;
    error?: string;
    startedAt: Date;
    finishedAt?: Date;
    createdAt: Date;
  };

  /**
   * Returns the unique identifier of the import.
   */
  get id(): EntityId | undefined {
    return this._id;
  }

  /**
   * Returns the data source of the import.
   */
  get source(): string {
    return this.props.source;
  }

  /**
   * Returns the status of the import.
   */
  get status(): CvmImportStatus {
    return this.props.status;
  }

  /**
   * Returns the requested start of the import range, when provided.
   */
  get requestedStart(): Date | undefined {
    return this.props.requestedStart;
  }

  /**
   * Returns the requested end of the import range, when provided.
   */
  get requestedEnd(): Date | undefined {
    return this.props.requestedEnd;
  }

  /**
   * Returns the requested fund CNPJs, when a subset of funds was
   * requested.
   */
  get requestedFundCnpjs(): string[] | undefined {
    return this.props.requestedFundCnpjs;
  }

  /**
   * Returns the number of months looked back when no end date was
   * provided.
   */
  get monthsBack(): number {
    return this.props.monthsBack;
  }

  /**
   * Returns the number of files the requested range mapped to.
   */
  get filesFound(): number {
    return this.props.filesFound;
  }

  /**
   * Returns the number of files successfully processed.
   */
  get filesDownloaded(): number {
    return this.props.filesDownloaded;
  }

  /**
   * Returns the number of files that were unavailable or failed.
   */
  get filesUnavailable(): number {
    return this.props.filesUnavailable;
  }

  /**
   * Returns the number of records that matched a known fund.
   */
  get recordsMatched(): number {
    return this.props.recordsMatched;
  }

  /**
   * Returns the number of records written to the database.
   */
  get recordsImported(): number {
    return this.props.recordsImported;
  }

  /**
   * Returns the number of records that updated an existing row.
   */
  get recordsUpserted(): number {
    return this.props.recordsUpserted;
  }

  /**
   * Returns the number of records skipped.
   */
  get recordsSkipped(): number {
    return this.props.recordsSkipped;
  }

  /**
   * Returns the error message, when the import failed.
   */
  get error(): string | undefined {
    return this.props.error;
  }

  /**
   * Returns the timestamp the import started.
   */
  get startedAt(): Date {
    return this.props.startedAt;
  }

  /**
   * Returns the timestamp the import finished, when it has.
   */
  get finishedAt(): Date | undefined {
    return this.props.finishedAt;
  }

  /**
   * Returns the creation timestamp of the import record.
   */
  get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Creates a `CvmImport`.
   *
   * The constructor is private to ensure that all instances are created
   * through {@link CvmImport.create} and therefore satisfy the import's
   * invariants.
   */
  private constructor(props: CvmImportProps, id?: string) {
    this._id = id ? EntityId.create(id) : undefined;
    this.props = Object.freeze({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  /**
   * Creates a valid `CvmImport` from the provided properties.
   *
   * @param props - The properties required to create the import.
   * @param id - The unique identifier of the import.
   * @returns A valid `CvmImport` instance.
   *
   * @throws {ValidationError} If `props.source` is blank.
   * @throws {ValidationError} If `props.status` is blank.
   * @throws {ValidationError} If `props.startedAt` is not provided.
   */
  public static create(props: CvmImportProps, id?: string): CvmImport {
    if (!props.source || props.source.trim() === "") {
      throw new ValidationError("CvmImport must have a source.");
    }
    if (!props.status) {
      throw new ValidationError("CvmImport must have a status.");
    }
    if (!props.startedAt) {
      throw new ValidationError("CvmImport must have a startedAt timestamp.");
    }

    return new CvmImport(props, id);
  }

  /**
   * Determines whether this `CvmImport` represents the same import as
   * the provided instance, based on referential equality and the unique
   * id.
   *
   * @param object - The import to compare against.
   * @returns `true` when both imports share the same id; otherwise,
   *   `false`.
   */
  public equals(object?: CvmImport | null): boolean {
    if (object == null) {
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
