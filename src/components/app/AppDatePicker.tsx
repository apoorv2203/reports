"use client"

import * as React from "react"
import { CalendarDays } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AppDatePickerProps = Omit<React.ComponentProps<"input">, "type" | "value" | "defaultValue" | "onChange"> & {
  value?: string
  defaultValue?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

export const AppDatePicker = React.forwardRef<HTMLInputElement, AppDatePickerProps>(
  ({ value, defaultValue, onChange, placeholder, name, id, disabled, className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
    const selectedValue = value ?? internalValue
    const selectedDate = selectedValue ? new Date(`${selectedValue}T00:00:00`) : undefined
    const label = selectedDate && !Number.isNaN(selectedDate.getTime())
      ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(selectedDate)
      : placeholder

    const handleSelect = (date: Date | undefined) => {
      if (!date) return
      const nextValue = date.toISOString().slice(0, 10)
      if (value === undefined) setInternalValue(nextValue)
      const event = { target: { name, id, value: nextValue } } as React.ChangeEvent<HTMLInputElement>
      onChange?.(event)
      setOpen(false)
    }

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <input {...props} ref={ref} id={id} name={name} type="hidden" value={selectedValue} readOnly />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger render={<Button type="button" variant="outline" disabled={disabled} aria-haspopup="dialog" />}>
            <CalendarDays data-icon="inline-start" />
            {label}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} />
          </PopoverContent>
        </Popover>
      </div>
    )
  },
)

AppDatePicker.displayName = "AppDatePicker"
