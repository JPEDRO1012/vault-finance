"use client";

import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function Modal({
  isOpen,
  title,
  description,
  children,
  onClose,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#10131F] p-6 shadow-2xl shadow-black/50">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>

            {description && (
              <p className="mt-1 text-sm text-zinc-400">
                {description}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-white/5 p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}