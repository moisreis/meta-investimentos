"use client"

import { IconLoader } from "@tabler/icons-react"

import { SharedFormWrapper } from "@/presentation/shared/forms/shared-form-wrapper"
import { Button } from "@/presentation/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/presentation/ui/field"
import { Input } from "@/presentation/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/presentation/ui/input-group"

import { usePortfolioForm } from "../hooks/use-portfolio-form.hook"
import type { PortfolioFormFieldKey } from "../hooks/use-portfolio-form.hook"
import type {
  PortfolioFormInputValues,
  PortfolioFormValues,
} from "../validations/portfolio-form.validations"

export interface PortfolioFormProps {
  formTitle?: string
  formDescription?: string
  initialValues?: Partial<PortfolioFormInputValues>
  onSubmit?: (values: PortfolioFormValues) => void
  submitButtonLabel?: string
  isSubmitting?: boolean
  className?: string
}

export function PortfolioForm({
  formTitle = "Nova Carteira",
  formDescription = "Preencha os dados da carteira.",
  initialValues,
  onSubmit,
  submitButtonLabel = "Salvar",
  isSubmitting = false,
  className,
}: PortfolioFormProps) {
  const { values, updateField, fieldErrors, handleSubmit } = usePortfolioForm({
    initialValues,
    onSubmit,
  })

  function handleFieldChange(
    field: PortfolioFormFieldKey,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    updateField(field, event.target.value)
  }

  return (
    <SharedFormWrapper
      id="portfolio-form"
      formTitle={formTitle}
      formDescription={formDescription}
      onSubmit={handleSubmit}
      className={className}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="portfolio-acronym">Sigla</FieldLabel>
          <FieldContent>
            <Input
              id="portfolio-acronym"
              name="acronym"
              type="text"
              maxLength={16}
              placeholder="IPCA"
              value={values.acronym}
              aria-invalid={Boolean(fieldErrors.acronym)}
              onChange={(event) => handleFieldChange("acronym", event)}
            />
            <FieldError
              errors={
                fieldErrors.acronym
                  ? [{ message: fieldErrors.acronym }]
                  : undefined
              }
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="portfolio-name">Nome</FieldLabel>
          <FieldContent>
            <Input
              id="portfolio-name"
              name="name"
              type="text"
              maxLength={120}
              placeholder="Carteira Renda Fixa"
              value={values.name}
              aria-invalid={Boolean(fieldErrors.name)}
              onChange={(event) => handleFieldChange("name", event)}
            />
            <FieldError
              errors={
                fieldErrors.name ? [{ message: fieldErrors.name }] : undefined
              }
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="portfolio-annual-interest-rate">
            Taxa Anual (%)
          </FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupInput
                id="portfolio-annual-interest-rate"
                name="annualInterestRate"
                type="text"
                inputMode="decimal"
                placeholder="3,75"
                value={values.annualInterestRate}
                aria-invalid={Boolean(fieldErrors.annualInterestRate)}
                onChange={(event) =>
                  handleFieldChange("annualInterestRate", event)
                }
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FieldError
              errors={
                fieldErrors.annualInterestRate
                  ? [{ message: fieldErrors.annualInterestRate }]
                  : undefined
              }
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="portfolio-min-allocation">
            Alocação Mínima (%)
          </FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupInput
                id="portfolio-min-allocation"
                name="minAllocation"
                type="text"
                inputMode="decimal"
                placeholder="20"
                value={values.minAllocation}
                aria-invalid={Boolean(fieldErrors.minAllocation)}
                onChange={(event) => handleFieldChange("minAllocation", event)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FieldError
              errors={
                fieldErrors.minAllocation
                  ? [{ message: fieldErrors.minAllocation }]
                  : undefined
              }
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="portfolio-target-allocation">
            Alocação Alvo (%)
          </FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupInput
                id="portfolio-target-allocation"
                name="targetAllocation"
                type="text"
                inputMode="decimal"
                placeholder="60"
                value={values.targetAllocation}
                aria-invalid={Boolean(fieldErrors.targetAllocation)}
                onChange={(event) =>
                  handleFieldChange("targetAllocation", event)
                }
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FieldError
              errors={
                fieldErrors.targetAllocation
                  ? [{ message: fieldErrors.targetAllocation }]
                  : undefined
              }
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="portfolio-max-allocation">
            Alocação Máxima (%)
          </FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupInput
                id="portfolio-max-allocation"
                name="maxAllocation"
                type="text"
                inputMode="decimal"
                placeholder="90"
                value={values.maxAllocation}
                aria-invalid={Boolean(fieldErrors.maxAllocation)}
                onChange={(event) => handleFieldChange("maxAllocation", event)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FieldError
              errors={
                fieldErrors.maxAllocation
                  ? [{ message: fieldErrors.maxAllocation }]
                  : undefined
              }
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="submit"
          disabled={isSubmitting}
          aria-label={isSubmitting ? "Salvando" : undefined}
        >
          {isSubmitting ? (
            <IconLoader className="animate-spin" aria-hidden="true" />
          ) : (
            submitButtonLabel
          )}
        </Button>
      </div>
    </SharedFormWrapper>
  )
}