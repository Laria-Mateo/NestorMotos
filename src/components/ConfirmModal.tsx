import React from 'react';

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message: string;
  subtitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, title, message, subtitle, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
        <div className="px-6 pt-6">
          <div className="flex justify-center mb-3">
            <img src="/logoSinFondo3.webp" alt="Néstor Motos" className="h-10 w-auto" />
          </div>
          {title && <h3 className="text-xl font-extrabold text-gray-900 text-center">{title}</h3>}
          <p className="mt-2 text-sm text-gray-600 text-center">{message}</p>
          {subtitle && (
            <div className="mt-3 text-base font-extrabold text-gray-900 text-center">{subtitle}</div>
          )}
        </div>
        <div className="px-6 py-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-[#f75000] text-white font-bold hover:bg-[#ff7a33] transition shadow"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;


