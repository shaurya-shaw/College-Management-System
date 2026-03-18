import { create } from "zustand";
import { api } from "../services/api";

export type DashboardStats = {
  totalStudents: number;
  totalTeachers: number;
  present: number;
  absent: number;
};

export type DashboardStore = {
  stats: DashboardStats | null;
  fetchStats: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  loading: false,
  error: null,
  fetchStats: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/dashboard-stats");
      set({ stats: res.data.stats, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch dashboard stats", loading: false });
      console.log(error);
    }
  },
}));
