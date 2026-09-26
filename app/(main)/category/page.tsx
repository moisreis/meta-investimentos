import type { Metadata } from "next"

import { CategoryContainer } from "@/presentation/composition/category.container"
import { LoadCategories } from "@/presentation/routes/category/helpers/load-categories.helper"
import { BuildCategoryRowSummaries } from "@/presentation/routes/category/helpers/build-category-row-summaries.helper"
import { CategoryList } from "@/presentation/routes/category/pages/list"
import type { CategoryRowSummary } from "@/presentation/routes/category/types/category-list.types"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

export const metadata: Metadata = {
  title: "Categorias",
}

export default async function CategoriesRoutePage() {
  let CATEGORIES: CategoryResponseDTO[] | null = null
  let SUMMARIES: Record<string, CategoryRowSummary> = {}

  const CATEGORIES_LOADED = await LoadCategories()

  if (CATEGORIES_LOADED) {
    CATEGORIES = CATEGORIES_LOADED

    const CATEGORY_IDS = CATEGORIES.map(
      (category) => category.id
    )
    const { listRowSummaries: LIST_ROW_SUMMARIES } =
      CategoryContainer()
    const ROW_SUMMARIES = await LIST_ROW_SUMMARIES.execute({
      categoryIds: CATEGORY_IDS,
    })

    SUMMARIES = BuildCategoryRowSummaries(
      CATEGORIES,
      ROW_SUMMARIES
    )
  }

  return (
    <>
      <CategoryList data={CATEGORIES} summaries={SUMMARIES} />
    </>
  )
}
