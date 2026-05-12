"use client";

import { useEffect, useState } from "react";

type ProfileInsights = {
  riskProfile: string;
  riskDescription: string;
  plan: string;
  mainObjective: string;
  savingsRate: number;
  goalsProgress: number;
  totalIncome: number;
  totalExpenses: number;
  totalInvested: number;
  goalsCount: number;
  investmentsCount: number;
  transactionsCount: number;
  insights: string[];
};

export function useProfileInsights() {
  const [insights, setInsights] =
    useState<ProfileInsights | null>(null);

  const [loading, setLoading] = useState(true);

  async function fetchInsights() {
    try {
      setLoading(true);

      const response = await fetch("/api/profile/insights");

      if (!response.ok) {
        setInsights(null);
        return;
      }

      const data = await response.json();

      setInsights(data);
    } catch (error) {
      console.error("Erro ao carregar insights do perfil:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInsights();
  }, []);

  return {
    insights,
    loading,
    refetch: fetchInsights,
  };
}