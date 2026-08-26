import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
type AppButtonProps = Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link' | 'success' | 'success-outline' | 'icon' | 'compact';
  active?: boolean;
  size?: 'default' | 'sm' | 'icon' | 'icon-sm' | 'link-sm' | 'link-xs' |   'action-sm' | 'action-md' | 'icon-lg' | 'retry' | 'menu' | 'widget' | 'list-row' | 'filter' | 'pill' | 'tab' | 'toggle' | 'card-action' | 'menu-item' | 'pagination' | 'run-icon' | 'report-action' | 'widget-home' | 'widget-icon' | 'modal-icon' | 'menu-danger' | 'report-full' | 'template-card' | 'section-icon' | 'report-back' | 'report-export' | 'report-designer' | 'report-publish' | 'report-header' | 'suggestion';
};

type PrimitiveButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
type AppSemanticVariant = PrimitiveButtonVariant | 'icon';
type PrimitiveButtonSize = 'default' | 'sm' | 'icon' | 'icon-sm';
type AppButtonStyle = { variant?: AppSemanticVariant; size: PrimitiveButtonSize; className?: string };

const variants: Record<NonNullable<AppButtonProps['variant']>, { variant: PrimitiveButtonVariant; size: PrimitiveButtonSize; className?: string }> = {
  primary: { variant: 'default', size: 'default' },
  secondary: { variant: 'secondary', size: 'default' },
  outline: { variant: 'outline', size: 'default' },
  ghost: { variant: 'ghost', size: 'default' },
  danger: { variant: 'destructive', size: 'default' },
  link: { variant: 'link', size: 'default' },
  success: { variant: 'default', size: 'default', className: 'bg-success text-success-foreground hover:bg-success/90' },
  'success-outline': { variant: 'outline', size: 'default', className: 'border-border bg-success-bg text-success hover:bg-success-light' },
  icon: { variant: 'ghost', size: 'icon' },
  compact: { variant: 'default', size: 'sm' },
};

const sizes: Record<NonNullable<AppButtonProps['size']>, AppButtonStyle> = {
  default: { size: 'default' },
  sm: { size: 'sm' },
  icon: { size: 'icon' },
  'icon-sm': { size: 'icon', className: 'size-8 rounded-lg text-foreground' },
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
  'widget-icon': { variant: 'icon', size: 'default', className: 'size-8 border border-surface-200' },
  'modal-icon': { variant: 'icon', size: 'default', className: 'size-9 text-muted-foreground' },
  'menu-danger': { variant: 'destructive', size: 'default', className: 'h-auto w-full justify-start gap-2 px-3 py-2 text-left text-[11px] font-semibold' },
  'report-full': { size: 'default', className: 'mt-4 w-full' },
  'template-card': { variant: 'ghost', size: 'default', className: 'group flex h-auto min-w-0 w-full flex-col items-stretch overflow-hidden p-0 text-left' },
  'section-icon': { variant: 'icon', size: 'icon-sm', className: 'text-ink-300 hover:text-ink-900' },
  'report-back': { variant: 'ghost', size: 'icon', className: 'mr-1 size-7 text-muted-foreground hover:bg-muted' },
  'report-export': { size: 'default', className: 'flex h-auto w-full items-center justify-start gap-2 px-3 py-3 text-left text-[11px] font-semibold rounded-lg bg-white border border-[var(--color-success-medium)] text-[var(--color-success-medium)] hover:bg-[var(--color-success-bg)] hover:border-[var(--color-success-medium)] hover:text-[var(--color-success-medium)] transition-colors duration-150' },
  'report-designer': { size: 'default', className: 'mt-3 w-full bg-primary text-primary-foreground hover:bg-primary/90' },
  // Use the semantic dark button token for report publishing (centralized)
  'report-publish': { size: 'default', className: 'w-full bg-[var(--color-button-dark)] text-white hover:brightness-95' },
  'report-header': { size: 'default', className: 'bg-primary text-primary-foreground hover:bg-primary/90' },
  'menu-item': { size: 'default', className: 'h-auto w-full justify-start gap-2 px-3 py-2 text-left text-[11px] font-semibold text-foreground' },
  pagination: { size: 'icon', className: 'size-9 rounded-lg border border-border font-semibold' },
  'run-icon': { size: 'icon', className: 'size-8 text-foreground hover:text-primary' },
  'report-action': { size: 'default', className: 'flex-1 gap-2 py-1.5 text-[11px] font-bold' },
  // Suggestion buttons used in the report left pane (full-width, light surface)
  suggestion: { size: 'default', className: 'h-auto w-full justify-start gap-2 px-3 py-2 text-left text-[12px] font-medium rounded-lg bg-white border border-border shadow-none transition-colors duration-150 hover:bg-[var(--color-success-bg)] hover:border-[var(--color-success-medium)] hover:text-navy-900' },
};

export function AppButton({ variant = 'primary', size, active = false, className, ...props }: AppButtonProps) {
  const mapped = variants[variant];
  const resolvedSize = sizes[size ?? (variant === 'icon' ? 'icon' : 'default')];
  const resolvedVariant = resolvedSize.variant === 'icon' ? 'ghost' : resolvedSize.variant ?? mapped.variant;
  return <Button {...props} variant={resolvedVariant} size={resolvedSize.size} className={cn(mapped.className, resolvedSize.className, size === 'tab' && (active ? 'border-b-2 border-primary text-primary' : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'), size === 'pill' && (active ? 'border-navy-900 bg-navy-900 text-white' : 'border-border-light bg-background text-muted-foreground hover:border-foreground hover:text-foreground'), size === 'toggle' && active && 'border-mint-300 bg-mint-50 text-mint-700', size === 'pagination' && active && 'border-mint-400 bg-mint-50 text-mint-700', className)} />;
}
