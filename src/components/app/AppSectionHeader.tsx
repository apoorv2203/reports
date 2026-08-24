import type { ReactNode } from "react";

export function AppSectionHeader({ title, action }: { title: ReactNode; action?: ReactNode }) {
  return <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-[17px] font-bold tracking-[-0.03em] text-foreground">{title}</h2>{action}</div>;
}
