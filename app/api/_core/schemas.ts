import { z } from "zod";

/**
 * A valid UUIDv4 entity id used in route parameters and references.
 */
export const entityIdSchema = z.string().uuid();

/**
 * A valid UUIDv4 route parameter.
 */
export const entityIdParam = z.string().uuid();

/**
 * Parses an ISO `YYYY-MM-DD` date and normalizes it to midnight UTC.
 */
export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a date in YYYY-MM-DD format.")
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

/**
 * A money amount expressed as a decimal string, signed.
 */
export const moneySchema = z
  .string()
  .regex(/^-?\d{1,15}(\.\d{1,4})?$/, "Expected a decimal amount.");

/**
 * A money amount expressed as a decimal string, unsigned.
 */
export const positiveMoneySchema = z
  .string()
  .regex(/^\d{1,15}(\.\d{1,4})?$/, "Expected a positive decimal amount.");

/**
 * A signed percentage expressed as a decimal string.
 */
export const percentageSchema = z
  .string()
  .regex(/^-?\d{1,9}(\.\d{1,4})?$/, "Expected a decimal percentage.");

/**
 * A fund CNPJ, with or without formatting marks.
 */
export const cnpjSchema = z
  .string()
  .min(14)
  .max(18)
  .refine((value) => /^[\d./-]+$/.test(value), "Expected a valid CNPJ.");

/**
 * Pagination query parameters accepted by list endpoints.
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * The type of the parsed pagination query.
 */
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

/**
 * The access roles accepted by portfolio access-grant endpoints.
 */
export const accessRoleSchema = z.enum(["VIEWER", "EDITOR"]);

/**
 * The reference periods accepted by performance calculation requests.
 */
export const referencePeriodSchema = z.enum([
  "date",
  "month",
  "year-to-date",
  "trailing-12m",
  "range",
]);

/**
 * The query parameters shared by the reference-date read endpoints.
 */
export const referenceDateQuerySchema = z.object({
  referenceDate: dateStringSchema.optional(),
});

/**
 * A schema that accepts an empty JSON body.
 */
export const emptyBodySchema = z.object({}).passthrough();
