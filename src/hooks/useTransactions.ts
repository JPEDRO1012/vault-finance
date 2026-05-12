"use client";

import { useEffect, useState } from "react";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTransactions() {
    try {
      setLoading(true);

      const response = await fetch("/api/transactions");

      if (!response.ok) {
        setTransactions([]);
        return;
      }

      const data = await response.json();

      setTransactions(data);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    setTransactions,
    loading,
    refetch: fetchTransactions,
  };
}