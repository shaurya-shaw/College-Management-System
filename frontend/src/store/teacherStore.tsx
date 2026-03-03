import { create } from "zustand";
import { api } from "../services/api";

export type TeacherProps = {
  fullName: string;
  email: string;
  password: string;
  _id: string;
  role: string;
};

type TeacherStore = {
  teacher: TeacherProps[];
  fetchTeachers: () => Promise<void>;
  addTeacher: (data: Omit<TeacherProps, "_id">) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
};

export const useTeacherStore = create<TeacherStore>((set) => ({
  teacher: [],
  fetchTeachers: async () => {
    try {
      const res = await api.get("/teachers");
      console.log(res.data);
      set({ teacher: res.data.users || [] });
    } catch (error) {
      console.log(error);
    }
  },
  addTeacher: async (data) => {
    try {
      const res = await api.post("/add-user", data);
      console.log(res.data);
      set((state) => ({ teacher: [...state.teacher, res.data.user] }));
    } catch (error) {
      console.log(error);
    }
  },
  deleteTeacher: async (id) => {
    try {
      await api.delete(`/users/${id}`);
      set((state) => ({ teacher: state.teacher.filter((t) => t._id !== id) }));
    } catch (error) {
      console.log(error);
    }
  },
}));
