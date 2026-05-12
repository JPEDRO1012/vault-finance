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
    where: { userId },
    orderBy: { date: "asc" },
  });

  const investments = await prisma.investment.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });

  const monthlyMap = new Map<
    string,
    {
      month: string;
      timestamp: number;
      revenue: number;
      expenses: number;
      patrimony: number;
    }
  >();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);

    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

    const current = monthlyMap.get(monthKey) || {
      month: date.toLocaleDateString("pt-BR", {
        month: "short",
      }),
      timestamp: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
      revenue: 0,
      expenses: 0,
      patrimony: 0,
    };

    if (transaction.type === "income") {
      current.revenue += transaction.amount;
    } else {
      current.expenses += transaction.amount;
    }

    monthlyMap.set(monthKey, current);
  });

  investments.forEach((investment) => {
    const date = new Date(investment.date);

    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

    const current = monthlyMap.get(monthKey) || {
      month: date.toLocaleDateString("pt-BR", {
        month: "short",
      }),
      timestamp: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
      revenue: 0,
      expenses: 0,
      patrimony: 0,
    };

    current.patrimony += investment.amount;

    monthlyMap.set(monthKey, current);
  });

  const monthlyData = Array.from(monthlyMap.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(({ timestamp, ...item }) => item);

  const categoryMap = new Map<string, number>();

  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      const current = categoryMap.get(transaction.category) || 0;

      categoryMap.set(transaction.category, current + transaction.amount);
    });

  const expenseCategories = Array.from(categoryMap.entries()).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return NextResponse.json({
    monthlyData,
    expenseCategories,
  });
}