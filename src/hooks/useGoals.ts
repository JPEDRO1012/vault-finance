"use client";

import { useEffect, useState } from "react";

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchGoals() {
    try {
      setLoading(true);

      const response = await fetch("/api/goals");

      if (!response.ok) {
        setGoals([]);
        return;
      }

      const data = await response.json();

      setGoals(data);
    } catch (error) {
      console.error("Erro ao carregar metas:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,
    refetch: fetchGoals,
  };
}