import type { Metadata } from "next"

import { db } from "@/clients/database.client"
import { FundRepository } from "@/infrastructure/fund/repositories/fund.repository"
import { LoadCategories } from "@/presentation/routes/category/helpers/load-categories.helper"
import { BuildCategoryRowSummaries } from "@/presentation/routes/category/helpers/build-category-row-summaries.helper"
import { CategoryList } from "@/presentation/routes/category/pages/list"
import type { CategoryRowSummary } from "@/presentation/routes/category/types/category-list.types"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"
import { ListCategoryRowSummariesUseCase } from "@/services/category/use-cases/list-category-row-summaries.use-case"

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
    const SUMMARIES_USE_CASE =
      new ListCategoryRowSummariesUseCase(new FundRepository(db))
    const ROW_SUMMARIES = await SUMMARIES_USE_CASE.execute({
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
