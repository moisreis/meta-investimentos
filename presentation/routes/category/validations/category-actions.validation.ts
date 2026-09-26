import { z } from "zod"

import { ID_SCHEMA } from "@/lib/validation/common.validation"

import { CATEGORY_FORM_SCHEMA } from "./category-form.validations"

// The payload accepted by the create category action. The
// form and the action share this schema, so the client check
// and the server check can never drift apart.
const CREATE_CATEGORY_SCHEMA = CATEGORY_FORM_SCHEMA

// Values of the create category action payload.
type CreateCategoryValues = z.infer<
  typeof CREATE_CATEGORY_SCHEMA
>

// The payload accepted by the update category action.
const UPDATE_CATEGORY_SCHEMA = CATEGORY_FORM_SCHEMA.extend({
  categoryId: ID_SCHEMA,
})

// Values of the update category action payload.
type UpdateCategoryValues = z.infer<
  typeof UPDATE_CATEGORY_SCHEMA
>

// The payload accepted by the delete category action.
const DELETE_CATEGORY_SCHEMA = z.object({
  categoryId: ID_SCHEMA,
})

// Values of the delete category action payload.
type DeleteCategoryValues = z.infer<
  typeof DELETE_CATEGORY_SCHEMA
>

// The payload accepted by the bulk delete categories action.
const BULK_DELETE_CATEGORIES_SCHEMA = z.object({
  categoryIds: z
    .array(ID_SCHEMA)
    .min(1, "Selecione ao menos uma categoria.")
    .max(500, "Selecione menos de 500 categorias."),
})

// Values of the bulk delete categories action payload.
type BulkDeleteCategoriesValues = z.infer<
  typeof BULK_DELETE_CATEGORIES_SCHEMA
>

export {
  BULK_DELETE_CATEGORIES_SCHEMA,
  CREATE_CATEGORY_SCHEMA,
  DELETE_CATEGORY_SCHEMA,
  UPDATE_CATEGORY_SCHEMA,
  type BulkDeleteCategoriesValues,
  type CreateCategoryValues,
  type DeleteCategoryValues,
  type UpdateCategoryValues,
}
