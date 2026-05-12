"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";

export function useAuthUser() {
  const {
    user,
    loading,
    setUser,
    setLoading,
    clearUser,
  } = useAuthStore();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(
          "/api/auth/me"
        );

        if (!response.ok) {
          clearUser();
          return;
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error(error);

        clearUser();
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [
    setUser,
    setLoading,
    clearUser,
  ]);

  return {
    user,
    loading,
  };
}