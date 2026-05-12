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

  const investments = await prisma.investment.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(investments);
}

export async function POST(request: Request) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json(
      { message: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  const body = await request.json();

  const {
    name,
    type,
    amount,
    profitability,
    monthlyReturn,
    risk,
    date,
  } = body;

  if (
    !name ||
    !type ||
    !amount ||
    profitability === undefined ||
    monthlyReturn === undefined ||
    !risk ||
    !date
  ) {
    return NextResponse.json(
      { message: "Preencha todos os campos obrigatórios." },
      { status: 400 }
    );
  }

  const investment = await prisma.investment.create({
    data: {
      name,
      type,
      amount: Number(amount),
      profitability: Number(profitability),
      monthlyReturn: Number(monthlyReturn),
      risk,
      date: new Date(date),
      userId,
    },
  });

  return NextResponse.json(investment, { status: 201 });
}