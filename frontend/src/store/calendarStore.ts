import { create } from "zustand";
import axios from "axios";
import { api } from "../services/api";

export interface CalendarDay {
  _id: string;
  date: string;
  day: string;
  isHoliday: boolean;
}

interface CalendarState {
  calendar: CalendarDay[];
  loading: boolean;
  generating: boolean;
  toggling: string | null;
  error: string | null;
  success: string | null;
  currentDate: Date;

  setCurrentDate: (date: Date) => void;
  fetchCalendar: (year: number, month: number) => Promise<void>;
  generateCalendar: (year: number) => Promise<void>;
  toggleHoliday: (id: string) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useCalendarStore = create<CalendarState>((set, get) => ({
  calendar: [],
  loading: false,
  generating: false,
  toggling: null,
  error: null,
  success: null,
  currentDate: new Date(),

  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: null }),

  setCurrentDate: (date) => {
    set({ currentDate: date });
    get().fetchCalendar(date.getFullYear(), date.getMonth() + 1);
  },

  fetchCalendar: async (year, month) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/calendar?year=${year}&month=${month}`);
      set({ calendar: data.calendar });
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Failed to fetch";
      set({ error: msg || "Failed to fetch" });
    } finally {
      set({ loading: false });
    }
  },

  generateCalendar: async (year) => {
    set({ generating: true, error: null, success: null });
    try {
      const { data } = await api.post(`/generate-calendar?year=${year}`);
      set({ success: data.message || `Calendar ${year} generated!` });
      const d = get().currentDate;
      await get().fetchCalendar(d.getFullYear(), d.getMonth() + 1);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Failed to generate";
      set({ error: msg || "Failed to generate" });
    } finally {
      set({ generating: false });
    }
  },

  toggleHoliday: async (id) => {
    set({ toggling: id, error: null });
    try {
      const { data } = await api.patch(`/calendar/${id}`);
      set((s) => ({
        calendar: s.calendar.map((d) =>
          d._id === id ? { ...d, isHoliday: data.data.isHoliday } : d,
        ),
      }));
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Failed to toggle";
      set({ error: msg || "Failed to toggle" });
    } finally {
      set({ toggling: null });
    }
  },
}));
