import { z } from "zod"

// Identifies a row of any entity. Trimmed, so a padded id
// from a hand-crafted request cannot slip past the check.
const ID_SCHEMA = z
  .string()
  .trim()
  .min(1, "Informe o identificador.")

// An optional free text field, bounded so a request cannot
// push an unbounded string into the persistence layer.
const OPTIONAL_TEXT_SCHEMA = z
  .string()
  .trim()
  .max(255, "Texto muito longo.")

export { ID_SCHEMA, OPTIONAL_TEXT_SCHEMA }
