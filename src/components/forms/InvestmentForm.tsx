"use client";

import { useEffect, useState } from "react";

export type InvestmentFormData = {
  name: string;
  type: string;
  amount: string;
  profitability: string;
  monthlyReturn: string;
  risk: "Baixo" | "Médio" | "Alto";
  date: string;
};

type InvestmentFormProps = {
  initialData?: InvestmentFormData;
  onSubmit: (data: InvestmentFormData) => void | Promise<void>;
  onCancel: () => void;
};

const defaultFormData: InvestmentFormData = {
  name: "",
  type: "CDB",
  amount: "",
  profitability: "",
  monthlyReturn: "",
  risk: "Baixo",
  date: new Date().toISOString().split("T")[0],
};

export function InvestmentForm({
  initialData,
  onSubmit,
  onCancel,
}: InvestmentFormProps) {
  const [formData, setFormData] = useState<InvestmentFormData>(
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
          Nome do investimento
        </label>

        <input
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
          placeholder="Ex: CDB Banco Premium"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Tipo de ativo
          </label>

          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value,
              })
            }
            className="w-full rounded-2xl border border-white/10 bg-[#151827] px-4 py-3 outline-none focus:border-violet-500"
          >
            <option value="CDB">CDB</option>
            <option value="Tesouro Direto">Tesouro Direto</option>
            <option value="Ações">Ações</option>
            <option value="Fundos Imobiliários">Fundos Imobiliários</option>
            <option value="ETFs">ETFs</option>
            <option value="Criptomoedas">Criptomoedas</option>
            <option value="Poupança">Poupança</option>
            <option value="Fundos de investimento">
              Fundos de investimento
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Risco</label>

          <select
            value={formData.risk}
            onChange={(e) =>
              setFormData({
                ...formData,
                risk: e.target.value as "Baixo" | "Médio" | "Alto",
              })
            }
            className="w-full rounded-2xl border border-white/10 bg-[#151827] px-4 py-3 outline-none focus:border-violet-500"
          >
            <option value="Baixo">Baixo</option>
            <option value="Médio">Médio</option>
            <option value="Alto">Alto</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Valor aplicado
          </label>

          <input
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value,
              })
            }
            type="number"
            placeholder="0,00"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Rentabilidade %
          </label>

          <input
            value={formData.profitability}
            onChange={(e) =>
              setFormData({
                ...formData,
                profitability: e.target.value,
              })
            }
            type="number"
            step="0.01"
            placeholder="1.20"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Rendimento mensal
          </label>

          <input
            value={formData.monthlyReturn}
            onChange={(e) =>
              setFormData({
                ...formData,
                monthlyReturn: e.target.value,
              })
            }
            type="number"
            placeholder="0,00"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Data da aplicação
        </label>

        <input
          value={formData.date}
          onChange={(e) =>
            setFormData({
              ...formData,
              date: e.target.value,
            })
          }
          type="date"
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
          Salvar investimento
        </button>
      </div>
    </form>
  );
}