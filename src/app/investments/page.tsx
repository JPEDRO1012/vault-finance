"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { InvestmentForm } from "@/components/forms/InvestmentForm";
import { InvestmentAreaChart } from "@/components/charts/InvestmentAreaChart";
import { PortfolioChart } from "@/components/charts/PortfolioChart";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/PageLoader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useInvestments } from "@/hooks/useInvestments";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formatters";

type Investment = {
  id: string;
  name: string;
  type: string;
  amount: number;
  profitability: number;
  monthlyReturn: number;
  risk: string;
  date: string;
};

type InvestmentFormData = {
  name: string;
  type: string;
  amount: string;
  profitability: string;
  monthlyReturn: string;
  risk: "Baixo" | "Médio" | "Alto";
  date: string;
};

export default function InvestmentsPage() {
  const { investments, loading, refetch } = useInvestments();

  const [localInvestments, setLocalInvestments] = useState<Investment[]>([]);
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);
  const [riskFilter, setRiskFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLocalInvestments(investments);
  }, [investments]);

  const filteredInvestments = useMemo(() => {
    if (riskFilter === "all") return localInvestments;

    return localInvestments.filter((item) => item.risk === riskFilter);
  }, [localInvestments, riskFilter]);

  if (loading) {
    return (
      <AppShell>
        <PageLoader />
      </AppShell>
    );
  }

  const totalInvested = filteredInvestments.reduce(
    (acc, item) => acc + item.amount,
    0,
  );

  const totalMonthlyReturn = filteredInvestments.reduce(
    (acc, item) => acc + item.monthlyReturn,
    0,
  );

  const averageProfitability =
    filteredInvestments.length > 0
      ? filteredInvestments.reduce((acc, item) => acc + item.profitability, 0) /
        filteredInvestments.length
      : 0;

  const bestInvestment = [...filteredInvestments].sort(
    (a, b) => b.profitability - a.profitability,
  )[0];

  function openCreateModal() {
    setSelectedInvestment(null);
    setIsModalOpen(true);
  }

  function openEditModal(investment: Investment) {
    setSelectedInvestment(investment);
    setIsModalOpen(true);
  }

  async function handleSubmitInvestment(data: InvestmentFormData) {
    if (
      !data.name ||
      !data.amount ||
      !data.profitability ||
      !data.monthlyReturn ||
      !data.date
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const isEditing = Boolean(selectedInvestment);

      const response = await fetch(
        isEditing
          ? `/api/investments/${selectedInvestment?.id}`
          : "/api/investments",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            type: data.type,
            amount: Number(data.amount),
            profitability: Number(data.profitability),
            monthlyReturn: Number(data.monthlyReturn),
            risk: data.risk,
            date: data.date,
          }),
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.message || "Erro ao salvar investimento.");
        return;
      }

      toast.success(
        isEditing
          ? "Investimento atualizado com sucesso!"
          : "Investimento adicionado com sucesso!",
      );

      setIsModalOpen(false);
      setSelectedInvestment(null);

      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Erro interno ao salvar investimento.");
    }
  }

  async function handleDeleteInvestment(id: string) {
    const confirmed = window.confirm(
      "Deseja realmente excluir este investimento?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/investments/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao excluir investimento.");
        return;
      }

      toast.success("Investimento removido com sucesso!");

      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Erro interno ao excluir investimento.");
    }
  }

  return (
    <AppShell>
      <SectionHeader
        title="Investimentos"
        description="Gerencie ativos, acompanhe rentabilidade e visualize sua carteira."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total investido" value={totalInvested} change={8.4} />

        <StatCard
          title="Rendimento mensal"
          value={totalMonthlyReturn}
          change={4.1}
        />

        <StatCard
          title="Rentabilidade média"
          value={averageProfitability}
          type="percent"
          change={1.7}
        />

        <StatCard
          title="Melhor ativo"
          value={bestInvestment?.profitability || 0}
          type="percent"
          change={2.4}
        />
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-[#10131F] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Filtro de investimentos</h3>

            <p className="text-sm text-zinc-400">
              Filtre investimentos por nível de risco.
            </p>
          </div>

          <select
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value)}
            className="rounded-2xl border border-white/10 bg-[#151827] px-4 py-3 text-sm outline-none focus:border-violet-500"
          >
            <option value="all">Todos</option>
            <option value="Baixo">Baixo risco</option>
            <option value="Médio">Médio risco</option>
            <option value="Alto">Alto risco</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
          <SectionHeader title="Evolução dos investimentos" />
          <InvestmentAreaChart
            data={Object.values(
              localInvestments.reduce(
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
                      invested: 0,
                    };
                  }

                  acc[monthKey].invested += item.amount;

                  return acc;
                },
                {} as Record<
                  string,
                  { month: string; timestamp: number; invested: number }
                >,
              ),
            )
              .sort((a, b) => a.timestamp - b.timestamp)
              .map(({ timestamp, ...item }) => item)}
          />
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
          <SectionHeader title="Distribuição da carteira" />
          <PortfolioChart
            data={Object.values(
              localInvestments.reduce(
                (acc, item) => {
                  if (!acc[item.type]) {
                    acc[item.type] = {
                      name: item.type,
                      value: 0,
                    };
                  }

                  acc[item.type].value += item.amount;

                  return acc;
                },
                {} as Record<string, { name: string; value: number }>,
              ),
            )}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
          <p className="text-sm text-zinc-400">Ativo com maior crescimento</p>

          <h3 className="mt-3 text-2xl font-semibold">
            {bestInvestment?.name || "Nenhum ativo"}
          </h3>

          <p className="mt-2 text-sm text-emerald-400">
            {bestInvestment
              ? formatPercent(bestInvestment.profitability)
              : "0%"}{" "}
            no último mês
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
          <p className="text-sm text-zinc-400">Perfil da carteira</p>

          <h3 className="mt-3 text-2xl font-semibold">Moderado</h3>

          <p className="mt-2 text-sm text-violet-300">
            Boa diversificação entre renda fixa e variável
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
          <p className="text-sm text-zinc-400">Rendimento mensal estimado</p>

          <h3 className="mt-3 text-2xl font-semibold">
            {formatCurrency(totalMonthlyReturn)}
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            Soma estimada dos rendimentos cadastrados
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-[#10131F] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Carteira de investimentos</h3>

            <p className="text-sm text-zinc-400">
              {filteredInvestments.length} ativos encontrados
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-medium transition hover:bg-violet-600"
          >
            Novo investimento
          </button>
        </div>

        <div className="space-y-4">
          {filteredInvestments.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-violet-500/40"
            >
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold">{item.name}</h3>

                    <Badge
                      variant={
                        item.risk === "Baixo"
                          ? "success"
                          : item.risk === "Médio"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {item.risk} risco
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm text-zinc-400">
                    {item.type} • aplicado em {formatDate(item.date)}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                      Valor aplicado
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {formatCurrency(item.amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                      Rentabilidade
                    </p>

                    <p className="mt-1 text-lg font-semibold text-emerald-400">
                      {formatPercent(item.profitability)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                      Rendimento mensal
                    </p>

                    <p className="mt-1 text-lg font-semibold text-violet-300">
                      {formatCurrency(item.monthlyReturn)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-300 transition hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300"
                  >
                    <Pencil size={14} />
                    Editar
                  </button>

                  <button
                    onClick={() => handleDeleteInvestment(item.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredInvestments.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-sm text-zinc-400">
                Nenhum investimento cadastrado ainda.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-violet-500/30 bg-violet-500/10 p-6">
        <h3 className="text-lg font-semibold">Simulador de rendimento</h3>

        <p className="mt-2 max-w-3xl text-sm text-zinc-300">
          Se você investir R$ 1.000 por mês durante 5 anos com uma rentabilidade
          média de 1,2% ao mês, poderá acumular aproximadamente R$ 81.000.
        </p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedInvestment(null);
        }}
        title={selectedInvestment ? "Editar investimento" : "Novo investimento"}
        description={
          selectedInvestment
            ? "Atualize os dados do investimento selecionado."
            : "Cadastre um novo ativo na sua carteira."
        }
      >
        <InvestmentForm
          initialData={
            selectedInvestment
              ? {
                  name: selectedInvestment.name,
                  type: selectedInvestment.type,
                  amount: String(selectedInvestment.amount),
                  profitability: String(selectedInvestment.profitability),
                  monthlyReturn: String(selectedInvestment.monthlyReturn),
                  risk: selectedInvestment.risk as "Baixo" | "Médio" | "Alto",
                  date: new Date(selectedInvestment.date)
                    .toISOString()
                    .split("T")[0],
                }
              : undefined
          }
          onSubmit={handleSubmitInvestment}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedInvestment(null);
          }}
        />
      </Modal>
    </AppShell>
  );
}
