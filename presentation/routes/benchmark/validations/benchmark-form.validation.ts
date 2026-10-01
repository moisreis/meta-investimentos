import { z } from "zod"

/**
 * @summary
 * Validates the benchmark add/edit form fields with
 * **Zod**.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
const BENCHMARK_FORM_SCHEMA = z.object({
  acronym: z.string().trim().min(1, "Informe a sigla."),
  name: z.string().trim().min(1, "Informe o nome."),
})

// Values of the benchmark add/edit form fields.
type BenchmarkFormValues = z.infer<typeof BENCHMARK_FORM_SCHEMA>

export { BENCHMARK_FORM_SCHEMA, type BenchmarkFormValues }
