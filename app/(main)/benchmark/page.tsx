import type { Metadata } from "next"

import { LoadBenchmarkPageProps } from "@/presentation/routes/benchmark/helpers/load-benchmark-page-props.helper"
import { BenchmarkList } from "@/presentation/routes/benchmark/pages/list"

export const metadata: Metadata = {
  title: "Benchmarks",
}

/**
 * @summary
 * Route page of the benchmark list screen.
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
export default async function BenchmarksRoutePage() {
  const PROPS = await LoadBenchmarkPageProps()

  return <BenchmarkList {...PROPS} />
}
