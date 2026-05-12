"use client";

import { useEffect, useState } from "react";

interface FinanceSummary {
  balance: number;
  patrimony: number;
  totalRevenue: number;
  totalExpenses: number;
  totalInvested: number;
  estimatedMonthlyReturn: number;
  monthlyProfitability: number;
}

export function useFinanceSummary() {
  const [summary, setSummary] = useState<FinanceSummary>({
    balance: 0,
    patrimony: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    totalInvested: 0,
    estimatedMonthlyReturn: 0,
    monthlyProfitability: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch("/api/summary");
        const data = await response.json();

        setSummary(data);
      } catch (error) {
        console.error("Erro ao carregar summary:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  return {
    ...summary,
    loading,
  };
}