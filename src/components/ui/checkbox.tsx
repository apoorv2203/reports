import * as React from "react"
import { cn } from "@/lib/utils"
export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type = "checkbox", ...props }, ref) => <input ref={ref} type={type} data-slot="checkbox" className={cn("size-4 rounded border border-input accent-primary focus-visible:ring-3 focus-visible:ring-ring/50", className)} {...props} />)
Checkbox.displayName = "Checkbox"
