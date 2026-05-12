"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ExpensesDonutChart } from "@/components/charts/ExpensesDonutChart";
import { RevenueExpenseChart } from "@/components/charts/RevenueExpenseChart";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/PageLoader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useTransactions } from "@/hooks/useTransactions";
import { formatCurrency, formatDate } from "@/lib/formatters";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
};

type FormData = {
  title: string;
  amount: string;
  category: string;
  type: "income" | "expense";
  date: string;
};

export default function TransactionsPage() {
  const { transactions, loading, refetch } = useTransactions();

  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    amount: "",
    category: "Alimentação",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  const categories = Array.from(
    new Set(localTransactions.map((item) => item.category)),
  );

  const filteredTransactions = useMemo(() => {
    return localTransactions.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType = type === "all" || item.type === type;
      const matchesCategory = category === "all" || item.category === category;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [localTransactions, search, type, category]);

  if (loading) {
    return (
      <AppShell>
        <PageLoader />
      </AppShell>
    );
  }

  const totalRevenue = filteredTransactions
    .filter((item) => item.type === "income")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => acc + item.amount, 0);

  const balance = totalRevenue - totalExpenses;

  function openCreateModal() {
    setSelectedTransaction(null);

    setFormData({
      title: "",
      amount: "",
      category: "Alimentação",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    });

    setIsModalOpen(true);
  }

  function openEditModal(transaction: Transaction) {
    setSelectedTransaction(transaction);

    setFormData({
      title: transaction.title,
      amount: String(transaction.amount),
      category: transaction.category,
      type: transaction.type,
      date: new Date(transaction.date).toISOString().split("T")[0],
    });

    setIsModalOpen(true);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Deseja realmente excluir esta transação?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao excluir transação.");
        return;
      }

      toast.success("Transação removida com sucesso!");

      await refetch();
    } catch (error) {
      console.error(error);

      toast.error("Erro interno ao excluir transação.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.title || !formData.amount || !formData.date) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setSubmitting(true);

      const isEditing = Boolean(selectedTransaction);

      const response = await fetch(
        isEditing
          ? `/api/transactions/${selectedTransaction?.id}`
          : "/api/transactions",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            amount: Number(formData.amount),
            category: formData.category,
            type: formData.type,
            date: formData.date,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao salvar transação.");
        return;
      }

      toast.success(
        isEditing
          ? "Transação atualizada com sucesso!"
          : "Transação criada com sucesso!",
      );

      setIsModalOpen(false);
      setSelectedTransaction(null);

      setFormData({
        title: "",
        amount: "",
        category: "Alimentação",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });

      await refetch();
    } catch (error) {
      console.error(error);

      toast.error("Erro interno ao salvar transação.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <SectionHeader
        title="Transações"
        description="Controle suas receitas, despesas, categorias e histórico financeiro."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Receitas filtradas"
          value={totalRevenue}
          change={7.4}
        />

        <StatCard
          title="Despesas filtradas"
          value={totalExpenses}
          change={-3.1}
        />

        <StatCard title="Saldo do período" value={balance} change={5.8} />
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-[#10131F] p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar transação..."
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-violet-500"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-2xl border border-white/10 bg-[#151827] px-4 py-3 text-sm outline-none focus:border-violet-500"
          >
            <option value="all">Todos os tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-2xl border border-white/10 bg-[#151827] px-4 py-3 text-sm outline-none focus:border-violet-500"
          >
            <option value="all">Todas as categorias</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
          <SectionHeader title="Receitas vs despesas" />
          <RevenueExpenseChart
            data={Object.values(
              filteredTransactions.reduce(
                (acc, item) => {
                  const date = new Date(item.date);

                  const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

                  const monthLabel = date.toLocaleDateString("pt-BR", {
                    month: "short",
                  });

                  if (!acc[monthKey]) {
                    acc[monthKey] = {
                      month: monthLabel,
                      timestamp: new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        1,
                      ).getTime(),
                      revenue: 0,
                      expenses: 0,
                    };
                  }

                  if (item.type === "income") {
                    acc[monthKey].revenue += item.amount;
                  } else {
                    acc[monthKey].expenses += item.amount;
                  }

                  return acc;
                },
                {} as Record<
                  string,
                  {
                    month: string;
                    timestamp: number;
                    revenue: number;
                    expenses: number;
                  }
                >,
              ),
            ).sort((a, b) => a.timestamp - b.timestamp)}
          />
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
          <SectionHeader title="Gastos por categoria" />
          <RevenueExpenseChart
            data={Object.values(
              filteredTransactions.reduce(
                (acc, item) => {
                  const date = new Date(item.date);
                  const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

                  if (!acc[monthKey]) {
                    acc[monthKey] = {
                      month: date.toLocaleDateString("pt-BR", {
                        month: "short",
                      }),
                      timestamp: new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        1,
                      ).getTime(),
                      revenue: 0,
                      expenses: 0,
                    };
                  }

                  if (item.type === "income") {
                    acc[monthKey].revenue += item.amount;
                  } else {
                    acc[monthKey].expenses += item.amount;
                  }

                  return acc;
                },
                {} as Record<
                  string,
                  {
                    month: string;
                    timestamp: number;
                    revenue: number;
                    expenses: number;
                  }
                >,
              ),
            )
              .sort((a, b) => a.timestamp - b.timestamp)
              .map(({ timestamp, ...item }) => item)}
          />
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-[#10131F] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Histórico de transações</h3>

            <p className="text-sm text-zinc-400">
              {filteredTransactions.length} transações encontradas
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-medium transition hover:bg-violet-600"
          >
            Nova transação
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-white/10 text-sm text-zinc-400">
                <th className="pb-4">Descrição</th>
                <th className="pb-4">Categoria</th>
                <th className="pb-4">Tipo</th>
                <th className="pb-4">Data</th>
                <th className="pb-4 text-right">Valor</th>
                <th className="pb-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((item) => (
                <tr key={item.id} className="border-b border-white/5 text-sm">
                  <td className="py-4 font-medium">{item.title}</td>

                  <td className="py-4 text-zinc-400">{item.category}</td>

                  <td className="py-4">
                    <Badge
                      variant={item.type === "income" ? "success" : "danger"}
                    >
                      {item.type === "income" ? "Receita" : "Despesa"}
                    </Badge>
                  </td>

                  <td className="py-4 text-zinc-400">
                    {formatDate(item.date)}
                  </td>

                  <td
                    className={
                      item.type === "income"
                        ? "py-4 text-right font-semibold text-emerald-400"
                        : "py-4 text-right font-semibold text-red-400"
                    }
                  >
                    {item.type === "income" ? "+" : "-"}
                    {formatCurrency(item.amount)}
                  </td>

                  <td className="py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-300 transition hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300"
                      >
                        <Pencil size={14} />
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
        title={selectedTransaction ? "Editar transação" : "Nova transação"}
        description={
          selectedTransaction
            ? "Atualize os dados da transação selecionada."
            : "Cadastre uma nova receita ou despesa."
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Descrição
            </label>

            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
              placeholder="Ex: Mercado, salário, academia..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Valor</label>

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
              <label className="mb-2 block text-sm text-zinc-400">Data</label>

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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Tipo</label>

              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "income" | "expense",
                  })
                }
                className="w-full rounded-2xl border border-white/10 bg-[#151827] px-4 py-3 outline-none focus:border-violet-500"
              >
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Categoria
              </label>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-white/10 bg-[#151827] px-4 py-3 outline-none focus:border-violet-500"
              >
                <option value="Alimentação">Alimentação</option>
                <option value="Transporte">Transporte</option>
                <option value="Lazer">Lazer</option>
                <option value="Moradia">Moradia</option>
                <option value="Estudos">Estudos</option>
                <option value="Saúde">Saúde</option>
                <option value="Cartão">Cartão</option>
                <option value="Trabalho">Trabalho</option>
                <option value="Renda extra">Renda extra</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedTransaction(null);
              }}
              className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-zinc-300 transition hover:bg-white/5"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-medium transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Salvando..."
                : selectedTransaction
                  ? "Salvar alterações"
                  : "Salvar transação"}
            </button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
