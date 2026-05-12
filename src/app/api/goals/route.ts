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

  const goals = await prisma.goal.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(goals);
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

  const { title, target, current, deadline } = body;

  if (!title || !target || current === undefined || !deadline) {
    return NextResponse.json(
      { message: "Preencha todos os campos obrigatórios." },
      { status: 400 }
    );
  }

  const goal = await prisma.goal.create({
    data: {
      title,
      target: Number(target),
      current: Number(current),
      deadline,
      userId,
    },
  });

  return NextResponse.json(goal, { status: 201 });
}