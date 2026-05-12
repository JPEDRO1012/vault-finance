"use client";

import { useEffect, useState } from "react";

export type MonthlyComparison = {
  month: string;
  revenue: number;
  expenses: number;
  balance: number;
  transactions: number;
};

type MonthlyComparisonResponse = {
  monthlyComparison: MonthlyComparison[];
  bestMonth?: MonthlyComparison;
  worstMonth?: MonthlyComparison;
};

export function useMonthlyComparison() {
  const [data, setData] = useState<MonthlyComparisonResponse>({
    monthlyComparison: [],
  });

  const [loading, setLoading] = useState(true);

  async function fetchComparison() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/reports/monthly-comparison"
      );

      if (!response.ok) {
        setData({
          monthlyComparison: [],
        });

        return;
      }

      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComparison();
  }, []);

  return {
    ...data,
    loading,
    refetch: fetchComparison,
  };
}