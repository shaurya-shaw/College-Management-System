import { create } from "zustand";
import { api } from "../services/api";

export type StudentProps = {
  fullName: string;
  email: string;
  password: string;
  _id: string;
  role: string;
  branch: {
    _id: string;
    name: string;
  };
};

type StudentStore = {
  student: StudentProps[];
  fetchStudents: () => Promise<void>;
  addStudent: (data: Omit<StudentProps, "_id">) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
};

export const useStudentStore = create<StudentStore>((set) => ({
  student: [],
  fetchStudents: async () => {
    try {
      const res = await api.get("/students");
      console.log(res.data);
      set({ student: res.data.users || [] });
    } catch (error) {
      console.log(error);
    }
  },
  addStudent: async (data) => {
    try {
      const res = await api.post("/add-user", data);
      console.log(res.data);
      set((state) => ({ student: [...state.student, res.data.user] }));
    } catch (error) {
      console.log(error);
    }
  },
  deleteStudent: async (id) => {
    try {
      await api.delete(`/users/${id}`);
      set((state) => ({ student: state.student.filter((t) => t._id !== id) }));
    } catch (error) {
      console.log(error);
    }
  },
}));
