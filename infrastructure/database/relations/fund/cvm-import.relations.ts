import { defineRelations } from "drizzle-orm";
import { cvmImport, quotaImport } from "../../schemas";

/**
 * Defines the relations applicable to the `cvm_import` table.
 *
 * A cvm import run can be the origin of many {@link quotaImport}
 * provenance rows, linked through the `importId` foreign key.
 */
export const cvmImportRelations = defineRelations(
  { cvmImport, quotaImport },
  (r) => ({
    cvmImport: {
      quotaImports: r.many.quotaImport({
        from: r.cvmImport.id,
        to: r.quotaImport.importId,
      }),
    },
  }),
);

/**
 * Defines the relations applicable to the `quota_import` table.
 *
 * A quota import provenance row always belongs to exactly one
 * {@link cvmImport} run and one {@link fund}, linked through their
 * foreign keys.
 */
export const quotaImportRelations = defineRelations(
  { cvmImport, quotaImport },
  (r) => ({
    quotaImport: {
      cvmImport: r.one.cvmImport({
        from: r.quotaImport.importId,
        to: r.cvmImport.id,
      }),
    },
  }),
);
