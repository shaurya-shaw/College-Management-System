import axios from "axios";
import { api } from "../services/api";
import { create } from "zustand";

export type CourseProps = {
  subject: {
    name: string;
    _id: string;
  };
  teacher: {
    fullName: string;
    _id: string;
    email: string;
  };
};

export type CourseStore = {
  courses: CourseProps[];
  loading: boolean;
  error: string | null;
  success: string | null;
  clearError: () => void;
  clearSuccess: () => void;
  fetchCourses: () => Promise<void>;
};

export const useCoursesStore = create<CourseStore>((set) => ({
  courses: [],
  loading: false,
  error: null,
  success: null,
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: null }),
  fetchCourses: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/get-Mysubjects");
      set({ courses: response.data.subjects || [] });
      set({ success: "Courses fetched successfully" });
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "Failed to fetch courses";
      set({ error: msg || "Failed to fetch courses" });
    } finally {
      set({ loading: false });
    }
  },
}));
