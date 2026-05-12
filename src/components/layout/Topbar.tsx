"use client";

import { Bell, Search } from "lucide-react";

import { useAuthUser } from "@/hooks/useAuthUser";

export function Topbar() {
  const { user } = useAuthUser();

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-[#0F111A]/80 px-6 py-5 backdrop-blur-xl">
      <div>
        <h2 className="text-xl font-semibold">
          Olá,{" "}
          <span className="text-violet-400">
            {user?.name || "Usuário"}
          </span>
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Bem-vindo ao seu painel financeiro.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 lg:flex">
          <Search size={18} className="text-zinc-500" />

          <input
            placeholder="Buscar..."
            className="bg-transparent text-sm outline-none placeholder:text-zinc-500"
          />
        </div>

        <button className="relative rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400" />
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 font-semibold">
            {user?.name?.charAt(0) || "U"}
          </div>

          <div className="hidden text-sm lg:block">
            <p className="font-medium">
              {user?.name || "Usuário"}
            </p>

            <p className="text-xs text-zinc-500">
              {user?.email || "email@email.com"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}