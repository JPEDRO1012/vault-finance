"use client";

import { ExpensesDonutChart } from "@/components/charts/ExpensesDonutChart";
import { PatrimonyChart } from "@/components/charts/PatrimonyChart";
import { RevenueExpenseChart } from "@/components/charts/RevenueExpenseChart";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/PageLoader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useDashboardCharts } from "@/hooks/useDashboardCharts";
import { useFinanceSummary } from "@/hooks/useFinanceSummary";
import { formatCurrency } from "@/lib/formatters";
import {
  AlertTriangle,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default function DashboardPage() {
  const summary = useFinanceSummary();

  const {
    monthlyData,
    expenseCategories,
    loading: chartsLoading,
  } = useDashboardCharts();

  if (summary.loading || chartsLoading) {
    return (
      <AppShell>
        <PageLoader />
      </AppShell>
    );
  }

  const totalTransactions =
    (summary as any).transactionsCount || monthlyData.length;

  return (
    <AppShell>
      <SectionHeader
        title="Dashboard financeiro"
        description="Visão geral real do seu saldo, patrimônio, investimentos e movimentações."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Saldo atual" value={summary.balance} change={8.2} />

        <StatCard
          title="Patrimônio total"
          value={summary.patrimony}
          change={12.4}
        />

        <StatCard
          title="Total investido"
          value={summary.totalInvested}
          change={6.7}
        />

        <StatCard
          title="Rentabilidade mensal"
          value={summary.monthlyProfitability}
          type="percent"
          change={summary.monthlyProfitability}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-violet-500/30 bg-violet-500/10 p-6 xl:col-span-2">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-violet-500 p-3">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h3 className="text-lg font-semibold">Alerta inteligente</h3>

              <p className="mt-1 text-sm leading-relaxed text-zinc-300">
                Seu dashboard agora está conectado ao MySQL. As receitas,
                despesas, saldo e patrimônio são calculados com base nos dados
                reais cadastrados.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-emerald-400" size={24} />

            <div>
              <p className="text-sm text-zinc-400">Transações reais</p>

              <h3 className="text-xl font-semibold">{totalTransactions}</h3>
            </div>
          </div>

          <p className="mt-5 text-sm text-emerald-400">
            Dados carregados diretamente do banco
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6 xl:col-span-2">
          <SectionHeader title="Evolução patrimonial real" />
          <PatrimonyChart data={monthlyData} />
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
          <SectionHeader title="Resumo da conta" />

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400">
                  <Wallet size={18} />
                </div>

                <span className="text-sm text-zinc-300">Receitas</span>
              </div>

              <strong className="text-emerald-400">
                {formatCurrency(summary.totalRevenue)}
              </strong>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-red-500/15 p-2 text-red-400">
                  <CreditCard size={18} />
                </div>

                <span className="text-sm text-zinc-300">Despesas</span>
              </div>

              <strong className="text-red-400">
                {formatCurrency(summary.totalExpenses)}
              </strong>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-500/15 p-2 text-violet-400">
                  <PiggyBank size={18} />
                </div>

                <span className="text-sm text-zinc-300">Investido</span>
              </div>

              <strong className="text-violet-300">
                {formatCurrency(summary.totalInvested)}
              </strong>
            </div>

            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
              <p className="text-sm text-zinc-400">Rendimento estimado</p>

              <p className="mt-1 text-xl font-semibold text-emerald-400">
                {formatCurrency(summary.estimatedMonthlyReturn)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
          <SectionHeader title="Receitas vs despesas reais" />
          <RevenueExpenseChart data={monthlyData} />
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
          <SectionHeader title="Gastos reais por categoria" />
          <ExpensesDonutChart data={expenseCategories} />
        </div>
      </div>
    </AppShell>
  );
}