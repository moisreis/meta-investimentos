import type { Metadata } from "next"

import { LoadCategoryPageProps } from "@/presentation/routes/category/helpers/load-category-page-props.helper"
import { CategoryList } from "@/presentation/routes/category/pages/list"

export const metadata: Metadata = {
  title: "Categorias",
}

/**
 * @summary
 * Route page of the category list screen.
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
 * @date 2026-09-30
 */
export default async function CategoriesRoutePage() {
  const PROPS = await LoadCategoryPageProps()

  return <CategoryList {...PROPS} />
}
