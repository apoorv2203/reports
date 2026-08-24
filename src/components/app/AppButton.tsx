import * as React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
type AppButtonProps = Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon' | 'compact';
};

type PrimitiveButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
type PrimitiveButtonSize = 'default' | 'sm' | 'icon';

const variants: Record<NonNullable<AppButtonProps['variant']>, { variant: PrimitiveButtonVariant; size: PrimitiveButtonSize; className?: string }> = {
  primary: { variant: 'default', size: 'default', className: 'bg-mint-600 text-white hover:bg-mint-700' },
  secondary: { variant: 'outline', size: 'default', className: 'border-surface-200 text-navy-900 hover:bg-surface-50' },
  ghost: { variant: 'ghost', size: 'default', className: 'text-navy-900 hover:text-mint-700' },
  danger: { variant: 'destructive', size: 'default' },
  icon: { variant: 'ghost', size: 'icon' },
  compact: { variant: 'default', size: 'sm', className: 'bg-mint-600 text-white hover:bg-mint-700' },
};

export function AppButton({ variant = 'primary', className, ...props }: AppButtonProps) {
  const mapped = variants[variant];
  return <Button {...props} variant={mapped.variant} size={mapped.size} className={cn(mapped.className, className)} />;
}
