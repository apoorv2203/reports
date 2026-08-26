import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type PopupTone = 'default' | 'danger';

export type GlobalPopupConfig = {
  id?: string;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  tone?: PopupTone;
  closeOnConfirm?: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
};

type GlobalPopupContextValue = {
  popup: GlobalPopupConfig | null;
  openPopup: (config: GlobalPopupConfig) => void;
  closePopup: () => void;
};

const GlobalPopupContext = createContext<GlobalPopupContextValue | null>(null);

export function GlobalPopupProvider({ children }: { children: ReactNode }) {
  const [popup, setPopup] = useState<GlobalPopupConfig | null>(null);
  const [busy, setBusy] = useState(false);

  const openPopup = useCallback((config: GlobalPopupConfig) => {
    setPopup(config);
  }, []);

  const closePopup = useCallback(() => {
    if (busy) return;
    setPopup(null);
  }, [busy]);

  const onConfirm = useCallback(async () => {
    if (!popup || busy) return;
    setBusy(true);
    try {
      await popup.onConfirm?.();
      if (popup.closeOnConfirm ?? true) {
        setPopup(null);
      }
    } finally {
      setBusy(false);
    }
  }, [popup, busy]);

  const onCancel = useCallback(() => {
    if (!popup || busy) return;
    popup.onCancel?.();
    setPopup(null);
  }, [popup, busy]);

  const value = useMemo<GlobalPopupContextValue>(() => ({ popup, openPopup, closePopup }), [popup, openPopup, closePopup]);

  return (
    <GlobalPopupContext.Provider value={value}>
      {children}
      {popup && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-floaty">
            <h3 className="text-base font-bold text-navy-900">{popup.title}</h3>
            <p className="mt-2 text-sm text-ink-600">{popup.message}</p>
            <div className="mt-4 flex justify-end gap-2">
              {popup.cancelText && (
                <button
                  type="button"
                  className="rounded-lg border border-surface-200 px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-surface-50 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={onCancel}
                  disabled={busy}
                >
                  {popup.cancelText}
                </button>
              )}
              <button
                type="button"
                className={popup.tone === 'danger'
                  ? 'rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
                  : 'rounded-lg bg-navy-900 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-60'}
                onClick={() => { void onConfirm(); }}
                disabled={busy}
              >
                {busy ? 'Please wait...' : popup.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </GlobalPopupContext.Provider>
  );
}

export function useGlobalPopup(): GlobalPopupContextValue {
  const context = useContext(GlobalPopupContext);
  if (!context) throw new Error('useGlobalPopup must be used within GlobalPopupProvider');
  return context;
}
