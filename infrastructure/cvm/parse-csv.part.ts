import type { CvmRawRecord, ExtractedFile } from "./types";

/**
 * Parses each extracted CSV into an array of raw CVM records.
 *
 * The CSV is semicolon-separated and the code looks for the columns
 * `CNPJ_FUNDO_CLASSE`, `VL_QUOTA` and `DT_COMPTC`. The header row is
 * skipped.
 *
 * @param files - The extracted CSV contents.
 * @returns The parsed raw records.
 */
export function parseCsv(files: ExtractedFile[]): CvmRawRecord[] {
  const RECORDS: CvmRawRecord[] = [];

  for (const FILE of files) {
    const LINES = FILE.csvContent.split("\n");

    if (LINES.length < 2) {
      continue;
    }

    const HEADER = LINES[0].split(";").map((C) => C.trim());

    const CNPJ_INDEX = HEADER.indexOf("CNPJ_FUNDO_CLASSE");
    const PRICE_INDEX = HEADER.indexOf("VL_QUOTA");
    const DATE_INDEX = HEADER.indexOf("DT_COMPTC");

    if (CNPJ_INDEX === -1 || PRICE_INDEX === -1 || DATE_INDEX === -1) {
      continue;
    }

    for (let I = 1; I < LINES.length; I++) {
      const LINE = LINES[I].trim();

      if (!LINE) {
        continue;
      }

      const COLUMNS = LINE.split(";");

      if (COLUMNS.length <= Math.max(CNPJ_INDEX, PRICE_INDEX, DATE_INDEX)) {
        continue;
      }

      const CNPJ = COLUMNS[CNPJ_INDEX]?.trim();
      const PRICE = COLUMNS[PRICE_INDEX]?.trim();
      const DATE = COLUMNS[DATE_INDEX]?.trim();

      if (!CNPJ || !PRICE || !DATE) {
        continue;
      }

      RECORDS.push({
        cnpj: CNPJ,
        date: DATE,
        price: PRICE,
      });
    }
  }

  return RECORDS;
}
