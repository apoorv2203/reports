import * as React from "react"
import { cn } from "@/lib/utils"
export const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type = "checkbox", ...props }, ref) => <input ref={ref} type={type} role="switch" data-slot="switch" className={cn("size-4 accent-primary focus-visible:ring-3 focus-visible:ring-ring/50", className)} {...props} />)
Switch.displayName = "Switch"
