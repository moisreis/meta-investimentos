/**
 * The context shared across every step of the CVM import pipeline.
 */
export interface CvmImportContext {
  importId: string;
  fundCnpjMap: Map<string, string>;
  requestedStart?: Date;
  requestedEnd?: Date;
  monthsBack: number;
  source: string;
}

/**
 * A monthly file downloaded from the CVM data source.
 */
export interface DownloadedFile {
  year: number;
  month: number;
  data: Buffer;
}

/**
 * An extracted CSV content from a downloaded zip.
 */
export interface ExtractedFile {
  year: number;
  month: number;
  csvContent: string;
}

/**
 * A single raw record parsed from the CVM CSV.
 */
export interface CvmRawRecord {
  cnpj: string;
  date: string;
  price: string;
}

/**
 * A record matched to a known fund.
 */
export interface MatchedRecord {
  fundId: string;
  cnpj: string;
  date: Date;
  price: string;
}

/**
 * A record validated and ready for upsert.
 */
export interface SanitizedRecord {
  fundId: string;
  date: Date;
  price: string;
}
