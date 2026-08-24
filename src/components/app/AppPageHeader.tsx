import type { ReactNode } from "react";

export function AppPageHeader({ title, description, action }: { title: ReactNode; description?: ReactNode; action?: ReactNode }) {
  return <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><h1 className="font-display text-[24px] font-bold tracking-[-0.04em] text-navy-900 sm:text-[27px]">{title}</h1>{description ? <p className="mt-1.5 text-[13px] text-ink-500">{description}</p> : null}</div>{action ? <div>{action}</div> : <div className="hidden" />}</div>;
}
