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

  const { title, target, current, deadline } = body;

  if (!title || !target || current === undefined || !deadline) {
    return NextResponse.json(
      { message: "Preencha todos os campos obrigatórios." },
      { status: 400 }
    );
  }

  const goal = await prisma.goal.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!goal) {
    return NextResponse.json(
      { message: "Meta não encontrada." },
      { status: 404 }
    );
  }

  const updatedGoal = await prisma.goal.update({
    where: {
      id,
    },
    data: {
      title,
      target: Number(target),
      current: Number(current),
      deadline,
    },
  });

  return NextResponse.json(updatedGoal);
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

  const goal = await prisma.goal.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!goal) {
    return NextResponse.json(
      { message: "Meta não encontrada." },
      { status: 404 }
    );
  }

  await prisma.goal.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    message: "Meta removida com sucesso.",
  });
}