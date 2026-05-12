"use client";

import {
  BarChart3,
  Bell,
  Brain,
  Lock,
  ShieldCheck,
  Target,
  User,
  Wallet,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/PageLoader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useProfileInsights } from "@/hooks/useProfileInsights";
import { formatCurrency } from "@/lib/formatters";

export default function ProfilePage() {
  const { user, loading: userLoading } = useAuthUser();
  const { insights, loading: insightsLoading } = useProfileInsights();

  if (userLoading || insightsLoading) {
    return (
      <AppShell>
        <PageLoader />
      </AppShell>
    );
  }

  const userName = user?.name || "Usuário";
  const userEmail = user?.email || "email@email.com";

  const initials = userName
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const riskProfile = insights?.riskProfile || "Não definido";

  return (
    <AppShell>
      <SectionHeader
        title="Perfil e configurações"
        description="Dados reais do usuário, inteligência financeira e preferências da conta."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6 xl:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-violet-500 text-4xl font-bold">
              {initials}
            </div>

            <h2 className="mt-5 text-2xl font-semibold">{userName}</h2>

            <p className="mt-1 text-sm text-zinc-400">
              {userEmail}
            </p>

            <div className="mt-4">
              <Badge
                variant={
                  riskProfile === "Agressivo"
                    ? "danger"
                    : riskProfile === "Moderado"
                    ? "warning"
                    : "success"
                }
              >
                Perfil {riskProfile.toLowerCase()}
              </Badge>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-zinc-400">
                Plano atual
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                {insights?.plan || "Vault Essential"}
              </h3>
            </div>

            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-zinc-400">
                Objetivo principal
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                {insights?.mainObjective ||
                  "Organização financeira"}
              </h3>
            </div>

            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-zinc-400">
                Taxa de economia
              </p>

              <h3 className="mt-1 text-lg font-semibold text-emerald-400">
                {(insights?.savingsRate || 0).toFixed(1)}%
              </h3>
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-400">
                <Brain size={22} />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Inteligência financeira
                </h3>

                <p className="text-sm text-zinc-400">
                  Insights automáticos com base no seu comportamento financeiro.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {insights?.insights.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-400">
                  <Wallet size={22} />
                </div>

                <div>
                  <p className="text-sm text-zinc-400">
                    Patrimônio investido
                  </p>

                  <h3 className="mt-1 text-2xl font-semibold">
                    {formatCurrency(
                      insights?.totalInvested || 0
                    )}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-500/15 p-3 text-blue-400">
                  <Target size={22} />
                </div>

                <div>
                  <p className="text-sm text-zinc-400">
                    Metas financeiras
                  </p>

                  <h3 className="mt-1 text-2xl font-semibold">
                    {insights?.goalsCount || 0}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-400">
                  <BarChart3 size={22} />
                </div>

                <div>
                  <p className="text-sm text-zinc-400">
                    Transações registradas
                  </p>

                  <h3 className="mt-1 text-2xl font-semibold">
                    {insights?.transactionsCount || 0}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-500/15 p-3 text-orange-400">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <p className="text-sm text-zinc-400">
                    Perfil de risco
                  </p>

                  <h3 className="mt-1 text-2xl font-semibold">
                    {riskProfile}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/5 p-3 text-zinc-300">
                <Lock size={22} />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Segurança da conta
                </h3>

                <p className="text-sm text-zinc-400">
                  Configurações de autenticação e proteção.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={18}
                    className="text-emerald-400"
                  />

                  <p className="text-sm font-medium">
                    Conta protegida
                  </p>
                </div>

                <p className="mt-2 text-sm text-zinc-400">
                  Seu login está protegido com autenticação segura JWT.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2">
                  <Bell
                    size={18}
                    className="text-violet-400"
                  />

                  <p className="text-sm font-medium">
                    Alertas inteligentes
                  </p>
                </div>

                <p className="mt-2 text-sm text-zinc-400">
                  Sistema preparado para notificações financeiras futuras.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2">
                  <Brain
                    size={18}
                    className="text-blue-400"
                  />

                  <p className="text-sm font-medium">
                    IA financeira
                  </p>
                </div>

                <p className="mt-2 text-sm text-zinc-400">
                  Insights automáticos baseados nos seus dados reais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}