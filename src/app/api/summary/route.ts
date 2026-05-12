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

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
    },
  });

  const investments = await prisma.investment.findMany({
    where: {
      userId,
    },
  });

  const totalRevenue = transactions
    .filter((item) => item.type === "income")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => acc + item.amount, 0);

  const totalInvested = investments.reduce(
    (acc, item) => acc + item.amount,
    0
  );

  const estimatedMonthlyReturn = investments.reduce(
    (acc, item) => acc + item.monthlyReturn,
    0
  );

  const balance = totalRevenue - totalExpenses;

  const patrimony = balance + totalInvested;

  const monthlyProfitability =
    totalInvested > 0
      ? (estimatedMonthlyReturn / totalInvested) * 100
      : 0;

  return NextResponse.json({
    balance,
    patrimony,
    totalRevenue,
    totalExpenses,
    totalInvested,
    estimatedMonthlyReturn,
    monthlyProfitability,
    transactionsCount: transactions.length,
    investmentsCount: investments.length,
  });
}