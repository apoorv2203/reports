import * as React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
type AppButtonProps = Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon' | 'compact';
  size?: 'default' | 'sm' | 'icon' | 'icon-sm' | 'link-sm' | 'link-xs' | 'action-sm';
};

type PrimitiveButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
type PrimitiveButtonSize = 'default' | 'sm' | 'icon';

const variants: Record<NonNullable<AppButtonProps['variant']>, { variant: PrimitiveButtonVariant; size: PrimitiveButtonSize; className?: string }> = {
  primary: { variant: 'default', size: 'default', className: 'bg-primary text-primary-foreground hover:bg-primary/80' },
  secondary: { variant: 'outline', size: 'default', className: 'border-border text-foreground hover:bg-muted' },
  ghost: { variant: 'ghost', size: 'default', className: 'text-foreground hover:text-primary' },
  danger: { variant: 'destructive', size: 'default' },
  icon: { variant: 'ghost', size: 'icon' },
  compact: { variant: 'default', size: 'sm', className: 'bg-primary text-primary-foreground hover:bg-primary/80' },
};

const sizes: Record<NonNullable<AppButtonProps['size']>, { size: PrimitiveButtonSize; className?: string }> = {
  default: { size: 'default' },
  sm: { size: 'sm' },
  icon: { size: 'icon' },
  'icon-sm': { size: 'icon', className: 'size-8 rounded-lg' },
  'link-sm': { size: 'default', className: 'h-auto px-0 text-[11px] font-bold text-primary' },
  'link-xs': { size: 'default', className: 'h-auto px-0 text-[10px] font-bold text-primary' },
  'action-sm': { size: 'default', className: 'px-3 py-2 text-[11px] font-bold text-primary' },
  'action-md': { size: 'default', className: 'px-4 py-2.5 text-[12px] font-bold' },
  'icon-lg': { size: 'icon', className: 'size-9 text-muted-foreground' },
  retry: { size: 'default', className: 'h-auto p-0 font-bold text-primary' },
};

export function AppButton({ variant = 'primary', size, className, ...props }: AppButtonProps) {
  const mapped = variants[variant];
  const resolvedSize = sizes[size ?? (variant === 'icon' ? 'icon' : 'default')];
  return <Button {...props} variant={mapped.variant} size={resolvedSize.size} className={cn(mapped.className, resolvedSize.className, className)} />;
}
