import AdmZip from "adm-zip";
import type { DownloadedFile, ExtractedFile } from "./types";

/**
 * Extracts the first CSV file from each downloaded zip archive.
 *
 * The CVM monthly zip contains a single `inf_diario_fi_YYYYMM.csv`
 * file encoded in ISO-8859-1. The function reads the archive, locates
 * the CSV entry and decodes it into a UTF-8 string.
 *
 * A zip that cannot be opened or that does not contain a CSV entry is
 * treated as a source error and the file is skipped.
 *
 * @param files - The downloaded zip archives.
 * @returns The extracted CSV contents.
 */
export function extractFiles(files: DownloadedFile[]): ExtractedFile[] {
  const RESULTS: ExtractedFile[] = [];

  for (const FILE of files) {
    try {
      const ZIP = new AdmZip(FILE.data);
      const ENTRIES = ZIP.getEntries();

      const CSV_ENTRY = ENTRIES.find((E) =>
        E.entryName.toLowerCase().endsWith(".csv"),
      );

      if (!CSV_ENTRY) {
        continue;
      }

      const RAW = CSV_ENTRY.getData();
      const CONTENT = RAW.toString("latin1");

      RESULTS.push({
        year: FILE.year,
        month: FILE.month,
        csvContent: CONTENT,
      });
    } catch {}
  }

  return RESULTS;
}
