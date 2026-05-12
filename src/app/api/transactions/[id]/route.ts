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

  const { title, amount, category, type, date } = body;

  if (!title || !amount || !category || !type || !date) {
    return NextResponse.json(
      { message: "Preencha todos os campos obrigatórios." },
      { status: 400 }
    );
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!transaction) {
    return NextResponse.json(
      { message: "Transação não encontrada." },
      { status: 404 }
    );
  }

  const updatedTransaction = await prisma.transaction.update({
    where: {
      id,
    },
    data: {
      title,
      amount: Number(amount),
      category,
      type,
      date: new Date(date),
    },
  });

  return NextResponse.json(updatedTransaction);
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

  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!transaction) {
    return NextResponse.json(
      { message: "Transação não encontrada." },
      { status: 404 }
    );
  }

  await prisma.transaction.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    message: "Transação removida com sucesso.",
  });
}