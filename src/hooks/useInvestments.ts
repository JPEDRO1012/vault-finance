"use client";

import { useEffect, useState } from "react";

export interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
  profitability: number;
  monthlyReturn: number;
  risk: string;
  date: string;
}

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchInvestments() {
    try {
      setLoading(true);

      const response = await fetch("/api/investments");

      if (!response.ok) {
        setInvestments([]);
        return;
      }

      const data = await response.json();

      setInvestments(data);
    } catch (error) {
      console.error("Erro ao carregar investimentos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInvestments();
  }, []);

  return {
    investments,
    loading,
    refetch: fetchInvestments,
  };
}