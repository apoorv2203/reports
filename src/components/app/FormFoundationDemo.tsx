import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AppField, AppForm, AppInput, FieldGroup } from "./AppForm"
import type { SubmitHandler } from "react-hook-form"
import { useT } from "@/providers/I18nProvider"

type FormFoundationValues = { name: string }

const handleDemoSubmit: SubmitHandler<FormFoundationValues> = () => undefined

export function FormFoundationDemo() {
  const t = useT()
  const localizedSchema = z.object({
    name: z.string().trim().min(2, t("forms.foundation.error")),
  })

  return <AppForm<FormFoundationValues> resolver={zodResolver(localizedSchema)} defaultValues={{ name: "" }} onSubmit={handleDemoSubmit}>
    <FieldGroup>
      <AppField name="name" label={t("forms.foundation.name")} description={t("forms.foundation.description")} rules={{ required: true }}>
        {(field, invalid) => <AppInput {...field} id="name" aria-invalid={invalid} />}
      </AppField>
    </FieldGroup>
  </AppForm>
}
