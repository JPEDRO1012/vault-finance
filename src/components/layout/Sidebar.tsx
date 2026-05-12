"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BarChart3,
  CreditCard,
  Goal,
  Home,
  LineChart,
  LogOut,
  Settings,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/transactions", label: "Transações", icon: CreditCard },
  { href: "/investments", label: "Investimentos", icon: TrendingUp },
  { href: "/goals", label: "Metas", icon: Goal },
  { href: "/reports", label: "Relatórios", icon: BarChart3 },
  { href: "/profile", label: "Perfil", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      toast.success("Logout realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao sair da conta.");
    }
  }

  return (
    <aside className="hidden min-h-screen w-72 flex-col border-r border-white/10 bg-[#0B0E17] p-6 lg:flex">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500">
            <LineChart size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              Vault <span className="text-violet-400">Finance</span>
            </h1>

            <p className="text-xs text-zinc-500">
              Financial Intelligence
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                active
                  ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
      >
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
}