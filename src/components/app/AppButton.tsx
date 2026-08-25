import * as React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
type AppButtonProps = Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'> & {
  variant?: 'primary' | 'secondary' | 'success-outline' | 'ghost' | 'danger' | 'icon' | 'compact';
  active?: boolean;
  size?: 'default' | 'sm' | 'icon' | 'icon-sm' | 'link-sm' | 'link-xs' |   'action-sm' | 'action-md' | 'icon-lg' | 'retry' | 'menu' | 'widget' | 'list-row' | 'filter' | 'pill' | 'tab' | 'toggle' | 'card-action' | 'menu-item' | 'pagination' | 'run-icon' | 'report-action' | 'widget-home';
};

type PrimitiveButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
type PrimitiveButtonSize = 'default' | 'sm' | 'icon';

const variants: Record<NonNullable<AppButtonProps['variant']>, { variant: PrimitiveButtonVariant; size: PrimitiveButtonSize; className?: string }> = {
  primary: { variant: 'default', size: 'default', className: 'bg-primary text-primary-foreground hover:bg-primary/80' },
  secondary: { variant: 'outline', size: 'default', className: 'border-border text-foreground hover:bg-muted' },
  'success-outline': { variant: 'outline', size: 'default', className: 'border-border bg-success-bg text-success hover:bg-success-light' },
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
  menu: { size: 'default', className: 'h-auto w-full justify-start gap-2 px-2.5 py-2 text-left text-[11px] font-semibold' },
  widget: { size: 'default', className: 'mt-3 h-auto w-full gap-1.5 py-1.5 text-[10px] font-bold' },
  'list-row': { size: 'default', className: 'h-auto w-full justify-start gap-2.5 py-2.5 text-left' },
  filter: { size: 'default', className: 'px-4 py-2.5 text-[12px] font-bold' },
  pill: { size: 'default', className: 'h-auto rounded-full px-4 py-2.5 text-[12px] font-semibold text-foreground' },
  tab: { size: 'default', className: 'h-auto rounded-none border-0 border-b-2 border-transparent bg-transparent px-1 pb-3 text-[12px] font-bold shadow-none transition focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2' },
  toggle: { size: 'icon', className: 'size-8 rounded-md' },
  'card-action': { size: 'default', className: 'flex-1 py-2 text-[10px] font-bold' },
  'widget-home': { size: 'default', className: 'flex-1 py-2 text-[10px] font-bold' },
  'menu-item': { size: 'default', className: 'h-auto w-full justify-start gap-2 px-3 py-2 text-left text-[11px] font-semibold text-foreground' },
  pagination: { size: 'icon', className: 'size-9 rounded-lg border border-border font-semibold' },
  'run-icon': { size: 'icon', className: 'size-8 text-foreground hover:text-primary' },
  'report-action': { size: 'default', className: 'flex-1 gap-2 py-1.5 text-[11px] font-bold' },
};

export function AppButton({ variant = 'primary', size, active = false, className, ...props }: AppButtonProps) {
  const mapped = variants[variant];
  const resolvedSize = sizes[size ?? (variant === 'icon' ? 'icon' : 'default')];
  return <Button {...props} variant={mapped.variant} size={resolvedSize.size} className={cn(mapped.className, resolvedSize.className, size === 'tab' && (active ? 'border-b-2 border-primary text-primary' : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'), size === 'pill' && (active ? 'border-navy-900 bg-navy-900 text-white' : 'border-border-light bg-background text-muted-foreground hover:border-foreground hover:text-foreground'), size === 'toggle' && active && 'border-mint-300 bg-mint-50 text-mint-700', size === 'pagination' && active && 'border-mint-400 bg-mint-50 text-mint-700', className)} />;
}
