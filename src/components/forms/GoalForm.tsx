"use client";

import { useEffect, useState } from "react";

export type GoalFormData = {
  title: string;
  target: string;
  current: string;
  deadline: string;
};

type GoalFormProps = {
  initialData?: GoalFormData;
  onSubmit: (data: GoalFormData) => void | Promise<void>;
  onCancel: () => void;
};

const defaultFormData: GoalFormData = {
  title: "",
  target: "",
  current: "",
  deadline: "",
};

export function GoalForm({ initialData, onSubmit, onCancel }: GoalFormProps) {
  const [formData, setFormData] = useState<GoalFormData>(
    initialData || defaultFormData
  );

  useEffect(() => {
    setFormData(initialData || defaultFormData);
  }, [initialData]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Nome da meta
        </label>

        <input
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value,
            })
          }
          placeholder="Ex: Reserva de emergência"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Valor alvo
          </label>

          <input
            type="number"
            value={formData.target}
            onChange={(e) =>
              setFormData({
                ...formData,
                target: e.target.value,
              })
            }
            placeholder="10000"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Valor atual
          </label>

          <input
            type="number"
            value={formData.current}
            onChange={(e) =>
              setFormData({
                ...formData,
                current: e.target.value,
              })
            }
            placeholder="2500"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Prazo
        </label>

        <input
          value={formData.deadline}
          onChange={(e) =>
            setFormData({
              ...formData,
              deadline: e.target.value,
            })
          }
          placeholder="Dezembro 2026"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-500"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-zinc-300 transition hover:bg-white/5"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-medium transition hover:bg-violet-600"
        >
          Salvar meta
        </button>
      </div>
    </form>
  );
}