import { NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const monthNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

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

  const monthlyMap = new Map<
    string,
    {
      month: string;
      revenue: number;
      expenses: number;
      balance: number;
      transactions: number;
    }
  >();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = monthNames[date.getMonth()];

    const current = monthlyMap.get(month) || {
      month,
      revenue: 0,
      expenses: 0,
      balance: 0,
      transactions: 0,
    };

    if (transaction.type === "income") {
      current.revenue += transaction.amount;
    } else {
      current.expenses += transaction.amount;
    }

    current.balance = current.revenue - current.expenses;
    current.transactions += 1;

    monthlyMap.set(month, current);
  });

  const monthlyComparison = Array.from(monthlyMap.values());

  const bestMonth = [...monthlyComparison].sort(
    (a, b) => b.balance - a.balance
  )[0];

  const worstMonth = [...monthlyComparison].sort(
    (a, b) => a.balance - b.balance
  )[0];

  return NextResponse.json({
    monthlyComparison,
    bestMonth,
    worstMonth,
  });
}