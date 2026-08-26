import { useState, type ReactNode } from 'react';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useT } from '@/providers/I18nProvider';

type Props = { left: ReactNode; center: ReactNode; right: ReactNode; leftLabel?: string; rightLabel?: string };

export function ResizableThreePane({ left, center, right, leftLabel, rightLabel }: Props) {
  const [leftWidth, setLeftWidth] = useState(400);
  const [rightWidth, setRightWidth] = useState(220);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const t = useT();
  const leftLabelText = leftLabel ?? t('pane.leftPane');
  const rightLabelText = rightLabel ?? t('pane.rightPane');
  const resize = (side: 'left' | 'right', event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const move = (e: PointerEvent) => side === 'left'
      ? setLeftWidth(Math.min(520, Math.max(320, e.clientX)))
      : setRightWidth(Math.min(380, Math.max(180, window.innerWidth - e.clientX)));
    const stop = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop);
  };
  return <div className="flex min-h-0 flex-1 overflow-hidden">
    <section style={{ width: leftOpen ? leftWidth : 52 }} className="relative h-full min-h-0 shrink-0 overflow-hidden transition-[width] duration-200">
      <button type="button" onClick={() => setLeftOpen((open) => !open)} aria-label={leftOpen ? t('pane.collapse', { name: leftLabelText }) : t('pane.expand', { name: leftLabelText })} title={leftOpen ? t('pane.collapse', { name: leftLabelText }) : t('pane.expand', { name: leftLabelText })} className="absolute end-3 top-4 z-10 flex size-8 items-center justify-center rounded-md border border-surface-200 bg-white text-ink-500 hover:bg-mint-50">{leftOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}</button>
      <div className={leftOpen ? 'h-full' : 'hidden'}>{left}</div>
    </section>
    <div role="separator" aria-label={t('pane.resize', { name: leftLabelText })} onPointerDown={(e) => resize('left', e)} className="w-1 shrink-0 cursor-col-resize bg-transparent hover:bg-mint-200" />
    <section className="min-w-0 min-h-0 flex-1 overflow-hidden">{center}</section>
    <div role="separator" aria-label={t('pane.resize', { name: rightLabelText })} onPointerDown={(e) => resize('right', e)} className="w-1 shrink-0 cursor-col-resize bg-transparent hover:bg-mint-200" />
    <section style={{ width: rightOpen ? rightWidth : 52 }} className="relative h-full min-h-0 shrink-0 overflow-hidden transition-[width] duration-200">
      <button type="button" onClick={() => setRightOpen((open) => !open)} aria-label={rightOpen ? t('pane.collapse', { name: rightLabelText }) : t('pane.expand', { name: rightLabelText })} title={rightOpen ? t('pane.collapse', { name: rightLabelText }) : t('pane.expand', { name: rightLabelText })} className="absolute end-3 top-4 z-10 flex size-8 items-center justify-center rounded-md border border-surface-200 bg-white text-ink-500 hover:bg-mint-50">{rightOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}</button>
      <div className={rightOpen ? 'h-full' : 'hidden'}>{right}</div>
    </section>
  </div>;
}
