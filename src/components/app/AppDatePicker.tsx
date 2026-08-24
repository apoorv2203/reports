import * as React from "react"
import { AppInput } from "./AppForm"

export const AppDatePicker = React.forwardRef<HTMLInputElement, Omit<React.ComponentProps<typeof AppInput>, "type">>((props, ref) => <AppInput ref={ref} type="date" {...props} />)
AppDatePicker.displayName = "AppDatePicker"
