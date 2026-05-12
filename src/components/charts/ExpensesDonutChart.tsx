"use client";

import { formatCurrency } from "@/lib/formatters";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type ExpenseCategory = {
  name: string;
  value: number;
};

type ExpensesDonutChartProps = {
  data: ExpenseCategory[];
};

const COLORS = ["#8B5CF6", "#22C55E", "#F59E0B", "#EF4444", "#3B82F6"];

export function ExpensesDonutChart({ data }: ExpensesDonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  if (data.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
        <p className="text-sm text-zinc-400">
          Nenhuma despesa cadastrada ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-h-80 items-center gap-6 lg:grid-cols-2">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={5}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                background: "#10131F",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-zinc-400">Total em despesas</p>
          <h3 className="mt-1 text-3xl font-semibold">{formatCurrency(total)}</h3>
        </div>

        <div className="space-y-3">
          {data.map((item, index) => {
            const percent = total > 0 ? (item.value / total) * 100 : 0;

            return (
              <div key={item.name} className="rounded-2xl bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>

                  <span className="text-sm text-zinc-300">
                    {formatCurrency(item.value)}
                  </span>
                </div>

                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                  {percent.toFixed(1)}% do total
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}