import { NextResponse } from "next/server";

import { getAuthenticatedUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, { params }: Params) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json(
      { message: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  const { id } = await params;

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

  const investment = await prisma.investment.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!investment) {
    return NextResponse.json(
      { message: "Investimento não encontrado." },
      { status: 404 }
    );
  }

  const updatedInvestment = await prisma.investment.update({
    where: {
      id,
    },
    data: {
      name,
      type,
      amount: Number(amount),
      profitability: Number(profitability),
      monthlyReturn: Number(monthlyReturn),
      risk,
      date: new Date(date),
    },
  });

  return NextResponse.json(updatedInvestment);
}

export async function DELETE(request: Request, { params }: Params) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json(
      { message: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  const { id } = await params;

  const investment = await prisma.investment.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!investment) {
    return NextResponse.json(
      { message: "Investimento não encontrado." },
      { status: 404 }
    );
  }

  await prisma.investment.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    message: "Investimento removido com sucesso.",
  });
}