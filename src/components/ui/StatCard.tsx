import { formatCurrency, formatPercent } from "@/lib/formatters";

type Props = {
  title: string;
  value: number;
  type?: "currency" | "percent";
  change?: number;
};

export function StatCard({ title, value, type = "currency", change }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#10131F] p-6 shadow-xl shadow-black/20">
      <p className="text-sm text-zinc-400">{title}</p>

      <h3 className="mt-3 text-2xl font-semibold">
        {type === "currency" ? formatCurrency(value) : formatPercent(value)}
      </h3>

      {change !== undefined && (
        <p className={change >= 0 ? "mt-2 text-sm text-emerald-400" : "mt-2 text-sm text-red-400"}>
          {formatPercent(change)} no mês
        </p>
      )}
    </div>
  );
}