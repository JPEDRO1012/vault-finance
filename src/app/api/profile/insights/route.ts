import { NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json(
      { message: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  const [transactions, investments, goals] = await Promise.all([
    prisma.transaction.findMany({ where: { userId } }),
    prisma.investment.findMany({ where: { userId } }),
    prisma.goal.findMany({ where: { userId } }),
  ]);

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalInvested = investments.reduce((acc, item) => acc + item.amount, 0);

  const totalGoalsTarget = goals.reduce((acc, item) => acc + item.target, 0);
  const totalGoalsCurrent = goals.reduce((acc, item) => acc + item.current, 0);

  const cryptoTotal = investments
    .filter((item) => item.type.toLowerCase().includes("cripto"))
    .reduce((acc, item) => acc + item.amount, 0);

  const stocksTotal = investments
    .filter((item) => item.type.toLowerCase().includes("ações"))
    .reduce((acc, item) => acc + item.amount, 0);

  const fiiTotal = investments
    .filter((item) => item.type.toLowerCase().includes("fundos imobiliários"))
    .reduce((acc, item) => acc + item.amount, 0);

  const fixedIncomeTotal = investments
    .filter(
      (item) =>
        item.type.toLowerCase().includes("cdb") ||
        item.type.toLowerCase().includes("tesouro") ||
        item.type.toLowerCase().includes("poupança")
    )
    .reduce((acc, item) => acc + item.amount, 0);

  const variableRiskRatio =
    totalInvested > 0 ? ((cryptoTotal + stocksTotal) / totalInvested) * 100 : 0;

  const fixedIncomeRatio =
    totalInvested > 0 ? (fixedIncomeTotal / totalInvested) * 100 : 0;

  let riskProfile = "Conservador";
  let riskDescription = "Carteira com foco em segurança e baixa volatilidade.";

  if (variableRiskRatio >= 60 || cryptoTotal / Math.max(totalInvested, 1) > 0.3) {
    riskProfile = "Agressivo";
    riskDescription =
      "Carteira com maior exposição a ativos de risco, como ações e criptomoedas.";
  } else if (variableRiskRatio >= 25 || fiiTotal > 0) {
    riskProfile = "Moderado";
    riskDescription =
      "Carteira equilibrada entre renda fixa, fundos imobiliários e ativos de maior risco.";
  }

  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const goalsProgress =
    totalGoalsTarget > 0 ? (totalGoalsCurrent / totalGoalsTarget) * 100 : 0;

  let mainObjective = "Organização financeira";

  if (goals.length > 0) {
    const biggestGoal = [...goals].sort((a, b) => b.target - a.target)[0];
    mainObjective = biggestGoal.title;
  } else if (totalInvested > 0) {
    mainObjective = "Crescimento patrimonial";
  }

  let plan = "Vault Essential";

  if (
    transactions.length >= 10 ||
    investments.length >= 3 ||
    goals.length >= 3
  ) {
    plan = "Vault Premium";
  }

  const insights = [
    savingsRate >= 20
      ? "Sua taxa de economia está saudável. Você está conseguindo guardar uma boa parte da renda."
      : "Sua taxa de economia ainda pode melhorar. Reduzir despesas recorrentes pode acelerar seus objetivos.",
    totalInvested > 0
      ? `Você possui ${investments.length} investimento(s) cadastrado(s), com perfil ${riskProfile.toLowerCase()}.`
      : "Você ainda não cadastrou investimentos. Adicionar ativos ajuda a acompanhar sua evolução patrimonial.",
    goals.length > 0
      ? `Você possui ${goals.length} meta(s) ativa(s), com progresso geral de ${goalsProgress.toFixed(1)}%.`
      : "Você ainda não possui metas financeiras cadastradas.",
  ];

  return NextResponse.json({
    riskProfile,
    riskDescription,
    plan,
    mainObjective,
    savingsRate,
    goalsProgress,
    totalIncome,
    totalExpenses,
    totalInvested,
    goalsCount: goals.length,
    investmentsCount: investments.length,
    transactionsCount: transactions.length,
    insights,
  });
}