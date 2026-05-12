"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CalendarDays, Target, TrendingUp, Wallet } from "lucide-react";

import { GoalForm, GoalFormData } from "@/components/forms/GoalForm";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/PageLoader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useGoals } from "@/hooks/useGoals";
import { formatCurrency } from "@/lib/formatters";

type Goal = {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
};

export default function GoalsPage() {
  const { goals, loading, refetch } = useGoals();

  const [localGoals, setLocalGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLocalGoals(goals);
  }, [goals]);

  if (loading) {
    return (
      <AppShell>
        <PageLoader />
      </AppShell>
    );
  }

  const totalTarget = localGoals.reduce((acc, goal) => acc + goal.target, 0);
  const totalCurrent = localGoals.reduce((acc, goal) => acc + goal.current, 0);
  const totalRemaining = totalTarget - totalCurrent;

  const globalProgress =
    totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  function openCreateModal() {
    setSelectedGoal(null);
    setIsModalOpen(true);
  }

  function openEditModal(goal: Goal) {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  }

  async function handleSubmitGoal(data: GoalFormData) {
    if (!data.title || !data.target || !data.current || !data.deadline) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const isEditing = Boolean(selectedGoal);

      const response = await fetch(
        isEditing ? `/api/goals/${selectedGoal?.id}` : "/api/goals",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: data.title,
            target: Number(data.target),
            current: Number(data.current),
            deadline: data.deadline,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.message || "Erro ao salvar meta.");
        return;
      }

      toast.success(
        isEditing ? "Meta atualizada com sucesso!" : "Meta criada com sucesso!"
      );

      setIsModalOpen(false);
      setSelectedGoal(null);

      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Erro interno ao salvar meta.");
    }
  }

  async function handleDeleteGoal(id: string) {
    const confirmed = window.confirm("Deseja realmente excluir esta meta?");

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao excluir meta.");
        return;
      }

      toast.success("Meta removida com sucesso!");

      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Erro interno ao excluir meta.");
    }
  }

  return (
    <AppShell>
      <SectionHeader
        title="Metas financeiras"
        description="Acompanhe seus objetivos, progresso acumulado e evolução patrimonial."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total em metas" value={totalTarget} change={10.2} />
        <StatCard title="Já acumulado" value={totalCurrent} change={6.8} />
        <StatCard title="Ainda falta" value={totalRemaining} change={-2.4} />
        <StatCard
          title="Progresso geral"
          value={globalProgress}
          type="percent"
          change={4.6}
        />
      </div>

      <div className="mt-6 rounded-3xl border border-violet-500/30 bg-violet-500/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-violet-500 p-3">
              <TrendingUp size={22} />
            </div>

            <div>
              <h3 className="text-lg font-semibold">Insight inteligente</h3>

              <p className="mt-1 max-w-3xl text-sm text-zinc-300">
                Suas metas estão conectadas ao MySQL e vinculadas à sua conta.
                Você pode criar, editar e excluir objetivos financeiros reais.
              </p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-medium transition hover:bg-violet-600"
          >
            Nova meta
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {localGoals.map((goal) => {
          const progress =
            goal.target > 0 ? (goal.current / goal.target) * 100 : 0;

          const remaining = goal.target - goal.current;
          const monthlySuggestion = remaining / 12;

          const status =
            progress >= 70
              ? "Avançada"
              : progress >= 40
              ? "Em progresso"
              : "Inicial";

          return (
            <div
              key={goal.id}
              className="rounded-3xl border border-white/10 bg-[#10131F] p-6 transition hover:border-violet-500/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-2xl bg-white/5 p-3 text-violet-300">
                  <Target size={22} />
                </div>

                <Badge
                  variant={
                    progress >= 70
                      ? "success"
                      : progress >= 40
                      ? "warning"
                      : "default"
                  }
                >
                  {status}
                </Badge>
              </div>

              <h3 className="mt-6 text-xl font-semibold">{goal.title}</h3>

              <div className="mt-4">
                <ProgressBar value={progress} />
              </div>

              <p className="mt-3 text-sm text-zinc-400">
                {progress.toFixed(1)}% concluído
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Wallet size={18} />
                    <span className="text-sm">Atual</span>
                  </div>

                  <span className="font-semibold">
                    {formatCurrency(goal.current)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Target size={18} />
                    <span className="text-sm">Meta</span>
                  </div>

                  <span className="font-semibold">
                    {formatCurrency(goal.target)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <CalendarDays size={18} />
                    <span className="text-sm">Prazo</span>
                  </div>

                  <span className="font-semibold">{goal.deadline}</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                <p className="text-sm text-zinc-400">Sugestão mensal</p>

                <p className="mt-1 text-lg font-semibold text-violet-300">
                  {formatCurrency(monthlySuggestion)}
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => openEditModal(goal)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-300 transition hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  <Pencil size={14} />
                  Editar
                </button>

                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                  Excluir
                </button>
              </div>
            </div>
          );
        })}

        {localGoals.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center xl:col-span-3">
            <p className="text-sm text-zinc-400">
              Nenhuma meta cadastrada ainda.
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGoal(null);
        }}
        title={selectedGoal ? "Editar meta financeira" : "Nova meta financeira"}
        description={
          selectedGoal
            ? "Atualize os dados da meta selecionada."
            : "Cadastre um novo objetivo financeiro."
        }
      >
        <GoalForm
          initialData={
            selectedGoal
              ? {
                  title: selectedGoal.title,
                  target: String(selectedGoal.target),
                  current: String(selectedGoal.current),
                  deadline: selectedGoal.deadline,
                }
              : undefined
          }
          onSubmit={handleSubmitGoal}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedGoal(null);
          }}
        />
      </Modal>
    </AppShell>
  );
}