import * as React from "react"
import { cn } from "@/lib/utils"
export const RadioGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} role="radiogroup" data-slot="radio-group" className={cn("flex flex-col gap-2", className)} {...props} />)
RadioGroup.displayName = "RadioGroup"
export const RadioGroupItem = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => <input ref={ref} type="radio" data-slot="radio-group-item" className={cn("size-4 accent-primary focus-visible:ring-3 focus-visible:ring-ring/50", className)} {...props} />)
RadioGroupItem.displayName = "RadioGroupItem"
