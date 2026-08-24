import * as React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
type AppButtonProps = Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon' | 'compact';
};

type PrimitiveButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
type PrimitiveButtonSize = 'default' | 'sm' | 'icon';

const variants: Record<NonNullable<AppButtonProps['variant']>, { variant: PrimitiveButtonVariant; size: PrimitiveButtonSize; className?: string }> = {
  primary: { variant: 'default', size: 'default' },
  secondary: { variant: 'outline', size: 'default' },
  ghost: { variant: 'ghost', size: 'default' },
  danger: { variant: 'destructive', size: 'default' },
  icon: { variant: 'ghost', size: 'icon' },
  compact: { variant: 'default', size: 'sm' },
};

export function AppButton({ variant = 'primary', className, ...props }: AppButtonProps) {
  const mapped = variants[variant];
  return <Button {...props} variant={mapped.variant} size={mapped.size} className={cn(mapped.className, className)} />;
}
