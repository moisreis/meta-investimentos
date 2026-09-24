import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
  FieldDescription,
} from "@/presentation/ui/field"

interface SharedFormFieldProps {
  label: string
  description?: string
  error?: string
  children: React.ReactNode
  htmlFor?: string
}

export function SharedFormField({
  label,
  description,
  error,
  children,
  htmlFor,
}: SharedFormFieldProps) {
  return (
    <Field data-invalid={error ? "true" : undefined}>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      <FieldContent>
        {children}
        {description && (
          <FieldDescription>{description}</FieldDescription>
        )}
        <FieldError>{error}</FieldError>
      </FieldContent>
    </Field>
  )
}
