"use client";

import jsPDF from "jspdf";

import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { PageLoader } from "@/components/ui/PageLoader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useMonthlyComparison } from "@/hooks/useMonthlyComparison";
import { formatCurrency } from "@/lib/formatters";

export default function ReportsPage() {
  const { monthlyComparison, bestMonth, worstMonth, loading } =
    useMonthlyComparison();

  function handleExportPDF() {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(10, 12, 24);
    pdf.rect(0, 0, pageWidth, 38, "F");

    pdf.setFillColor(0, 0, 0);
    pdf.roundedRect(14, 10, 14, 14, 3, 3, "F");

    pdf.setFillColor(255, 255, 255);

    pdf.triangle(17, 20, 25, 20, 21, 13, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Vault Finance", 31, 18);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(180, 180, 190);
    pdf.text("Relatório financeiro inteligente", 31, 25);

    pdf.setTextColor(90, 90, 100);
    pdf.setFontSize(9);
    pdf.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, 14, 48);

    pdf.setTextColor(20, 20, 30);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Resumo financeiro", 14, 60);

    const cards = [
      ["Receita acumulada", formatCurrency(totalRevenue)],
      ["Despesas acumuladas", formatCurrency(totalExpenses)],
      ["Saldo acumulado", formatCurrency(totalBalance)],
      ["Meses analisados", String(monthlyComparison.length)],
    ];

    let cardX = 14;
    let cardY = 70;

    cards.forEach((card, index) => {
      if (index === 2) {
        cardX = 14;
        cardY += 34;
      }

      pdf.setFillColor(245, 245, 248);
      pdf.roundedRect(cardX, cardY, 86, 24, 4, 4, "F");

      pdf.setTextColor(90, 90, 100);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(card[0], cardX + 5, cardY + 8);

      pdf.setTextColor(20, 20, 30);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text(card[1], cardX + 5, cardY + 18);

      cardX += 94;
    });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(20, 20, 30);
    pdf.text("Comparativo mensal", 14, 150);

    let y = 162;

    pdf.setFillColor(124, 58, 237);
    pdf.roundedRect(14, y - 7, 182, 10, 2, 2, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.text("Mês", 18, y);
    pdf.text("Receitas", 42, y);
    pdf.text("Despesas", 82, y);
    pdf.text("Saldo", 126, y);
    pdf.text("Transações", 162, y);

    y += 10;

    monthlyComparison.forEach((item, index) => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }

      if (index % 2 === 0) {
        pdf.setFillColor(248, 248, 250);
        pdf.rect(14, y - 6, 182, 9, "F");
      }

      pdf.setTextColor(40, 40, 50);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);

      pdf.text(item.month, 18, y);
      pdf.text(formatCurrency(item.revenue), 42, y);
      pdf.text(formatCurrency(item.expenses), 82, y);

      if (item.balance >= 0) {
        pdf.setTextColor(22, 163, 74);
      } else {
        pdf.setTextColor(220, 38, 38);
      }

      pdf.text(formatCurrency(item.balance), 126, y);

      pdf.setTextColor(40, 40, 50);
      pdf.text(String(item.transactions), 166, y);

      y += 9;
    });

    pdf.setFillColor(10, 12, 24);
    pdf.rect(0, 287, pageWidth, 10, "F");

    pdf.setTextColor(180, 180, 190);
    pdf.setFontSize(8);
    pdf.text("Vault Finance • Relatório gerado automaticamente", 14, 293);

    pdf.save("vault-finance-relatorio.pdf");
  }
  if (loading) {
    return (
      <AppShell>
        <PageLoader />
      </AppShell>
    );
  }

  const totalRevenue = monthlyComparison.reduce(
    (acc, item) => acc + item.revenue,
    0,
  );

  const totalExpenses = monthlyComparison.reduce(
    (acc, item) => acc + item.expenses,
    0,
  );

  const totalBalance = monthlyComparison.reduce(
    (acc, item) => acc + item.balance,
    0,
  );

  return (
    <AppShell>
      <div id="report-content">
        <div className="flex items-start justify-between gap-4">
          <SectionHeader
            title="Relatórios financeiros"
            description="Comparativos mensais, análise de desempenho e evolução financeira."
          />

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 text-sm font-medium transition hover:bg-violet-600"
          >
            <Download size={18} />
            Exportar PDF
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Receita acumulada"
            value={totalRevenue}
            change={8.4}
          />

          <StatCard
            title="Despesas acumuladas"
            value={totalExpenses}
            change={-3.2}
          />

          <StatCard title="Saldo acumulado" value={totalBalance} change={5.9} />

          <StatCard
            title="Meses analisados"
            value={monthlyComparison.length}
            change={2.1}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-500 p-3">
                <TrendingUp size={22} />
              </div>

              <div>
                <p className="text-sm text-zinc-300">Melhor mês</p>

                <h3 className="mt-2 text-2xl font-semibold">
                  {bestMonth?.month || "--"}
                </h3>

                <p className="mt-2 text-sm text-emerald-300">
                  Saldo de {formatCurrency(bestMonth?.balance || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-red-500 p-3">
                <ArrowDownRight size={22} />
              </div>

              <div>
                <p className="text-sm text-zinc-300">Pior mês</p>

                <h3 className="mt-2 text-2xl font-semibold">
                  {worstMonth?.month || "--"}
                </h3>

                <p className="mt-2 text-sm text-red-300">
                  Saldo de {formatCurrency(worstMonth?.balance || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-[#10131F] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Comparativo mensal</h3>

              <p className="text-sm text-zinc-400">
                Receitas, despesas e saldo por mês.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-sm text-zinc-400">
                  <th className="pb-4">Mês</th>
                  <th className="pb-4">Receitas</th>
                  <th className="pb-4">Despesas</th>
                  <th className="pb-4">Saldo</th>
                  <th className="pb-4">Transações</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {monthlyComparison.map((item) => (
                  <tr
                    key={item.month}
                    className="border-b border-white/5 text-sm"
                  >
                    <td className="py-4 font-medium">{item.month}</td>

                    <td className="py-4 text-emerald-400 font-semibold">
                      {formatCurrency(item.revenue)}
                    </td>

                    <td className="py-4 text-red-400 font-semibold">
                      {formatCurrency(item.expenses)}
                    </td>

                    <td
                      className={
                        item.balance >= 0
                          ? "py-4 font-semibold text-emerald-400"
                          : "py-4 font-semibold text-red-400"
                      }
                    >
                      {formatCurrency(item.balance)}
                    </td>

                    <td className="py-4 text-zinc-400">{item.transactions}</td>

                    <td className="py-4">
                      <div
                        className={
                          item.balance >= 0
                            ? "inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 px-3 py-2 text-xs text-emerald-300"
                            : "inline-flex items-center gap-2 rounded-xl bg-red-500/15 px-3 py-2 text-xs text-red-300"
                        }
                      >
                        {item.balance >= 0 ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}

                        {item.balance >= 0 ? "Positivo" : "Negativo"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {monthlyComparison.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Wallet size={40} className="mx-auto text-zinc-600" />

                  <p className="mt-4 text-sm text-zinc-500">
                    Nenhuma movimentação encontrada ainda.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
