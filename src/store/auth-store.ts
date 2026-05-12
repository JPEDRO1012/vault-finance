import { create } from "zustand";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthStore = {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  clearUser: () =>
    set({
      user: null,
      loading: false,
    }),
}));