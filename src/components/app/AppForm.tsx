import * as React from "react"
import { FormProvider, useController, useForm, useFormContext, type FieldPath, type FieldValues, type UseControllerProps, type UseFormProps } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

export function AppForm<TFieldValues extends FieldValues>({ children, onSubmit, className, ...props }: UseFormProps<TFieldValues> & { children: React.ReactNode; onSubmit?: (values: TFieldValues) => void; className?: string }) {
  const methods = useForm<TFieldValues>(props)
  return <FormProvider {...methods}><form className={cn("flex flex-col gap-4", className)} onSubmit={methods.handleSubmit((values) => onSubmit?.(values))}>{children}</form></FormProvider>
}

export function AppField<T extends FieldValues, N extends FieldPath<T>>({ name, label, description, children, ...rules }: UseControllerProps<T, N> & { label?: string; description?: string; children: (field: ReturnType<typeof useController<T, N>>["field"], invalid: boolean) => React.ReactNode }) {
  const { control } = useFormContext<T>()
  const { field, fieldState } = useController({ name, control, ...rules })
  const id = String(name).replace(/\./g, "-")
  return <Field data-invalid={fieldState.invalid}><FieldLabel htmlFor={id}>{label}</FieldLabel>{children(field, fieldState.invalid)}{description && <FieldDescription>{description}</FieldDescription>}<FieldError>{fieldState.error?.message}</FieldError></Field>
}

export const AppInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>((props, ref) => <Input ref={ref} {...props} />)
AppInput.displayName = "AppInput"
export const AppTextarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<typeof Textarea>>((props, ref) => <Textarea ref={ref} {...props} />)
AppTextarea.displayName = "AppTextarea"

export function AppSelect({ options, placeholder, ...props }: { options: { value: string; label: string }[]; placeholder?: string } & React.ComponentProps<typeof Select>) {
  return <Select {...props}><SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>
}

export const AppCheckbox = Checkbox
export const AppRadio = RadioGroupItem
export const AppSwitch = Switch
export { FieldGroup, FieldDescription, FieldError, FieldLabel }
