import type { Metadata } from "next"

import { LoadBenchmarkHistoryPageProps } from "@/presentation/routes/benchmark-history/helpers/load-benchmark-history-page-props.helper"
import { BenchmarkHistoryList } from "@/presentation/routes/benchmark-history/pages/list"

export const metadata: Metadata = {
  title: "Histórico de Benchmarks",
}

/**
 * @summary
 * Route page of the benchmark history list screen.
 *
 * @remarks
 * Loads the props of the screen on the server, so the
 * first paint already carries the data, and hands them
 * to the route page that composes the screen. The page
 * itself only decides the title and the entry point, so
 * the same route page can be rendered from anywhere.
 *
 * @returns The route page of the screen.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export default async function BenchmarkHistoryRoutePage() {
  const PROPS = await LoadBenchmarkHistoryPageProps()

  return <BenchmarkHistoryList {...PROPS} />
}
