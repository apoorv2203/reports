import { toast } from "sonner"

export const AppToast = {
  success: (message: string, description?: string) => toast.success(message, { description }),
  error: (message: string, description?: string) => toast.error(message, { description }),
  info: (message: string, description?: string) => toast.info(message, { description }),
  warning: (message: string, description?: string) => toast.warning(message, { description }),
  dismiss: (toastId?: string | number) => toast.dismiss(toastId),
}

export { Toaster as AppToaster } from "@/components/ui/sonner"
