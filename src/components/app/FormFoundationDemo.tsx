import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AppField, AppForm, AppInput, FieldGroup } from "./AppForm"
import type { SubmitHandler } from "react-hook-form"

export const formFoundationSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters."),
})

type FormFoundationValues = z.infer<typeof formFoundationSchema>
const handleDemoSubmit: SubmitHandler<FormFoundationValues> = () => undefined

export function FormFoundationDemo() {
  return <AppForm<FormFoundationValues> resolver={zodResolver(formFoundationSchema)} defaultValues={{ name: "" }} onSubmit={handleDemoSubmit}>
    <FieldGroup>
      <AppField name="name" label="Name" description="This isolated example demonstrates shared validation." rules={{ required: true }}>
        {(field, invalid) => <AppInput {...field} id="name" aria-invalid={invalid} />}
      </AppField>
    </FieldGroup>
  </AppForm>
}
