import * as React from "react"
import { cn } from "@/lib/utils"

const Field = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} data-slot="field" className={cn("flex flex-col gap-2", className)} {...props} />
))
Field.displayName = "Field"

const FieldGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} data-slot="field-group" className={cn("flex flex-col gap-4", className)} {...props} />
))
FieldGroup.displayName = "FieldGroup"

const FieldLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label ref={ref} data-slot="field-label" className={cn("text-sm font-medium leading-none text-foreground", className)} {...props} />
))
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} data-slot="field-description" className={cn("text-sm leading-relaxed text-muted-foreground", className)} {...props} />
))
FieldDescription.displayName = "FieldDescription"

const FieldError = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, children, ...props }, ref) => children ? (
  <p ref={ref} role="alert" data-slot="field-error" className={cn("text-sm font-medium text-destructive", className)} {...props}>{children}</p>
) : null)
FieldError.displayName = "FieldError"

const FieldContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} data-slot="field-content" className={cn("flex min-w-0 flex-1 flex-col gap-1.5", className)} {...props} />
))
FieldContent.displayName = "FieldContent"

const FieldSet = React.forwardRef<HTMLFieldSetElement, React.FieldsetHTMLAttributes<HTMLFieldSetElement>>(({ className, ...props }, ref) => (
  <fieldset ref={ref} data-slot="field-set" className={cn("flex flex-col gap-4", className)} {...props} />
))
FieldSet.displayName = "FieldSet"

const FieldLegend = React.forwardRef<HTMLLegendElement, React.HTMLAttributes<HTMLLegendElement>>(({ className, ...props }, ref) => (
  <legend ref={ref} data-slot="field-legend" className={cn("text-sm font-semibold text-foreground", className)} {...props} />
))
FieldLegend.displayName = "FieldLegend"

export { Field, FieldGroup, FieldLabel, FieldDescription, FieldError, FieldContent, FieldSet, FieldLegend }
