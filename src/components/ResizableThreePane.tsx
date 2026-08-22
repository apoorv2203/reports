import { useState, type ReactNode } from 'react';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';

type Props = { left: ReactNode; center: ReactNode; right: ReactNode; leftLabel?: string; rightLabel?: string };

export function ResizableThreePane({ left, center, right, leftLabel = 'Left pane', rightLabel = 'Right pane' }: Props) {
  const [leftWidth, setLeftWidth] = useState(280);
  const [rightWidth, setRightWidth] = useState(220);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const resize = (side: 'left' | 'right', event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const move = (e: PointerEvent) => side === 'left'
      ? setLeftWidth(Math.min(380, Math.max(220, e.clientX)))
      : setRightWidth(Math.min(380, Math.max(180, window.innerWidth - e.clientX)));
    const stop = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop);
  };
  return <div className="flex min-h-0 flex-1 overflow-hidden">
    <section style={{ width: leftOpen ? leftWidth : 52 }} className="relative min-h-0 shrink-0 overflow-hidden transition-[width] duration-200">
      <button type="button" onClick={() => setLeftOpen((open) => !open)} aria-label={`${leftOpen ? 'Collapse' : 'Expand'} ${leftLabel}`} title={`${leftOpen ? 'Collapse' : 'Expand'} ${leftLabel}`} className="absolute right-3 top-4 z-10 flex size-8 items-center justify-center rounded-md border border-surface-200 bg-white text-ink-500 hover:bg-mint-50">{leftOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}</button>
      <div className={leftOpen ? 'h-full' : 'hidden'}>{left}</div>
    </section>
    <div role="separator" aria-label={`Resize ${leftLabel}`} onPointerDown={(e) => resize('left', e)} className="w-1 shrink-0 cursor-col-resize bg-transparent hover:bg-mint-200" />
    <section className="min-w-0 min-h-0 flex-1 overflow-hidden">{center}</section>
    <div role="separator" aria-label={`Resize ${rightLabel}`} onPointerDown={(e) => resize('right', e)} className="w-1 shrink-0 cursor-col-resize bg-transparent hover:bg-mint-200" />
    <section style={{ width: rightOpen ? rightWidth : 52 }} className="relative min-h-0 shrink-0 overflow-hidden transition-[width] duration-200">
      <button type="button" onClick={() => setRightOpen((open) => !open)} aria-label={`${rightOpen ? 'Collapse' : 'Expand'} ${rightLabel}`} title={`${rightOpen ? 'Collapse' : 'Expand'} ${rightLabel}`} className="absolute right-3 top-4 z-10 flex size-8 items-center justify-center rounded-md border border-surface-200 bg-white text-ink-500 hover:bg-mint-50">{rightOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}</button>
      <div className={rightOpen ? 'h-full' : 'hidden'}>{right}</div>
    </section>
  </div>;
}
