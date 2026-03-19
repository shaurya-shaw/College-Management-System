import { create } from "zustand";
import { api } from "../services/api";

export type DashboardStats = {
  totalStudents: number;
  totalTeachers: number;
  present: number;
  absent: number;
};

export type StudentDashboardStats = {
  totalClasses: number;
  present: number;
  subject: string;
  percentage: number;
};

export type DashboardStore = {
  stats: DashboardStats | null;
  studentStats: StudentDashboardStats[] | null;
  fetchStats: () => Promise<void>;
  fetchStudentStats: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  studentStats: null,
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
  fetchStudentStats: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/attendance-summary");
      set({ studentStats: res.data.summary, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch student dashboard stats", loading: false });
      console.log(error);
    }
  },
}));
