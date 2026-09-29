import type { Metadata } from "next"

import { LoadCategoryPageProps } from "@/presentation/routes/category/helpers/load-category-page-props.helper"
import { CategoryList } from "@/presentation/routes/category/pages/list"

export const metadata: Metadata = {
  title: "Categorias",
}

export default async function CategoriesRoutePage() {
  const PROPS = await LoadCategoryPageProps()

  return <CategoryList {...PROPS} />
}