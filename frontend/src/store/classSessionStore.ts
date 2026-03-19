import { create } from "zustand";
import { api } from "../services/api";

export type ClassSessionProps = {
  branch: { name: string; _id: string } | string;
  subject: { name: string; _id: string } | string;
  day: string;
  timeSlot: string;
  teacher:
    | { fullName: string; _id: string }
    | string
    | { fullName: string; _id: string; email: string };
  _id: string;
  status?: "Not started" | "Ongoing" | "Completed";
};

type ClassSessionStore = {
  classSession: ClassSessionProps[];
  totalPages: number;
  fetchClassSession: (page?: number) => Promise<void>;
  addClassSession: (data: ClassSessionProps) => Promise<void>;
  DeleteClassSession: (id: string) => Promise<void>;
  fetchTeacherSession: (day: string) => Promise<void>;
  fetchStudentSession: (day: string) => Promise<void>;
  fetchTeacherDashboard: (day: string) => Promise<void>;
  fetchStudentDashboard: (day: string) => Promise<void>;
};

export const useClassSessionStore = create<ClassSessionStore>((set) => ({
  classSession: [],
  totalPages: 0,
  fetchClassSession: async (page?: number) => {
    try {
      let url = `/all-class-session`;
      if (page) {
        url += `/?page=${page}`;
      }
      const res = await api.get(url);
      console.log(res.data);
      set({
        classSession: res.data.classSessions || [],
        totalPages: res.data.totalPages,
      });
    } catch (error) {
      console.log(error);
    }
  },
  addClassSession: async (data) => {
    try {
      const res = await api.post("/class-session", data);
      console.log(res.data);
      set((state) => ({
        classSession: [...state.classSession, res.data.classSession],
      }));
    } catch (error) {
      console.log(error);
    }
  },
  DeleteClassSession: async (id) => {
    try {
      await api.delete(`/class-session/${id}`);
      set((state) => ({
        classSession: state.classSession.filter((t) => t._id !== id),
      }));
    } catch (error) {
      console.log(error);
    }
  },
  fetchTeacherSession: async (day) => {
    try {
      const res = await api.get(`/class-sessions?day=${day}`);
      console.log(res.data);
      set({ classSession: res.data.classSessions || [] });
    } catch (error) {
      console.log(error);
    }
  },
  fetchStudentSession: async (day) => {
    try {
      const res = await api.get(`/student-class-sessions?day=${day}`);
      console.log(res.data);
      set({ classSession: res.data.classSessions || [] });
    } catch (error) {
      console.log(error);
    }
  },
  fetchTeacherDashboard: async (day) => {
    try {
      const res = await api.get(`/teacher-dashboard?day=${day}`);
      console.log(res.data);
      set({ classSession: res.data.classesWithStatus || [] });
    } catch (error) {
      console.log(error);
    }
  },
  fetchStudentDashboard: async (day) => {
    try {
      const res = await api.get(`/student-dashboard?day=${day}`);
      console.log(res.data);
      set({ classSession: res.data.classesWithStatus || [] });
    } catch (error) {
      console.log(error);
    }
  },
}));
