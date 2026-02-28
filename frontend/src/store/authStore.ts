import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  _id: String;
  email: String;
  fullName: String;
  role: "STUDENT" | "TEACHER" | "ADMIN";
};

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  logOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logOut: () => set({ user: null }),
    }),
    { name: "auth-storage" },
  ),
);
