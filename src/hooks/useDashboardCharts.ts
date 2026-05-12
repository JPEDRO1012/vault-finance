"use client";

import { useEffect, useState } from "react";

export type MonthlyData = {
  month: string;
  revenue: number;
  expenses: number;
  patrimony: number;
};

export type ExpenseCategory = {
  name: string;
  value: number;
};

export function useDashboardCharts() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  async function fetchCharts() {
    try {
      setLoading(true);

      const response = await fetch("/api/dashboard/charts");

      if (!response.ok) {
        setMonthlyData([]);
        setExpenseCategories([]);
        return;
      }

      const data = await response.json();

      setMonthlyData(data.monthlyData || []);
      setExpenseCategories(data.expenseCategories || []);
    } catch (error) {
      console.error("Erro ao carregar gráficos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCharts();
  }, []);

  return {
    monthlyData,
    expenseCategories,
    loading,
    refetch: fetchCharts,
  };
}